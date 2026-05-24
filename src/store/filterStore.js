import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GEN_RANGES, VERSION_TO_GEN, TYPES } from '../utils/filterData';
import { EV_YIELD_MAP } from '../utils/evYieldData';


// Fungsi filter utama (AND logic): interseksi semua kondisi aktif
// typeIds: Set<number>, abilityData: Array<{id: number, isHidden: boolean}>
export function computeFilteredIds(
  selectedVersion,
  versionIds,
  selectedGen,
  selectedType,
  selectedAbility,
  selectedAbilitySlot,
  selectedGrowthRate,
  selectedEggGroup,
  typeIds,
  abilityData,
  growthRateIds,
  eggGroupIds,
  selectedEvYield,
  selectedMove,
  selectedMoveSlot,
  moveData
) {
  let result = null;

  // Step 1: Filter Generasi
  if (selectedGen && GEN_RANGES[selectedGen]) {
    const [min, max] = GEN_RANGES[selectedGen];
    result = new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i));
  }

  // Step 2: Filter Versi
  if (selectedVersion && versionIds) {
    const versionSet = versionIds instanceof Set ? versionIds : new Set(versionIds);
    result = result
      ? new Set([...result].filter((id) => versionSet.has(id)))
      : versionSet;
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

  // Step 5: Filter Growth Rate
  if (selectedGrowthRate && growthRateIds) {
    const grSet = new Set(growthRateIds);
    result = result
      ? new Set([...result].filter((id) => grSet.has(id)))
      : grSet;
  }

  // Step 6: Filter Egg Group
  if (selectedEggGroup && eggGroupIds) {
    const egSet = new Set(eggGroupIds);
    result = result
      ? new Set([...result].filter((id) => egSet.has(id)))
      : egSet;
  }

  // Step 7: Filter EV Yield
  if (selectedEvYield) {
    const evSet = new Set(
      Object.keys(EV_YIELD_MAP)
        .filter((id) => EV_YIELD_MAP[id]?.[selectedEvYield] > 0)
        .map(Number)
    );
    result = result
      ? new Set([...result].filter((id) => evSet.has(id)))
      : evSet;
  }

  // Step 8: Filter Move + Slot
  if (selectedMove && moveData) {
    let filteredMoveIds = moveData;
    if (selectedMoveSlot !== 'all') {
      filteredMoveIds = moveData.filter((p) => p.methods && p.methods.includes(selectedMoveSlot));
    }
    
    const mSet = new Set(filteredMoveIds.map((p) => p.id));
    result = result
      ? new Set([...result].filter((id) => mSet.has(id)))
      : mSet;
  }

  const hasFilter = !!selectedVersion || !!selectedGen || !!selectedType || !!selectedAbility || !!selectedGrowthRate || !!selectedEggGroup || !!selectedEvYield || !!selectedMove;
  if (!hasFilter) return null;

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
      selectedAbilitySlot: 'all',
      selectedGrowthRate: null,
      selectedEggGroup: null,
      selectedEvYield: null,
      selectedMove: null,
      selectedMoveSlot: 'all',

      setSelectedVersion: (v) => set({ selectedVersion: v }),
      setSelectedGen: (g) => set({ selectedGen: g }),
      setSelectedType: (t) => set({ selectedType: t }),
      setSelectedAbility: (a) => set({ selectedAbility: a, selectedAbilitySlot: 'all' }),
      setSelectedAbilitySlot: (s) => set({ selectedAbilitySlot: s }),
      setSelectedGrowthRate: (g) => set({ selectedGrowthRate: g }),
      setSelectedEggGroup: (e) => set({ selectedEggGroup: e }),
      setSelectedEvYield: (y) => set({ selectedEvYield: y }),
      setSelectedMove: (m) => set({ selectedMove: m, selectedMoveSlot: 'all' }),
      setSelectedMoveSlot: (s) => set({ selectedMoveSlot: s }),

      clearAll: () => set({ 
        selectedVersion: null, 
        selectedGen: null, 
        selectedType: null, 
        selectedAbility: null,
        selectedAbilitySlot: 'all',
        selectedGrowthRate: null,
        selectedEggGroup: null,
        selectedEvYield: null,
        selectedMove: null,
        selectedMoveSlot: 'all',
      }),
    }),
    { name: 'pokedex-filter-store' }
  )
);

export default useFilterStore;
