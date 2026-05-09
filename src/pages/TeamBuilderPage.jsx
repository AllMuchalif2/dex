import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUsers } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTeamStore from '../store/teamStore';
import { formatName, getSpriteUrl } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge';

const SLOTS = Array.from({ length: 6 });

export default function TeamBuilderPage() {
  const { team, removeFromTeam, clearTeam } = useTeamStore();
  const navigate = useNavigate();

  function handleRemove(pokemon) {
    removeFromTeam(pokemon.id);
    toast.success(`${formatName(pokemon.name)} dihapus dari tim`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tim Saya</h1>
          {team.length > 0 && (
            <button
              id="btn-clear-team"
              onClick={() => { clearTeam(); toast.success('Tim dikosongkan'); }}
              className="text-xs text-red-400 font-medium flex items-center gap-1"
            >
              <FaTrash size={11} /> Kosongkan
            </button>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">{team.length}/6 Pokemon</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {/* Grid 6 slot */}
        <div className="grid grid-cols-2 gap-3 mb-6">
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
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 relative"
                  >
                    <button
                      onClick={() => handleRemove(pokemon)}
                      className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400 transition-colors"
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
                    <p className="text-sm font-semibold text-gray-800">{formatName(pokemon.name)}</p>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 py-8 text-gray-300 cursor-pointer hover:border-accent1 transition-colors"
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

        {/* Pesan kosong */}
        {team.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            Tim kamu kosong. Cari Pokemon di tab Pokedex dan tambahkan ke tim.
          </p>
        )}
      </div>
    </div>
  );
}
