import { useState, useEffect, useRef } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonDetailBatch } from '../hooks/usePokemonDetail';
import { getIdFromUrl } from '../utils/formatters';
import { searchPokemon } from '../api/pokeapi';
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePokemonList();

  // Kumpulkan semua pokemon dari semua page
  const allPokemon = data?.pages.flatMap((p) => p.results) ?? [];
  const allIds = allPokemon.map((p) => getIdFromUrl(p.url));
  const details = usePokemonDetailBatch(allIds);

  // Intersection observer untuk infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) { setSearchResult(null); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const result = await searchPokemon(query);
      setSearchResult(result);
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const cards = details
    .filter((d) => d.data)
    .map((d) => ({
      id: d.data.id,
      name: d.data.name,
      types: d.data.types.map((t) => t.type.name),
    }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Pokedex</h1>
        <div className="flex items-center gap-2 bg-neutral-bg rounded-xl px-3 py-2">
          <FaMagnifyingGlass className="text-gray-400 shrink-0" />
          <input
            id="search-pokemon"
            type="text"
            placeholder="Cari pokemon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {/* Hasil pencarian */}
        {query.trim() && (
          <div className="mb-4">
            {searching ? (
              <LoadingSpinner size="sm" />
            ) : searchResult ? (
              <div className="grid grid-cols-2 gap-3">
                <PokemonCard
                  id={searchResult.id}
                  name={searchResult.name}
                  types={searchResult.types.map((t) => t.type.name)}
                />
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">Pokemon tidak ditemukan</p>
            )}
          </div>
        )}

        {/* Daftar normal */}
        {!query.trim() && (
          <>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {cards.map((p) => (
                    <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />
                  ))}
                </div>
                <div ref={loadMoreRef} className="py-4">
                  {isFetchingNextPage && <LoadingSpinner size="sm" />}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
