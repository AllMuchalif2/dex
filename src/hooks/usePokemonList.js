import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokeapi';

const LIMIT = 20;

// Hook untuk infinite scroll daftar pokemon
export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.next ? lastPageParam + LIMIT : undefined;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
