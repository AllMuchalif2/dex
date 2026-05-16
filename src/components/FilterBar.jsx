import useFilterStore from '../store/filterStore';
import { GAME_VERSIONS, GEN_OPTIONS, TYPES } from '../utils/filterData';
import { getTypeColor } from '../utils/typeColors';
import { formatName } from '../utils/formatters';
import { FaXmark } from 'react-icons/fa6';

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
    setSelectedVersion,
    setSelectedGen,
    setSelectedType,
    setSelectedAbilitySlot,
    clearAll,
  } = useFilterStore();

  const hasAny = selectedVersion || selectedGen || selectedType || selectedAbility;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <PillSelect
          id="filter-version"
          placeholder="ALL GAMES"
          value={selectedVersion}
          options={GAME_VERSIONS}
          onChange={setSelectedVersion}
        />
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
            className="shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-1">
              <FaXmark />
            </div>
          </button>
        )}
      </div>

      {selectedAbility && (
        <div className="flex items-center justify-between bg-accent2/40 px-3 py-2 rounded-2xl border border-primary/5 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[9px] font-black text-primary/60 uppercase tracking-tighter">Ability</span>
            <span className="text-xs font-bold text-gray-700 truncate">{formatName(selectedAbility)}</span>
          </div>
          
          <div className="flex bg-white/60 p-0.5 rounded-lg border border-primary/10 shadow-sm">
            {[
              { id: 'all', label: 'All' },
              { id: 'normal', label: 'Normal' },
              { id: 'hidden', label: 'Hidden' }
            ].map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedAbilitySlot(slot.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  selectedAbilitySlot === slot.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
