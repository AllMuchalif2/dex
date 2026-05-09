import useFilterStore from '../store/filterStore';
import { GAME_VERSIONS, GEN_OPTIONS, TYPES } from '../utils/filterData';
import { getTypeColor } from '../utils/typeColors';
import { formatName } from '../utils/formatters';

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
      className="appearance-none shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer outline-none transition-all"
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
    setSelectedVersion,
    setSelectedGen,
    setSelectedType,
    clearAll,
  } = useFilterStore();

  const hasAny = selectedVersion || selectedGen || selectedType;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
          Reset
        </button>
      )}
    </div>
  );
}
