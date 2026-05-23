import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';
import { usePokemonMove } from '../hooks/usePokemonDetail';
import { formatName } from '../utils/formatters';
import { getTypeColor } from '../utils/typeColors';
import LoadingSpinner from './LoadingSpinner';

export default function MoveModal({ isOpen, onClose, moveName, onFilter }) {
  const { data: move, isLoading, isError } = usePokemonMove(isOpen ? moveName : null);

  // Close on escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Find english effect
  let effectText = '';
  let shortEffect = '';
  
  if (move) {
    const enEffect = move.effect_entries?.find(e => e.language.name === 'en');
    if (enEffect) {
      effectText = enEffect.effect.replace(/\$effect_chance/g, move.effect_chance || '');
      shortEffect = enEffect.short_effect.replace(/\$effect_chance/g, move.effect_chance || '');
    } else {
      const flavor = move.flavor_text_entries?.find(e => e.language.name === 'en');
      if (flavor) {
        effectText = flavor.flavor_text;
      }
    }
  }

  const typeColor = move ? getTypeColor(move.type.name).bg : '#ccc';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
              {moveName ? formatName(moveName) : 'Move'}
              {move && (
                <span 
                  className="text-[10px] text-white px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: typeColor }}
                >
                  {formatName(move.type.name)}
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FaXmark size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <LoadingSpinner />
                <p className="text-sm text-gray-500">Memuat informasi...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-6 text-red-500 text-sm">
                Gagal memuat detail move.
              </div>
            ) : move ? (
              <div className="flex flex-col gap-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-2 text-center border border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold">Power</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{move.power || '-'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-2 text-center border border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold">Accuracy</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{move.accuracy ? `${move.accuracy}%` : '-'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-2 text-center border border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold">PP</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{move.pp || '-'}</p>
                  </div>
                </div>

                {shortEffect && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                      Efek Singkat
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                      {shortEffect}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    Detail Efek
                  </p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {effectText || 'Tidak ada deskripsi tersedia.'}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer / Action */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
            <button
              onClick={() => onFilter && onFilter(moveName)}
              className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              Filter Pokemon dengan Move ini
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
