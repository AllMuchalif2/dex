import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchPokemonDetail, fetchPokemonSpecies, fetchAllPokemonNames } from '../api/pokeapi';

const STALE = 24 * 60 * 60 * 1000;

// Fetch semua nama pokemon sekali, di-cache 24h
export function useAllPokemonNames() {
  return useQuery({
    queryKey: ['all-pokemon-names'],
    queryFn: fetchAllPokemonNames,
    staleTime: STALE,
  });
}

// Hook detail satu pokemon berdasarkan id atau nama
export function usePokemonDetail(idOrName) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemonDetail(idOrName),
    staleTime: STALE,
    enabled: !!idOrName,
  });
}

// Hook spesies (untuk deskripsi flavor text)
export function usePokemonSpecies(id) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    staleTime: STALE,
    enabled: !!id,
  });
}

// Hook batch detail untuk array id
export function usePokemonDetailBatch(ids = []) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemonDetail(id),
      staleTime: STALE,
    })),
  });
}
