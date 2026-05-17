import { useEvolutionChain, usePokemonDetailBatch } from '../hooks/usePokemonDetail';
import { formatName, getSpriteUrl, getIdFromUrl } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';

function formatEvoDetails(details) {
  if (!details) return '';
  const trigger = details.trigger?.name;
  if (trigger === 'level-up') {
    if (details.min_level) return `Lv. ${details.min_level}`;
    if (details.min_happiness) return `Happy`;
    if (details.known_move) return `Learn ${formatName(details.known_move.name)}`;
    if (details.location) return `At ${formatName(details.location.name)}`;
    if (details.time_of_day) return `Day/Night`;
    return 'Lvl Up';
  }
  if (trigger === 'use-item') {
    if (details.item) return formatName(details.item.name);
    return 'Use Item';
  }
  if (trigger === 'trade') {
    if (details.held_item) return `Trade: ${formatName(details.held_item.name)}`;
    return 'Trade';
  }
  if (trigger === 'shed') return 'Shed';
  return 'Evo';
}

export default function EvolutionChain({ url }) {
  const { data: chainData, isLoading } = useEvolutionChain(url);

  const paths = [];
  if (chainData) {
    function traverse(node, currentPath = []) {
      const id = getIdFromUrl(node.species.url);
      const nextPath = [...currentPath, {
        id,
        name: node.species.name,
        details: node.evolution_details?.[0] ?? null
      }];
      
      if (!node.evolves_to || node.evolves_to.length === 0) {
        paths.push(nextPath);
        return;
      }
      
      for (const nextNode of node.evolves_to) {
        traverse(nextNode, nextPath);
      }
    }
    
    traverse(chainData.chain);
  }

  if (isLoading || !paths.length || (paths.length === 1 && paths[0].length <= 1)) return null;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-4">Rantai Evolusi</p>
      <div className="flex flex-col gap-3">
        {paths.map((path, pathIdx) => (
          <div key={pathIdx} className="flex items-center bg-neutral-bg dark:bg-zinc-900 rounded-2xl p-3 overflow-x-auto gap-2 scrollbar-none">
            {path.map((node, index) => (
              <div key={node.id} className="flex items-center gap-2 shrink-0">
                {index > 0 && (
                  <div className="flex flex-col items-center justify-center text-gray-300 dark:text-zinc-700 px-1 select-none gap-0.5 shrink-0">
                    {node.details && (
                      <span className="text-[7.5px] font-black text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full text-center whitespace-nowrap">
                        {formatEvoDetails(node.details)}
                      </span>
                    )}
                    <FaChevronRight size={10} />
                  </div>
                )}
                <EvolutionItem id={node.id} name={node.name} />
              </div>
            ))}
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
      className="flex flex-col items-center gap-1 group transition-transform active:scale-95 cursor-pointer shrink-0"
    >
      <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center border border-gray-100 dark:border-zinc-800 group-hover:border-primary/30 group-hover:shadow-sm">
        <img
          src={getSpriteUrl(id)}
          alt={name}
          className="w-9 h-9 object-contain"
        />
      </div>
      <p className="text-[9px] font-bold text-gray-600 dark:text-zinc-400 group-hover:text-primary truncate max-w-[65px]">
        {formatName(name)}
      </p>
    </button>
  );
}
