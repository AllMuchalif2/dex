import { useState, useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchPokemonIdsByType } from '../api/filters';
import useFilterStore, { computeFilteredIds } from '../store/filterStore';

const PAGE_SIZE = 20;
const STALE = 24 * 60 * 60 * 1000;

export function useFilteredPokemon() {
  const { selectedVersion, selectedGen, selectedType } = useFilterStore();
  const [page, setPage] = useState(0);

  // Reset halaman setiap kali filter berubah
  useEffect(() => {
    setPage(0);
  }, [selectedVersion, selectedGen, selectedType]);

  // Fetch IDs berdasarkan tipe dari API (di-cache 24h)
  const typeQueries = useQueries({
    queries: selectedType
      ? [{ queryKey: ['type-filter', selectedType], queryFn: () => fetchPokemonIdsByType(selectedType), staleTime: STALE }]
      : [],
  });

  const typesLoading = selectedType != null && typeQueries.some((q) => q.isLoading);
  const typeIds = typeQueries[0]?.data ? new Set(typeQueries[0].data) : null;

  // Hitung filtered IDs (AND logic)
  const filteredIds = useMemo(() => {
    if (typesLoading) return null;
    return computeFilteredIds(selectedVersion, selectedGen, selectedType, typeIds);
  }, [selectedVersion, selectedGen, selectedType, typeIds, typesLoading]);

  const isFiltered = !!(selectedVersion || selectedGen || selectedType);
  const pageIds = filteredIds ? filteredIds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : [];
  const hasMore = filteredIds ? (page + 1) * PAGE_SIZE < filteredIds.length : false;

  return {
    filteredIds,
    pageIds,
    total: filteredIds?.length ?? null,
    page,
    setPage,
    hasMore,
    isLoading: typesLoading,
    isFiltered,
  };
}
