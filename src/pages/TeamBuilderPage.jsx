import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUsers, FaSun, FaMoon } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTeamStore from '../store/teamStore';
import { formatName, getSpriteUrl } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge';
import useSettingsStore from '../store/settingsStore';

const SLOTS = Array.from({ length: 6 });

export default function TeamBuilderPage() {
  const { team, removeFromTeam, clearTeam } = useTeamStore();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useSettingsStore();

  function handleRemove(pokemon) {
    removeFromTeam(pokemon.id);
    toast.success(`${formatName(pokemon.name)} dihapus dari tim`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 px-4 pt-10 pb-4 md:pt-6 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Tim Saya</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">{team.length}/6 Pokemon</p>
        </div>
        <div className="flex items-center gap-3">
          {team.length > 0 && (
            <button
              id="btn-clear-team"
              onClick={() => { clearTeam(); toast.success('Tim dikosongkan'); }}
              className="text-xs text-red-400 font-medium flex items-center gap-1 cursor-pointer"
            >
              <FaTrash size={11} /> Kosongkan
            </button>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center shadow-sm"
          >
            {isDark ? <FaSun size={14} className="text-amber-500 animate-in spin-in-12 duration-300" /> : <FaMoon size={14} className="text-indigo-500 animate-in spin-in-12 duration-300" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 md:pb-8 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {SLOTS.map((_, i) => {
            const pokemon = team[i];
            return (
              <AnimatePresence key={i} mode="popLayout">
                {pokemon ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center gap-2 relative"
                  >
                    <button
                      onClick={() => handleRemove(pokemon)}
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
                      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                    />
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{formatName(pokemon.name)}</p>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 py-8 text-gray-300 dark:text-zinc-700 cursor-pointer hover:border-accent1 dark:hover:border-zinc-700 transition-colors"
                    onClick={() => navigate('/')}
                  >
                    <FaUsers size={22} />
                    <span className="text-xs">Tambah Pokemon</span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {team.length === 0 && (
          <p className="text-center text-gray-400 dark:text-zinc-500 text-sm">
            Tim kamu kosong. Cari Pokemon di tab Pokedex dan tambahkan ke tim.
          </p>
        )}
      </div>
    </div>
  );
}
