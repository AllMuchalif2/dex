import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TEAM_GAME_VERSIONS = [
  { id: null, label: 'Semua Game (Bebas)' },
  { id: 'red-blue', label: 'Red / Blue' },
  { id: 'gold-silver', label: 'Gold / Silver' },
  { id: 'ruby-sapphire', label: 'Ruby / Sapphire' },
  { id: 'diamond-pearl', label: 'Diamond / Pearl' },
  { id: 'black-white', label: 'Black / White' },
  { id: 'x-y', label: 'X / Y' },
  { id: 'sun-moon', label: 'Sun / Moon' },
  { id: 'sword-shield', label: 'Sword / Shield' },
  { id: 'scarlet-violet', label: 'Scarlet / Violet' },
];

export default function CreateTeamModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [gameVersion, setGameVersion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(name, gameVersion || null);
    setName('');
    setGameVersion('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Buat Tim Baru</h3>
              
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-1.5 block">Nama Tim</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Tim Juara"
                    className="w-full bg-gray-50 dark:bg-zinc-950/50 text-gray-800 dark:text-zinc-200 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase mb-1.5 block">Versi Game</label>
                  <select
                    value={gameVersion}
                    onChange={(e) => setGameVersion(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-950/50 text-gray-800 dark:text-zinc-200 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    {TEAM_GAME_VERSIONS.map(g => (
                      <option key={g.id || 'all'} value={g.id || ''}>{g.label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1.5">
                    Versi game tidak dapat diubah setelah tim dibuat.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex bg-gray-50 dark:bg-zinc-950/50 p-4 gap-3 justify-end border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-indigo-600 transition-colors shadow-sm cursor-pointer"
              >
                Buat Tim
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
