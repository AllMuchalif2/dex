import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchPokemonDetail, fetchPokemonSpecies, fetchAllPokemonNames, fetchEvolutionChain, fetchPokemonAbility, fetchPokemonBatchGraphQL, fetchPokemonMove } from '../api/pokeapi';

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

// Hook rantai evolusi
export function useEvolutionChain(url) {
  return useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchEvolutionChain(url),
    staleTime: STALE,
    enabled: !!url,
  });
}

// Hook batch detail menggunakan GraphQL untuk menghindari N+1 query problem
export function usePokemonDetailBatch(ids = []) {
  return useQuery({
    queryKey: ['pokemon-batch', ids],
    queryFn: () => fetchPokemonBatchGraphQL(ids),
    staleTime: STALE,
    enabled: ids.length > 0,
  });
}

// Hook ability detail
export function usePokemonAbility(name) {
  return useQuery({
    queryKey: ['pokemon-ability', name],
    queryFn: () => fetchPokemonAbility(name),
    staleTime: STALE,
    enabled: !!name,
  });
}

// Hook move detail
export function usePokemonMove(name) {
  return useQuery({
    queryKey: ['pokemon-move', name],
    queryFn: () => fetchPokemonMove(name),
    staleTime: STALE,
    enabled: !!name,
  });
}
