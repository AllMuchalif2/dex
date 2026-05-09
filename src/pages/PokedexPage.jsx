import { useState, useEffect, useRef, useMemo } from 'react';
import { FaMagnifyingGlass, FaXmark, FaSliders } from 'react-icons/fa6';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonDetailBatch, useAllPokemonNames } from '../hooks/usePokemonDetail';
import { useFilteredPokemon } from '../hooks/useFilteredPokemon';
import { getIdFromUrl } from '../utils/formatters';
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterBar from '../components/FilterBar';

const GRID = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const loadMoreRef = useRef(null);

  const { data: allNames } = useAllPokemonNames();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: listLoading } = usePokemonList();
  const { pageIds: filteredPageIds, total, page, setPage, hasMore, isLoading: filterLoading, isFiltered } = useFilteredPokemon();

  // Search lokal — tidak ada API call, tidak ada 404
  const searchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !allNames) return [];
    return allNames.filter((p) => p.name.includes(q)).slice(0, 20).map((p) => getIdFromUrl(p.url));
  }, [query, allNames]);

  const isSearching = query.trim().length > 0;
  const allIds = (data?.pages.flatMap((p) => p.results) ?? []).map((p) => getIdFromUrl(p.url));
  const idsToFetch = isSearching ? searchIds : isFiltered ? filteredPageIds : allIds;
  const details = usePokemonDetailBatch(idsToFetch);
  const cards = details.filter((d) => d.data).map((d) => ({
    id: d.data.id, name: d.data.name, types: d.data.types.map((t) => t.type.name),
  }));

  // Infinite scroll — hanya saat tidak ada filter dan search
  useEffect(() => {
    if (isFiltered || isSearching) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isFiltered, isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoadingAny = isFiltered ? filterLoading : listLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 md:pt-6 border-b border-gray-100 sticky top-0 z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pokedex</h1>
          {isFiltered && total !== null && (
            <span className="text-xs text-gray-400">{total} Pokemon</span>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-neutral-bg rounded-xl px-3 py-2">
          <FaMagnifyingGlass className="text-gray-400 shrink-0" size={13} />
          <input
            id="search-pokemon"
            type="text"
            placeholder="Cari nama pokemon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400">
              <FaXmark size={13} />
            </button>
          )}
        </div>

        {/* Filter bar: 3 pill dropdowns */}
        <FilterBar />
      </div>

      {/* Konten */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-8 md:px-6">
        {isSearching ? (
          cards.length > 0 ? (
            <div className={GRID}>
              {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <p className="text-gray-500 text-sm">Tidak ada Pokemon dengan nama</p>
              <p className="font-semibold text-gray-800 text-base">&ldquo;{query}&rdquo;</p>
              <button
                onClick={() => setQuery('')}
                className="mt-1 text-xs text-primary font-semibold px-5 py-2 rounded-full bg-primary/10"
              >
                Hapus Pencarian
              </button>
            </div>
          )
        ) : isLoadingAny ? (
          <LoadingSpinner />
        ) : (
          <>
            {cards.length === 0 && isFiltered ? (
              <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                <FaSliders size={28} className="opacity-30" />
                <p className="text-sm">Tidak ada Pokemon yang cocok dengan filter ini</p>
              </div>
            ) : (
              <div className={GRID}>
                {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
              </div>
            )}

            {isFiltered && hasMore && (
              <div className="flex justify-center mt-6">
                <button onClick={() => setPage((v) => v + 1)} className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600">
                  Muat lebih banyak
                </button>
              </div>
            )}

            {!isFiltered && (
              <div ref={loadMoreRef} className="py-4">
                {isFetchingNextPage && <LoadingSpinner size="sm" />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
