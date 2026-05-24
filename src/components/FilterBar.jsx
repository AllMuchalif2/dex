import useFilterStore from '../store/filterStore';
import { GAME_VERSIONS, GEN_OPTIONS, TYPES } from '../utils/filterData';
import { getTypeColor } from '../utils/typeColors';
import { formatName, STAT_LABELS } from '../utils/formatters';
import { FaXmark, FaLock } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import useTeamStore from '../store/teamStore';
import { TEAM_GAME_VERSIONS } from './CreateTeamModal';

const TYPE_OPTIONS = TYPES.map((t) => ({ value: t, label: formatName(t) }));

function PillSelect({ id, placeholder, value, options, onChange, colorFn }) {
  const active = options.find((o) => o.value === value);
  const activeColor = active && colorFn ? colorFn(active.value) : null;

  const bg = active ? (activeColor ?? '#FF0000') : '#EFEFEF';
  const color = active ? '#fff' : '#555';

  return (
    <select
      id={id}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="appearance-none flex-1 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer outline-none transition-all text-center"
      style={{ backgroundColor: bg, color }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function FilterBar() {
  const {
    selectedVersion,
    selectedGen,
    selectedType,
    selectedAbility,
    selectedAbilitySlot,
    selectedGrowthRate,
    selectedEggGroup,
    selectedEvYield,
    setSelectedVersion,
    setSelectedGen,
    setSelectedType,
    setSelectedAbility,
    setSelectedAbilitySlot,
    setSelectedGrowthRate,
    setSelectedEggGroup,
    setSelectedEvYield,
    selectedMove,
    selectedMoveSlot,
    setSelectedMove,
    setSelectedMoveSlot,
    clearAll,
  } = useFilterStore();

  const location = useLocation();
  const pickingForTeam = location.state?.pickingForTeam;
  const teamGameVersion = pickingForTeam ? pickingForTeam.gameVersion : null;

  const hasAny = selectedVersion || selectedGen || selectedType || selectedAbility || selectedGrowthRate || selectedEggGroup || selectedEvYield || selectedMove;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        {teamGameVersion ? (
          <div className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-primary/70 bg-primary/10 justify-center truncate" title={`Filter terkunci untuk tim: ${pickingForTeam.name}`}>
            <FaLock size={10} className="shrink-0" />
            <span className="truncate">{TEAM_GAME_VERSIONS.find(g => g.id === teamGameVersion)?.label || teamGameVersion}</span>
          </div>
        ) : (
          <PillSelect
            id="filter-version"
            placeholder="ALL GAMES"
            value={selectedVersion}
            options={GAME_VERSIONS}
            onChange={setSelectedVersion}
          />
        )}
        <PillSelect
          id="filter-gen"
          placeholder="ALL GENS"
          value={selectedGen}
          options={GEN_OPTIONS}
          onChange={setSelectedGen}
        />
        <PillSelect
          id="filter-type"
          placeholder="ALL TYPES"
          value={selectedType}
          options={TYPE_OPTIONS}
          onChange={setSelectedType}
          colorFn={(t) => getTypeColor(t).bg}
        />
        {hasAny && (
          <button
            id="btn-clear-filters"
            onClick={clearAll}
            className="shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-red-50 text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <FaXmark />
            </div>
          </button>
        )}
      </div>

      {selectedAbility && (
        <div className="flex items-center justify-between bg-accent2/40 dark:bg-zinc-900/60 px-3 py-2 rounded-2xl border border-primary/5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 dark:text-primary/70 uppercase tracking-tighter shrink-0">Ability</span>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate">{formatName(selectedAbility)}</span>
            <button
              onClick={() => setSelectedAbility(null)}
              className="text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <FaXmark size={10} />
            </button>
          </div>
          
          <div className="flex bg-white/60 dark:bg-zinc-800/60 p-0.5 rounded-lg border border-primary/10 dark:border-zinc-700 shadow-sm">
            {[
              { id: 'all', label: 'All' },
              { id: 'normal', label: 'Normal' },
              { id: 'hidden', label: 'Hidden' }
            ].map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedAbilitySlot(slot.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  selectedAbilitySlot === slot.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedMove && (
        <div className="flex items-center justify-between bg-accent2/40 dark:bg-zinc-900/60 px-3 py-2 rounded-2xl border border-primary/5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 dark:text-primary/70 uppercase tracking-tighter shrink-0">Move</span>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate">{formatName(selectedMove)}</span>
            <button
              onClick={() => setSelectedMove(null)}
              className="text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <FaXmark size={10} />
            </button>
          </div>
          
          <div className="flex bg-white/60 dark:bg-zinc-800/60 p-0.5 rounded-lg border border-primary/10 dark:border-zinc-700 shadow-sm overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'level-up', label: 'Level' },
              { id: 'machine', label: 'TM/HM' },
              { id: 'egg', label: 'Egg' },
              { id: 'tutor', label: 'Tutor' }
            ].map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedMoveSlot(slot.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  selectedMoveSlot === slot.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedGrowthRate && (
        <div className="flex items-center justify-between bg-accent2/40 dark:bg-zinc-900/60 px-3 py-2 rounded-2xl border border-primary/5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 dark:text-primary/70 uppercase tracking-tighter shrink-0">Growth Rate</span>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate">{formatName(selectedGrowthRate)}</span>
          </div>
          <button
            onClick={() => setSelectedGrowthRate(null)}
            className="text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <FaXmark size={12} />
          </button>
        </div>
      )}

      {selectedEggGroup && (
        <div className="flex items-center justify-between bg-accent2/40 dark:bg-zinc-900/60 px-3 py-2 rounded-2xl border border-primary/5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 dark:text-primary/70 uppercase tracking-tighter shrink-0">Egg Group</span>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate">{formatName(selectedEggGroup)}</span>
          </div>
          <button
            onClick={() => setSelectedEggGroup(null)}
            className="text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <FaXmark size={12} />
          </button>
        </div>
      )}

      {selectedEvYield && (
        <div className="flex items-center justify-between bg-accent2/40 dark:bg-zinc-900/60 px-3 py-2 rounded-2xl border border-primary/5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 dark:text-primary/70 uppercase tracking-tighter shrink-0">EV Yield</span>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate">{STAT_LABELS[selectedEvYield] || selectedEvYield}</span>
          </div>
          <button
            onClick={() => setSelectedEvYield(null)}
            className="text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <FaXmark size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
