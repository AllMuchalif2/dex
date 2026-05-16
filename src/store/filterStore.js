import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GEN_RANGES, VERSION_TO_GEN, TYPES } from '../utils/filterData';


// Fungsi filter utama (AND logic): interseksi semua kondisi aktif
// typeIds: Set<number>, abilityData: Array<{id: number, isHidden: boolean}>
export function computeFilteredIds(selectedVersion, selectedGen, selectedType, selectedAbility, selectedAbilitySlot, typeIds, abilityData) {
  let result = null;

  // Step 1: Filter Generasi
  if (selectedGen && GEN_RANGES[selectedGen]) {
    const [min, max] = GEN_RANGES[selectedGen];
    result = new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i));
  }

  // Step 2: Filter Versi
  if (selectedVersion) {
    const impliedGen = VERSION_TO_GEN[selectedVersion];
    if (impliedGen && GEN_RANGES[impliedGen]) {
      const [min, max] = GEN_RANGES[impliedGen];
      const versionSet = new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i));
      result = result
        ? new Set([...result].filter((id) => versionSet.has(id)))
        : versionSet;
    }
  }

  // Step 3: Filter Tipe
  if (selectedType && typeIds) {
    const typeSet = typeIds instanceof Set ? typeIds : new Set(typeIds);
    result = result
      ? new Set([...result].filter((id) => typeSet.has(id)))
      : typeSet;
  }

  // Step 4: Filter Ability + Slot
  if (selectedAbility && abilityData) {
    let filteredAbilityIds = abilityData;
    if (selectedAbilitySlot === 'normal') {
      filteredAbilityIds = abilityData.filter((p) => !p.isHidden);
    } else if (selectedAbilitySlot === 'hidden') {
      filteredAbilityIds = abilityData.filter((p) => p.isHidden);
    }
    
    const abilitySet = new Set(filteredAbilityIds.map((p) => p.id));
    result = result
      ? new Set([...result].filter((id) => abilitySet.has(id)))
      : abilitySet;
  }

  const hasFilter = !!selectedVersion || !!selectedGen || !!selectedType || !!selectedAbility;
  if (!hasFilter) return null; // null = tampilkan semua

  return result ? [...result].sort((a, b) => a - b) : [];
}

// Zustand store — filter global, persist ke localStorage
const useFilterStore = create(
  persist(
    (set) => ({
      selectedVersion: null,
      selectedGen: null,
      selectedType: null,
      selectedAbility: null,
      selectedAbilitySlot: 'all', // 'all', 'normal', 'hidden'

      setSelectedVersion: (v) => set({ selectedVersion: v }),
      setSelectedGen: (g) => set({ selectedGen: g }),
      setSelectedType: (t) => set({ selectedType: t }),
      setSelectedAbility: (a) => set({ selectedAbility: a, selectedAbilitySlot: 'all' }),
      setSelectedAbilitySlot: (s) => set({ selectedAbilitySlot: s }),

      clearAll: () => set({ 
        selectedVersion: null, 
        selectedGen: null, 
        selectedType: null, 
        selectedAbility: null,
        selectedAbilitySlot: 'all'
      }),
    }),
    { name: 'pokedex-filter-store' }
  )
);

export default useFilterStore;
