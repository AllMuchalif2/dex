import { useEvolutionChain, usePokemonDetailBatch } from '../hooks/usePokemonDetail';
import { formatName, getSpriteUrl, getIdFromUrl } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';

export default function EvolutionChain({ url }) {
  const { data: chainData, isLoading } = useEvolutionChain(url);

  const evolutions = [];
  if (chainData) {
    let current = chainData.chain;
    while (current) {
      const id = getIdFromUrl(current.species.url);
      evolutions.push({
        id,
        name: current.species.name,
      });
      current = current.evolves_to[0]; // Simplified: only follow first path
    }
  }

  if (isLoading || evolutions.length <= 1) return null;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-gray-700 mb-4">Rantai Evolusi</p>
      <div className="flex items-center justify-between bg-neutral-bg rounded-2xl p-4">
        {evolutions.map((evo, index) => (
          <div key={evo.id} className="flex items-center flex-1">
            <EvolutionItem id={evo.id} name={evo.name} />
            {index < evolutions.length - 1 && (
              <div className="flex-1 flex justify-center text-gray-300">
                <FaChevronRight size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionItem({ id, name }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/pokemon/${id}`)}
      className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
    >
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:border-primary/30 group-hover:shadow-sm">
        <img
          src={getSpriteUrl(id)}
          alt={name}
          className="w-12 h-12 object-contain"
        />
      </div>
      <p className="text-[10px] font-bold text-gray-600 group-hover:text-primary">
        {formatName(name)}
      </p>
    </button>
  );
}
