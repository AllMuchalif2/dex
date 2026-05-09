import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GEN_RANGES, VERSION_TO_GEN, TYPES } from '../utils/filterData';

// Hitung range ID dari gen name atau versi
function getGenRange(selectedGen, selectedVersion) {
  if (selectedGen && GEN_RANGES[selectedGen]) return GEN_RANGES[selectedGen];
  if (selectedVersion) {
    const impliedGen = VERSION_TO_GEN[selectedVersion];
    if (impliedGen && GEN_RANGES[impliedGen]) return GEN_RANGES[impliedGen];
  }
  return null;
}

// Fungsi filter utama (AND logic): interseksi semua kondisi aktif
// typeIds: Map<string, Set<number>> — sudah di-fetch dari API
export function computeFilteredIds(selectedVersion, selectedGen, selectedType, typeIds) {
  let result = null;

  // Step 1: filter range generasi / versi
  const range = getGenRange(selectedGen, selectedVersion);
  if (range) {
    const [min, max] = range;
    result = new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i));
  }

  // Step 2: filter tipe (AND dengan range)
  if (selectedType && typeIds) {
    const typeSet = typeIds instanceof Set ? typeIds : new Set(typeIds);
    result = result
      ? new Set([...result].filter((id) => typeSet.has(id)))
      : typeSet;
  }

  const hasFilter = !!selectedVersion || !!selectedGen || !!selectedType;
  if (!hasFilter) return null; // null = tampilkan semua

  return result ? [...result].sort((a, b) => a - b) : [];
}

// Zustand store — filter global, persist ke localStorage
const useFilterStore = create(
  persist(
    (set) => ({
      selectedVersion: 'emerald',
      selectedGen: 'generation-i',
      selectedType: 'poison',

      setSelectedVersion: (v) => set({ selectedVersion: v }),
      setSelectedGen: (g) => set({ selectedGen: g }),
      setSelectedType: (t) => set({ selectedType: t }),

      clearAll: () => set({ selectedVersion: null, selectedGen: null, selectedType: null }),
    }),
    { name: 'pokedex-filter-store' }
  )
);

export default useFilterStore;
