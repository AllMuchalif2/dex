import { getTypeWeaknesses } from '../utils/typeEffectiveness';
import TypeBadge from './TypeBadge';

export default function TypeWeaknesses({ types }) {
  const weaknesses = getTypeWeaknesses(types);
  
  if (weaknesses.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-gray-700 mb-3">Kelemahan Tipe</p>
      <div className="flex flex-wrap gap-2">
        {weaknesses.map((w) => (
          <div key={w.type} className="relative">
            <TypeBadge type={w.type} />
            <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-black px-1 rounded-md border-2 border-white shadow-sm ${
              w.multiplier >= 4 ? 'bg-red-500 text-white' : 
              w.multiplier >= 2 ? 'bg-orange-400 text-white' : 
              'bg-gray-400 text-white'
            }`}>
              x{w.multiplier}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 italic">
        * Multiplier damage yang diterima dari tipe serangan tertentu.
      </p>
    </div>
  );
}
