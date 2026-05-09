import { getTypeColor } from '../utils/typeColors';
import { formatName } from '../utils/formatters';

export default function TypeBadge({ type }) {
  const { bg } = getTypeColor(type);
  return (
    <span
      className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
      style={{ backgroundColor: bg }}
    >
      {formatName(type)}
    </span>
  );
}
