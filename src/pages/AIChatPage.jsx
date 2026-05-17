import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaKey, FaRobot, FaSun, FaMoon } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatWithGroq } from '../api/groq';
import useTeamStore from '../store/teamStore';
import useSettingsStore from '../store/settingsStore';
import { formatName } from '../utils/formatters';

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const bottomRef = useRef(null);

  const { team } = useTeamStore();
  const { groqApiKey, setGroqApiKey, isDark, toggleDarkMode } = useSettingsStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    if (!groqApiKey) { toast.error('Masukkan Groq API key terlebih dahulu'); setShowKeyInput(true); return; }

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatWithGroq({
        apiKey: groqApiKey,
        messages: [...messages, userMsg],
        team: team.map((p) => ({ name: formatName(p.name), types: p.types })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveKey() {
    if (!tempKey.trim()) return;
    setGroqApiKey(tempKey.trim());
    setShowKeyInput(false);
    setTempKey('');
    toast.success('API key disimpan');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 px-4 pt-10 pb-4 md:pt-6 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">AI Advisor</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            Tim: {team.length > 0 ? team.map((p) => formatName(p.name)).join(', ') : 'Kosong'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center shadow-sm"
          >
            {isDark ? <FaSun size={14} className="text-amber-500 animate-in spin-in-12 duration-300" /> : <FaMoon size={14} className="text-indigo-500 animate-in spin-in-12 duration-300" />}
          </button>
          <button
            id="btn-api-key"
            onClick={() => setShowKeyInput((v) => !v)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              groqApiKey 
                ? 'text-green-600 bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900' 
                : 'text-gray-400 bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
            }`}
          >
            <FaKey size={14} />
          </button>
        </div>
      </div>

      {/* Input API Key */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-accent2/30 dark:bg-zinc-900/50 border-b border-accent1 dark:border-zinc-800 px-4 py-3"
          >
            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-2 font-medium">Groq API Key (BYOK)</p>
            <div className="flex gap-2">
              <input
                id="input-groq-key"
                type="password"
                placeholder="gsk_..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                className="flex-1 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 rounded-xl px-3 py-2 text-sm outline-none border border-accent1 dark:border-zinc-850"
              />
              <button
                onClick={handleSaveKey}
                className="bg-primary text-white text-sm px-4 rounded-xl font-medium cursor-pointer"
              >
                Simpan
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
              Dapatkan API key gratis di{' '}
              <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-primary underline">
                console.groq.com
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Area pesan */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4 flex flex-col gap-3">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 flex-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400 dark:text-zinc-600">
            <FaRobot size={40} className="opacity-30" />
            <p className="text-sm">Tanyakan saran tim Pokemon-mu kepada AI!</p>
            <p className="text-xs">Contoh: "Apa kelemahan timku?" atau "Rekomendasikan Pokemon ke-4 untuk tim ini"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-white self-end rounded-br-sm'
                : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 self-start shadow-sm border border-gray-100 dark:border-zinc-800 rounded-bl-sm'
            }`}
          >
            {msg.content}
          </motion.div>
        ))}

        {loading && (
          <div className="self-start bg-white dark:bg-zinc-900 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-zinc-800">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                />
              ))}
            </span>
          </div>
        )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input pesan */}
      <div className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 px-4 py-3 pb-24 md:pb-4 flex gap-2">
        <div className="w-full max-w-2xl mx-auto flex gap-2">
        <input
          id="input-chat"
          type="text"
          placeholder="Tanya AI tentang timmu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
          className="flex-1 bg-neutral-bg dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none"
        />
        <button
          id="btn-send"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 shrink-0 cursor-pointer"
        >
          <FaPaperPlane size={14} />
        </button>
        </div>
      </div>
    </div>
  );
}
