import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FaCopy, FaCheck } from 'react-icons/fa6';

export default function ChatMessage({ msg, index, copiedIndex, onCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-primary text-white self-end rounded-br-sm'
          : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 self-start shadow-sm border border-gray-100 dark:border-zinc-800 rounded-bl-sm group'
      }`}
    >
      {msg.role === 'assistant' ? (
        <div className="text-sm dark:text-zinc-200 
          [&_p]:mb-2 last:[&_p]:mb-0 
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 
          [&_li]:mb-1 
          [&_strong]:font-bold 
          [&_em]:italic 
          [&_code]:bg-gray-100 dark:[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[13px] 
          [&_pre]:bg-gray-100 dark:[&_pre]:bg-zinc-800 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:mb-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
        >
          <ReactMarkdown>{msg.content}</ReactMarkdown>
          <button
            onClick={() => onCopy(msg.content, index)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            title="Salin Teks"
          >
            {copiedIndex === index ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
          </button>
        </div>
      ) : (
        <div className="whitespace-pre-wrap">{msg.content}</div>
      )}
    </motion.div>
  );
}
