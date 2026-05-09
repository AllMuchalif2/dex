import { STAT_LABELS } from '../utils/formatters';

const STAT_MAX = { hp: 255, attack: 190, defense: 230, 'special-attack': 194, 'special-defense': 230, speed: 200 };

export default function StatBar({ name, value }) {
  const label = STAT_LABELS[name] ?? name;
  const max = STAT_MAX[name] ?? 255;
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? '#78C850' : pct >= 40 ? '#F8D030' : '#F08030';

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-14 text-right text-gray-500 font-medium shrink-0">{label}</span>
      <span className="w-8 text-center font-semibold text-gray-800">{value}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
