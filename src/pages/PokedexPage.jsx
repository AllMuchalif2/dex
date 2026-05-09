import { useState, useEffect, useRef, useMemo } from 'react';
import { FaMagnifyingGlass, FaSliders, FaXmark } from 'react-icons/fa6';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonDetailBatch, useAllPokemonNames } from '../hooks/usePokemonDetail';
import { useFilteredPokemon } from '../hooks/useFilteredPokemon';
import { getIdFromUrl, formatName } from '../utils/formatters';
import { getTypeColor } from '../utils/typeColors';
import { GAMES, GENERATIONS } from '../utils/filterData';
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterPanel from '../components/FilterPanel';

const GRID = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';
const DEFAULT_FILTERS = { types: [], genId: null, gameId: null };

function ActiveFilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600">
        <FaXmark size={10} />
      </button>
    </span>
  );
}

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const loadMoreRef = useRef(null);

  // Semua nama pokemon (cached 24h) untuk search lokal
  const { data: allNames } = useAllPokemonNames();

  // Mode infinite scroll (tanpa filter)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: listLoading } = usePokemonList();
  const allPokemon = data?.pages.flatMap((p) => p.results) ?? [];
  const allIds = allPokemon.map((p) => getIdFromUrl(p.url));

  // Mode filter
  const {
    pageIds: filteredPageIds,
    total,
    page,
    setPage,
    hasMore: filteredHasMore,
    isLoading: filterLoading,
    isFiltered,
  } = useFilteredPokemon(filters);

  // Search lokal dari semua nama (tanpa API call, tanpa 404)
  const searchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !allNames) return [];
    return allNames
      .filter((p) => p.name.includes(q))
      .slice(0, 20)
      .map((p) => getIdFromUrl(p.url));
  }, [query, allNames]);

  const isSearching = query.trim().length > 0;

  // Pilih IDs yang akan di-fetch detail-nya
  const idsToFetch = isSearching ? searchIds : isFiltered ? filteredPageIds : allIds;
  const details = usePokemonDetailBatch(idsToFetch);

  // Infinite scroll (hanya mode tanpa filter dan search)
  useEffect(() => {
    if (isFiltered || isSearching) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFiltered, isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const cards = details.filter((d) => d.data).map((d) => ({
    id: d.data.id,
    name: d.data.name,
    types: d.data.types.map((t) => t.type.name),
  }));

  const activeFilterCount = filters.types.length + (filters.genId ? 1 : 0) + (filters.gameId ? 1 : 0);

  function getActiveChips() {
    const chips = [];
    filters.types.forEach((t) => {
      const { bg } = getTypeColor(t);
      chips.push({
        key: `type-${t}`, label: formatName(t), color: bg,
        remove: () => setFilters((f) => ({ ...f, types: f.types.filter((x) => x !== t) })),
      });
    });
    if (filters.genId && !filters.gameId) {
      const gen = GENERATIONS.find((g) => g.id === filters.genId);
      if (gen) chips.push({ key: 'gen', label: gen.label, remove: () => setFilters((f) => ({ ...f, genId: null })) });
    }
    if (filters.gameId) {
      const game = GAMES.find((g) => g.id === filters.gameId);
      if (game) chips.push({ key: 'game', label: game.label, remove: () => setFilters((f) => ({ ...f, gameId: null, genId: null })) });
    }
    return chips;
  }

  const isLoadingAny = isFiltered ? filterLoading : listLoading;
  const noResults = isSearching && cards.length === 0 && !listLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 md:pt-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Pokedex</h1>
          {isFiltered && total !== null && (
            <span className="text-xs text-gray-400">{total} Pokemon</span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-neutral-bg rounded-xl px-3 py-2">
            <FaMagnifyingGlass className="text-gray-400 shrink-0" />
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
          <button
            id="btn-open-filter"
            onClick={() => setShowFilter(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeFilterCount > 0 ? 'bg-primary text-white' : 'bg-neutral-bg text-gray-600'
            }`}
          >
            <FaSliders size={14} />
            {activeFilterCount > 0 && <span className="text-xs">{activeFilterCount}</span>}
          </button>
        </div>

        {getActiveChips().length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {getActiveChips().map((chip) => (
              <ActiveFilterChip key={chip.key} label={chip.label} onRemove={chip.remove} />
            ))}
          </div>
        )}
      </div>

      {/* Konten */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-8 md:px-6">
        {/* Hasil search */}
        {isSearching && (
          <>
            {noResults ? (
              <p className="text-center text-gray-400 text-sm py-4">
                Tidak ada Pokemon dengan nama &quot;{query}&quot;
              </p>
            ) : (
              <div className={GRID}>
                {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
              </div>
            )}
          </>
        )}

        {/* Daftar normal / filter */}
        {!isSearching && (
          <>
            {isLoadingAny ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className={GRID}>
                  {cards.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />)}
                </div>

                {isFiltered && filteredHasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Muat lebih banyak
                    </button>
                  </div>
                )}

                {!isFiltered && (
                  <div ref={loadMoreRef} className="py-4">
                    {isFetchingNextPage && <LoadingSpinner size="sm" />}
                  </div>
                )}

                {isFiltered && cards.length === 0 && !filterLoading && (
                  <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                    <FaSliders size={32} className="opacity-30" />
                    <p className="text-sm">Tidak ada Pokemon yang cocok</p>
                    <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-primary text-sm font-medium">
                      Reset Filter
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {showFilter && (
        <FilterPanel filters={filters} onChange={setFilters} onClose={() => setShowFilter(false)} />
      )}
    </div>
  );
}
