import { motion, AnimatePresence } from 'framer-motion';

export default function ClearChatModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800"
          >
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Hapus Riwayat Chat</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Apakah Anda yakin ingin menghapus semua riwayat chat dengan AI Advisor? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex bg-gray-50 dark:bg-zinc-950/50 p-4 gap-3 justify-end border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
