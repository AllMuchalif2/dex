import { motion } from 'framer-motion';
import { FaTrash, FaUsers } from 'react-icons/fa6';
import TypeBadge from './TypeBadge';
import { formatName } from '../utils/formatters';

export default function TeamSlot({ pokemon, onRemove, onClickAdd, onNavigate }) {
  if (pokemon) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center gap-2 relative"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(pokemon); }}
          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
        >
          <FaTrash size={12} />
        </button>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          width={72}
          height={72}
          className="drop-shadow-sm cursor-pointer"
          onClick={() => onNavigate(`/pokemon/${pokemon.id}`)}
        />
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{formatName(pokemon.name)}</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 py-8 text-gray-300 dark:text-zinc-700 cursor-pointer hover:border-accent1 dark:hover:border-zinc-700 transition-colors"
      onClick={onClickAdd}
    >
      <FaUsers size={22} />
      <span className="text-xs">Tambah Pokemon</span>
    </motion.div>
  );
}
