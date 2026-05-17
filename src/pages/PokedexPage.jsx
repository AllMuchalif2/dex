import { useState, useEffect, useRef, useMemo } from 'react';
import { FaMagnifyingGlass, FaXmark, FaSliders, FaSun, FaMoon } from 'react-icons/fa6';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonDetailBatch, useAllPokemonNames } from '../hooks/usePokemonDetail';
import { useFilteredPokemon } from '../hooks/useFilteredPokemon';
import { getIdFromUrl } from '../utils/formatters';
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterBar from '../components/FilterBar';
import useSettingsStore from '../store/settingsStore';

const GRID = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const loadMoreRef = useRef(null);

  const { isDark, toggleDarkMode } = useSettingsStore();
  const { data: allNames } = useAllPokemonNames();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: listLoading } = usePokemonList();
  const { pageIds: filteredPageIds, total, page, setPage, hasMore, isLoading: filterLoading, isFiltered } = useFilteredPokemon();

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

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!isFiltered && !isSearching && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        } else if (isFiltered && hasMore) {
          setPage((v) => v + 1);
        }
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isFiltered, isSearching, hasNextPage, isFetchingNextPage, fetchNextPage, hasMore, setPage]);

  const isLoadingAny = isFiltered ? filterLoading : listLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-zinc-950 px-4 pt-10 pb-3 md:pt-6 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Pokedex</h1>
            {isFiltered && total !== null && (
              <span className="text-xs text-gray-400 dark:text-zinc-500">{total} Pokemon</span>
            )}
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center shadow-sm"
          >
            {isDark ? <FaSun size={14} className="text-amber-500 animate-in spin-in-12 duration-300" /> : <FaMoon size={14} className="text-indigo-500 animate-in spin-in-12 duration-300" />}
          </button>
        </div>

        <div className="flex items-center gap-2 bg-neutral-bg dark:bg-zinc-900 rounded-xl px-3 py-2">
          <FaMagnifyingGlass className="text-gray-400 dark:text-zinc-500 shrink-0" size={13} />
          <input
            id="search-pokemon"
            type="text"
            placeholder="Cari nama pokemon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-600"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 dark:text-zinc-500">
              <FaXmark size={13} />
            </button>
          )}
        </div>

        <FilterBar />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-8 md:px-6">
        {isSearching ? (
          cards.length > 0 ? (
            <div className={GRID}>
              {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <p className="text-gray-500 dark:text-zinc-400 text-sm">Tidak ada Pokemon dengan nama</p>
              <p className="font-semibold text-gray-800 dark:text-zinc-200 text-base">&ldquo;{query}&rdquo;</p>
              <button
                onClick={() => setQuery('')}
                className="mt-1 text-xs text-primary font-semibold px-5 py-2 rounded-full bg-primary/10 dark:bg-primary/20"
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
              <div className="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-zinc-500">
                <FaSliders size={28} className="opacity-30" />
                <p className="text-sm">Tidak ada Pokemon yang cocok dengan filter ini</p>
              </div>
            ) : (
              <div className={GRID}>
                {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
              </div>
            )}

            {(isFiltered || !isFiltered) && (
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {((!isFiltered && isFetchingNextPage) || (isFiltered && hasMore)) && (
                  <LoadingSpinner size="sm" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
