import { useState, useMemo } from 'react';
import { formatName } from '../utils/formatters';

const VERSION_TO_VERSION_GROUP = {
  'red': 'red-blue', 'blue': 'red-blue', 'yellow': 'yellow',
  'gold': 'gold-silver', 'silver': 'gold-silver', 'crystal': 'crystal',
  'ruby': 'ruby-sapphire', 'sapphire': 'ruby-sapphire', 'emerald': 'emerald',
  'firered': 'firered-leafgreen', 'leafgreen': 'firered-leafgreen',
  'diamond': 'diamond-pearl', 'pearl': 'diamond-pearl', 'platinum': 'platinum',
  'heartgold': 'heartgold-soulsilver', 'soulsilver': 'heartgold-soulsilver',
  'black': 'black-white', 'white': 'black-white',
  'black-2': 'black-2-white-2', 'white-2': 'black-2-white-2',
  'x': 'x-y', 'y': 'x-y',
  'omega-ruby': 'omega-ruby-alpha-sapphire', 'alpha-sapphire': 'omega-ruby-alpha-sapphire',
  'sun': 'sun-moon', 'moon': 'sun-moon',
  'ultra-sun': 'ultra-sun-ultra-moon', 'ultra-moon': 'ultra-sun-ultra-moon',
  'lets-go-pikachu': 'lets-go-pikachu-lets-go-eevee', 'lets-go-eevee': 'lets-go-pikachu-lets-go-eevee',
  'sword': 'sword-shield', 'shield': 'sword-shield',
  'brilliant-diamond': 'brilliant-diamond-shining-pearl', 'shining-pearl': 'brilliant-diamond-shining-pearl',
  'legends-arceus': 'legends-arceus',
  'scarlet': 'scarlet-violet', 'violet': 'scarlet-violet'
};

const METHOD_LABELS = {
  'level-up': 'Level Up',
  'machine': 'TM/HM',
  'egg': 'Egg Move',
  'tutor': 'Tutor',
};

const METHOD_ORDER = ['level-up', 'machine', 'egg', 'tutor'];

export default function PokemonMoves({ moves, version, onMoveClick }) {
  const [activeTab, setActiveTab] = useState('level-up');

  const { filteredMoves, activeVersion } = useMemo(() => {
    if (!moves || moves.length === 0) return { filteredMoves: {}, activeVersion: null };

    let targetGroup = version ? (VERSION_TO_VERSION_GROUP[version] || version) : null;
    
    if (!targetGroup) {
      const vgs = new Set();
      moves.forEach(m => m.version_group_details.forEach(d => vgs.add(d.version_group.name)));
      const vgArray = Array.from(vgs);
      targetGroup = vgArray[vgArray.length - 1];
    }

    if (!targetGroup) return { filteredMoves: {}, activeVersion: null };

    const grouped = {
      'level-up': [],
      'machine': [],
      'egg': [],
      'tutor': []
    };

    moves.forEach((m) => {
      const detail = m.version_group_details.find(
        (d) => d.version_group.name === targetGroup
      );

      if (detail) {
        const method = detail.move_learn_method.name;
        if (grouped[method]) {
          grouped[method].push({
            name: m.move.name,
            level: detail.level_learned_at,
          });
        } else {
           // Fallback for other methods if we want to add them later
           if(!grouped['other']) grouped['other'] = [];
           grouped['other'].push({
            name: m.move.name,
            level: detail.level_learned_at,
          });
        }
      }
    });

    // Sort level-up moves by level
    grouped['level-up'].sort((a, b) => a.level - b.level);
    
    // Sort other moves alphabetically
    ['machine', 'egg', 'tutor'].forEach(method => {
      grouped[method].sort((a, b) => a.name.localeCompare(b.name));
    });

    return { filteredMoves: grouped, activeVersion: targetGroup };
  }, [moves, version]);

  if (!moves || !filteredMoves || Object.values(filteredMoves).every(arr => arr?.length === 0)) {
    return null;
  }

  // Determine available tabs
  const availableTabs = METHOD_ORDER.filter(m => filteredMoves[m]?.length > 0);

  // If current active tab is empty, switch to first available
  if (!availableTabs.includes(activeTab) && availableTabs.length > 0) {
    setActiveTab(availableTabs[0]);
  }

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Daftar Move</p>
        {activeVersion && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
            {formatName(activeVersion)}
          </span>
        )}
      </div>

      {availableTabs.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {availableTabs.map(method => (
              <button
                key={method}
                onClick={() => setActiveTab(method)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  activeTab === method
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'bg-accent2 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {METHOD_LABELS[method] || method} ({filteredMoves[method].length})
              </button>
            ))}
          </div>

          <div className="bg-neutral-bg dark:bg-zinc-900 rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
              {filteredMoves[activeTab]?.map((move, idx) => (
                <button
                  key={idx}
                  onClick={() => onMoveClick && onMoveClick(move.name)}
                  className="flex items-center justify-between bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-primary/30 transition-all active:scale-95 cursor-pointer text-left w-full group"
                >
                  <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 truncate mr-2 group-hover:text-primary transition-colors">
                    {formatName(move.name)}
                  </span>
                  {activeTab === 'level-up' && move.level > 0 && (
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md shrink-0">
                      Lv {move.level}
                    </span>
                  )}
                  {activeTab === 'level-up' && move.level === 0 && (
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md shrink-0">
                      Evo
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
