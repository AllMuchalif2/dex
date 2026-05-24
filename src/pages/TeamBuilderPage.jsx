import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUsers, FaSun, FaMoon, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useTeamStore from '../store/teamStore';
import { formatName } from '../utils/formatters';
import TeamSlot from '../components/TeamSlot';
import useSettingsStore from '../store/settingsStore';
import ConfirmModal from '../components/ConfirmModal';
import CreateTeamModal, { TEAM_GAME_VERSIONS } from '../components/CreateTeamModal';
import { useState } from 'react';

const SLOTS = Array.from({ length: 6 });

export default function TeamBuilderPage() {
  const { teams, activeTeamId, setActiveTeam, addTeam, removeTeam, removeFromTeam, updateTeam } = useTeamStore();
  const getActiveTeam = useTeamStore((s) => s.getActiveTeam);
  const activeTeam = getActiveTeam();
  const team = activeTeam.pokemonList;
  
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useSettingsStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  function handleRemove(pokemon) {
    removeFromTeam(pokemon.id);
    toast.success(`${formatName(pokemon.name)} dihapus dari tim`);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 px-4 pt-10 pb-4 md:pt-6 border-b border-gray-100 dark:border-zinc-900 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Tim Saya</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">{team.length}/6 Pokemon</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="Buat Tim Baru"
            >
              <FaPlus size={14} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              {isDark ? <FaSun size={14} className="text-amber-500 animate-in spin-in-12 duration-300" /> : <FaMoon size={14} className="text-indigo-500 animate-in spin-in-12 duration-300" />}
            </button>
          </div>
        </div>

        {/* Team Selector & Settings */}
        <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
          {teams.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTeam(t.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                t.id === activeTeamId 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Current Team Settings */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full flex-1">
            <input
              type="text"
              value={activeTeam.name}
              onChange={(e) => updateTeam(activeTeam.id, { name: e.target.value })}
              className="bg-white dark:bg-zinc-800 w-full sm:w-auto text-sm font-semibold text-gray-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg outline-none border border-gray-200 dark:border-zinc-700"
              placeholder="Nama Tim"
            />
            <div className="flex items-center bg-gray-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700/50">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                {TEAM_GAME_VERSIONS.find(g => g.id === activeTeam.gameVersion)?.label || 'Semua Game (Bebas)'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Hapus Tim"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 md:pb-8 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {SLOTS.map((_, i) => {
            const pokemon = team[i];
            return (
              <AnimatePresence key={i} mode="popLayout">
                <TeamSlot 
                  pokemon={pokemon}
                  onRemove={handleRemove}
                  onClickAdd={() => navigate('/', { state: { pickingForTeam: activeTeam } })}
                  onNavigate={navigate}
                />
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

      <ConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          removeTeam(activeTeam.id);
          toast.success('Tim dihapus');
        }}
        title="Hapus Tim"
        message={`Apakah Anda yakin ingin menghapus tim "${activeTeam.name}"? Semua pokemon di tim ini akan dihapus.`}
        confirmText="Ya, Hapus Tim"
      />

      <CreateTeamModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(name, gameVersion) => {
          addTeam(name, gameVersion);
          toast.success('Tim baru berhasil dibuat!');
        }}
      />
    </div>
  );
}
