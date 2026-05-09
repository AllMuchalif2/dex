import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTypeColor } from '../utils/typeColors';
import { formatId, formatName, getSpriteUrl } from '../utils/formatters';
import TypeBadge from './TypeBadge';

export default function PokemonCard({ id, name, types = [] }) {
  const navigate = useNavigate();
  const primaryType = types[0] ?? 'normal';
  const { light } = getTypeColor(primaryType);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/pokemon/${id}`)}
      className="bg-white rounded-2xl p-3 cursor-pointer shadow-sm border border-gray-100 flex flex-col items-center gap-2"
    >
      <div
        className="w-full rounded-xl flex items-center justify-center pt-2 pb-1"
        style={{ backgroundColor: light }}
      >
        <img
          src={getSpriteUrl(id)}
          alt={name}
          width={80}
          height={80}
          loading="lazy"
          className="drop-shadow-sm"
        />
      </div>
      <p className="text-xs text-gray-400 font-medium">{formatId(id)}</p>
      <p className="text-sm font-semibold text-gray-800 leading-tight text-center">{formatName(name)}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </motion.div>
  );
}
