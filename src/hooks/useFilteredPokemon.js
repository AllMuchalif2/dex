import { useState, useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchPokemonIdsByType } from '../api/filters';
import { GENERATIONS, GAMES } from '../utils/filterData';

const PAGE_SIZE = 20;
const STALE = 24 * 60 * 60 * 1000;

// Hook utama filter pokemon
// types: string[] (multi-select)
// genId: number|null (dari pilihan generasi/region)
// gameId: string|null (dari pilihan game, akan resolve ke genId)
export function useFilteredPokemon({ types = [], genId = null, gameId = null }) {
  const [page, setPage] = useState(0);

  // Reset ke halaman 0 setiap kali filter berubah
  useEffect(() => {
    setPage(0);
  }, [JSON.stringify(types), genId, gameId]);

  // Resolve genId dari game jika belum di-set
  const resolvedGenId = useMemo(() => {
    if (genId) return genId;
    if (gameId) return GAMES.find((g) => g.id === gameId)?.genId ?? null;
    return null;
  }, [genId, gameId]);

  // Ambil ID berdasarkan range generasi (statis)
  const baseIds = useMemo(() => {
    if (!resolvedGenId) return null;
    const gen = GENERATIONS.find((g) => g.id === resolvedGenId);
    if (!gen) return null;
    const [min, max] = gen.range;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [resolvedGenId]);

  // Fetch type IDs dari API (di-cache oleh TanStack Query)
  const typeQueries = useQueries({
    queries: types.map((type) => ({
      queryKey: ['type-filter', type],
      queryFn: () => fetchPokemonIdsByType(type),
      staleTime: STALE,
    })),
  });

  const typesLoading = types.length > 0 && typeQueries.some((q) => q.isLoading);

  // Hitung ID hasil filter (interseksi base + tipe)
  const filteredIds = useMemo(() => {
    if (typesLoading) return null;

    let result = baseIds ? new Set(baseIds) : null;

    if (types.length > 0) {
      const typeIdSet = new Set();
      for (const q of typeQueries) {
        if (q.data) q.data.forEach((id) => typeIdSet.add(id));
      }
      result = result
        ? new Set([...result].filter((id) => typeIdSet.has(id)))
        : typeIdSet;
    }

    return result ? [...result].sort((a, b) => a - b) : null;
  }, [baseIds, types, typeQueries, typesLoading]);

  const isFiltered = types.length > 0 || !!resolvedGenId || !!gameId;
  const pageIds = filteredIds ? filteredIds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : [];
  const hasMore = filteredIds ? (page + 1) * PAGE_SIZE < filteredIds.length : false;
  const total = filteredIds?.length ?? null;

  return {
    filteredIds,
    pageIds,
    total,
    page,
    setPage,
    hasMore,
    isLoading: typesLoading,
    isFiltered,
  };
}
