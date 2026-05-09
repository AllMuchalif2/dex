import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';
import { TYPES, GENERATIONS, REGIONS, GAMES } from '../utils/filterData';
import { getTypeColor } from '../utils/typeColors';
import { formatName } from '../utils/formatters';

const TABS = ['Tipe', 'Generasi', 'Region', 'Game'];

// Chip pilihan generik
function Chip({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0 ${
        active
          ? 'border-transparent text-white'
          : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
      }`}
      style={active && color ? { backgroundColor: color } : active ? { backgroundColor: '#FF0000' } : {}}
    >
      {label}
    </button>
  );
}

export default function FilterPanel({ filters, onChange, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const { types, genId, gameId } = filters;

  function toggleType(type) {
    const next = types.includes(type) ? types.filter((t) => t !== type) : [...types, type];
    onChange({ ...filters, types: next });
  }

  function selectGen(id) {
    onChange({ ...filters, genId: genId === id ? null : id, gameId: null });
  }

  function selectRegion(id) {
    onChange({ ...filters, genId: genId === id ? null : id, gameId: null });
  }

  function selectGame(id) {
    const game = GAMES.find((g) => g.id === id);
    if (!game) return;
    onChange({ ...filters, gameId: gameId === id ? null : id, genId: null });
  }

  function handleReset() {
    onChange({ types: [], genId: null, gameId: null });
  }

  const activeCount = types.length + (genId ? 1 : 0) + (gameId ? 1 : 0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <motion.div
          className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg md:mx-4 max-h-[80vh] flex flex-col shadow-xl"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header panel */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Filter Pokemon</h2>
              {activeCount > 0 && (
                <p className="text-xs text-gray-400">{activeCount} filter aktif</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button onClick={handleReset} className="text-xs text-primary font-medium px-3 py-1.5 rounded-full border border-primary/30">
                  Reset
                </button>
              )}
              <button id="btn-close-filter" onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <FaXmark size={16} />
              </button>
            </div>
          </div>

          {/* Tab navigasi */}
          <div className="flex gap-1 px-4 py-2 border-b border-gray-100">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === i ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Konten tab */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Tab Tipe */}
            {activeTab === 0 && (
              <div className="flex flex-wrap gap-2">
                {TYPES.map((type) => {
                  const { bg } = getTypeColor(type);
                  return (
                    <Chip
                      key={type}
                      label={formatName(type)}
                      active={types.includes(type)}
                      onClick={() => toggleType(type)}
                      color={bg}
                    />
                  );
                })}
              </div>
            )}

            {/* Tab Generasi */}
            {activeTab === 1 && (
              <div className="flex flex-wrap gap-2">
                {GENERATIONS.map((gen) => (
                  <Chip
                    key={gen.id}
                    label={gen.label}
                    active={genId === gen.id && !gameId}
                    onClick={() => selectGen(gen.id)}
                  />
                ))}
              </div>
            )}

            {/* Tab Region */}
            {activeTab === 2 && (
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <Chip
                    key={region.id}
                    label={region.label}
                    active={genId === region.id && !gameId}
                    onClick={() => selectRegion(region.id)}
                  />
                ))}
              </div>
            )}

            {/* Tab Game */}
            {activeTab === 3 && (
              <div className="flex flex-wrap gap-2">
                {GAMES.map((game) => (
                  <Chip
                    key={game.id}
                    label={game.label}
                    active={gameId === game.id}
                    onClick={() => selectGame(game.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              id="btn-apply-filter"
              onClick={onClose}
              className="w-full bg-primary text-white py-3 rounded-2xl font-semibold text-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
