import { getTypeColor } from '../utils/typeColors';
import { formatName } from '../utils/formatters';

export default function TypeBadge({ type }) {
  const { bg } = getTypeColor(type);
  return (
    <span
      className="px-2.5 py-1 rounded-xl text-white text-[11px] font-semibold tracking-wide"
      style={{ backgroundColor: bg }}
    >
      {formatName(type)}
    </span>
  );
}
