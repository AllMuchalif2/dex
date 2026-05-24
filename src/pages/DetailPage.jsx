import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaCheck, FaMars, FaVenus, FaSun, FaMoon } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { usePokemonDetail, usePokemonSpecies } from '../hooks/usePokemonDetail';
import { usePokemonDescription } from '../hooks/usePokemonDescription';
import { getTypeColor } from '../utils/typeColors';
import { formatId, formatName, formatHeight, formatWeight, getSpriteUrl, STAT_LABELS, getIdFromUrl } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import LoadingSpinner from '../components/LoadingSpinner';
import useTeamStore from '../store/teamStore';
import useFilterStore from '../store/filterStore';
import useSettingsStore from '../store/settingsStore';
import { VERSION_TO_GEN } from '../utils/filterData';
import { VERSION_TO_VERSION_GROUP } from '../components/PokemonMoves';
import EvolutionChain from '../components/EvolutionChain';
import TypeWeaknesses from '../components/TypeWeaknesses';
import PokemonMoves from '../components/PokemonMoves';
import AbilityModal from '../components/AbilityModal';
import MoveModal from '../components/MoveModal';


export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeAbilityTab, setActiveAbilityTab] = useState('normal');
  const [selectedModalAbility, setSelectedModalAbility] = useState(null);
  const [selectedModalMove, setSelectedModalMove] = useState(null);
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id);
  const { data: species } = usePokemonSpecies(pokemon?.species?.name);
  const addToTeam = useTeamStore((s) => s.addToTeam);
  const activeTeam = useTeamStore((s) => s.getActiveTeam());
  const { isDark, toggleDarkMode } = useSettingsStore();
  const { selectedVersion, setSelectedAbility, setSelectedGrowthRate, setSelectedEggGroup, setSelectedEvYield, setSelectedMove } = useFilterStore();
  const location = useLocation();
  const pickingForTeam = location.state?.pickingForTeam;
  const targetTeam = pickingForTeam || activeTeam;
  const team = targetTeam.pokemonList;
  const effectiveVersion = pickingForTeam ? pickingForTeam.gameVersion : selectedVersion;
  const { description, versionName } = usePokemonDescription(pokemon?.species?.name || id, effectiveVersion);

  if (isLoading) return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
  if (isError || !pokemon) return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <p className="text-gray-500">Pokemon tidak ditemukan</p>
      <button onClick={() => navigate('/')} className="text-primary text-sm font-medium">Kembali</button>
    </div>
  );

  const primaryType = pokemon.types[0].type.name;
  const { bg, light } = getTypeColor(primaryType);
  const inTeam = team.some((p) => p.id === pokemon.id);

  const handleAddToTeam = () => {
    if (team.length >= 6) {
      toast.error('Tim sudah penuh (maksimal 6)');
      return;
    }
    if (team.find((p) => p.id === pokemon.id)) {
      toast.error(`${formatName(pokemon.name)} sudah ada di tim`);
      return;
    }

    if (targetTeam.gameVersion && pokemon.moves) {
      // Validate by checking if it has any moves in the target game version
      const targetGroup = VERSION_TO_VERSION_GROUP[targetTeam.gameVersion] || targetTeam.gameVersion;
      let isValid = false;
      
      for (const m of pokemon.moves) {
        if (m.version_group_details.some(d => d.version_group.name === targetGroup)) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        toast.error(`Pokemon ini tidak ada di game ${targetTeam.gameVersion.replace('-', ' & ').toUpperCase()}!`);
        return;
      }
    }

    addToTeam({
      id: pokemon.id,
      name: pokemon.name,
      sprite: getSpriteUrl(pokemon.id),
      types: pokemon.types.map((t) => t.type.name),
    }, targetTeam.id);
    toast.success(`${formatName(pokemon.name)} ditambahkan ke ${targetTeam.name}`);
    if (pickingForTeam) {
      navigate('/team'); // Go back to team if it was a picking flow
    }
  };

  const evYield = pokemon.stats
    .filter((s) => s.effort > 0)
    .map((s) => `${s.effort} ${STAT_LABELS[s.stat.name] || s.stat.name}`)
    .join(', ');

  const impliedGen = effectiveVersion ? VERSION_TO_GEN[effectiveVersion] : 'generation-ix';
  const showAbilities = !['generation-i', 'generation-ii'].includes(impliedGen);
  const showHidden = showAbilities && !['generation-iii', 'generation-iv'].includes(impliedGen);

  const genderRate = species?.gender_rate;
  const isGenderless = genderRate === -1;
  const femalePercent = (genderRate / 8) * 100;
  const malePercent = 100 - femalePercent;
  function handleAbilityClick(abilityName) {
    setSelectedModalAbility(abilityName);
  }

  function handleFilterByAbility(abilityName) {
    setSelectedAbility(abilityName);
    setSelectedModalAbility(null);
    navigate('/');
    toast.success(`Filter: Ability ${formatName(abilityName)}`);
  }

  function handleMoveClick(moveName) {
    setSelectedModalMove(moveName);
  }

  function handleFilterByMove(moveName) {
    setSelectedMove(moveName);
    setSelectedModalMove(null);
    navigate('/');
    toast.success(`Filter: Move ${formatName(moveName)}`);
  }

  function handleGrowthRateClick(growthRate) {
    setSelectedGrowthRate(growthRate);
    navigate('/');
    toast.success(`Filter: Growth Rate ${formatName(growthRate)}`);
  }

  function handleEggGroupClick(eggGroup) {
    setSelectedEggGroup(eggGroup);
    navigate('/');
    toast.success(`Filter: Egg Group ${formatName(eggGroup)}`);
  }

  function handleEvYieldClick(statName) {
    setSelectedEvYield(statName);
    navigate('/');
    toast.success(`Filter: EV Yield ${STAT_LABELS[statName] || statName}`);
  }

  const varieties = species?.varieties?.length > 1
    ? species.varieties.filter((v) => v.pokemon.name !== pokemon.name)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row min-h-svh md:h-screen md:overflow-hidden"
    >
      {/* Sticky Header Mobile */}
      <div 
        className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ backgroundColor: light }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="p-2 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm text-gray-800 dark:text-zinc-200 cursor-pointer"
          >
            <FaArrowLeft size={16} />
          </button>
          <span className="font-bold text-gray-900 capitalize drop-shadow-sm">{formatName(pokemon.name)}</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm text-gray-800 dark:text-zinc-200 cursor-pointer"
        >
          {isDark ? <FaSun size={16} className="text-amber-600 dark:text-amber-400" /> : <FaMoon size={16} className="text-indigo-600 dark:text-indigo-400" />}
        </button>
      </div>

      {/* Panel kiri: header + gambar (fixed di desktop) */}
      <div className="relative px-4 pt-4 pb-6 md:pt-12 md:w-80 md:h-full md:flex md:flex-col md:justify-center md:shrink-0 dark:brightness-95 dark:opacity-90" style={{ backgroundColor: light }}>
        {/* Tombol Back Desktop */}
        <button
          id="btn-back"
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="hidden md:flex absolute top-12 left-4 p-2 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm text-gray-700 dark:text-zinc-300 cursor-pointer z-30 shadow-sm hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-colors"
        >
          <FaArrowLeft size={16} />
        </button>

        {/* Tombol Theme Desktop */}
        <button
          onClick={toggleDarkMode}
          className="hidden md:flex absolute top-12 right-4 p-2 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm text-gray-700 dark:text-zinc-300 cursor-pointer z-30 shadow-sm hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-colors"
        >
          {isDark ? <FaSun size={16} className="text-amber-600 dark:text-amber-400" /> : <FaMoon size={16} className="text-indigo-600 dark:text-indigo-400" />}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm font-medium opacity-60 text-gray-900">{formatId(pokemon.id)}</p>
          <h1 className="text-2xl font-bold text-gray-900">{formatName(pokemon.name)}</h1>
          <div className="flex gap-2 justify-center mt-2">
            {pokemon.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </div>
        </div>

        <img
          src={getSpriteUrl(pokemon.id)}
          alt={pokemon.name}
          width={180}
          height={180}
          className="mx-auto mt-2 drop-shadow-md md:w-[220px] md:h-[220px]"
        />
      </div>

      {/* Panel kanan: detail */}
      <div className="flex-1 min-w-0 w-full bg-white dark:bg-zinc-950 md:rounded-none rounded-t-3xl -mt-4 md:mt-0 px-5 md:px-8 pt-6 pb-24 md:pb-10 md:overflow-y-auto">
        {/* Deskripsi */}
        {description && (
          <div className="mb-6 text-center flex flex-col items-center gap-2">
            <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed w-full wrap-break-word whitespace-normal">{description}</p>
            <div className="flex gap-2 justify-center items-center">
              {versionName && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
                  Pokemon {formatName(versionName)}
                </span>
              )}
              {species?.generation?.name && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
                  {formatName(species.generation.name)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="bg-neutral-bg dark:bg-zinc-900 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {/* Row 1: Physical */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Tinggi</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{formatHeight(pokemon.height)}</p>
            </div>
            <div className="text-center border-l border-gray-200 dark:border-zinc-800">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Berat</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{formatWeight(pokemon.weight)}</p>
            </div>

            <div className="col-span-2 h-px bg-gray-200/50 dark:bg-zinc-800/50" />

            {/* Row 2: Training */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Catch Rate</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{species?.capture_rate ?? '-'}</p>
            </div>
            <div className="text-center border-l border-gray-200 dark:border-zinc-800">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Happiness</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{species?.base_happiness ?? '-'}</p>
            </div>

            <div className="col-span-2 h-px bg-gray-200/50 dark:bg-zinc-800/50" />

            {/* Row 3: Stats */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Base Exp</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{pokemon.base_experience ?? '-'}</p>
            </div>
            <div className="text-center border-l border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">EV Yield</p>
              {pokemon.stats.some((s) => s.effort > 0) ? (
                <div className="flex flex-wrap gap-1 justify-center mt-0.5 max-w-full px-1">
                  {pokemon.stats.filter((s) => s.effort > 0).map((s) => (
                    <button
                      key={s.stat.name}
                      onClick={() => handleEvYieldClick(s.stat.name)}
                      className="text-[9px] font-black bg-accent2 hover:bg-primary/5 dark:bg-zinc-900/50 dark:hover:bg-primary/10 border border-gray-150 dark:border-zinc-800 hover:border-primary/20 text-gray-700 dark:text-zinc-300 hover:text-primary px-1.5 py-0.5 rounded-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      {s.effort} {STAT_LABELS[s.stat.name] || s.stat.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">-</p>
              )}
            </div>

            <div className="col-span-2 h-px bg-gray-200/50 dark:bg-zinc-800/50" />

            {/* Row 4: Biological */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Habitat</p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate px-1">{formatName(species?.habitat?.name ?? 'Unknown')}</p>
            </div>
            <div className="text-center border-l border-gray-200 dark:border-zinc-800">
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Gender</p>
              {isGenderless ? (
                <p className="text-sm font-bold text-gray-400 uppercase">None</p>
              ) : (
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                  <span className="flex items-center text-blue-500 gap-0.5"><FaMars size={10}/>{malePercent}%</span>
                  <span className="flex items-center text-pink-500 gap-0.5"><FaVenus size={10}/>{femalePercent}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ability */}
        {showAbilities && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">Kemampuan</p>
            {(() => {
              const normal = pokemon.abilities.filter((a) => !a.is_hidden);
              const hidden = pokemon.abilities.find((a) => a.is_hidden);
              return (
                <div className="flex flex-col gap-2">
                  <div className={`grid gap-2 ${normal.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {normal.map((a) => (
                      <button
                        key={a.ability.name}
                        onClick={() => handleAbilityClick(a.ability.name)}
                        className="bg-accent2 dark:bg-zinc-900/50 hover:bg-primary/5 text-gray-700 dark:text-zinc-300 hover:text-primary text-xs font-medium px-3 py-2.5 rounded-xl text-center border border-gray-100 dark:border-zinc-800 hover:border-primary/20 transition-all active:scale-95 shadow-sm sm:shadow-none cursor-pointer"
                      >
                        {formatName(a.ability.name)}
                      </button>
                    ))}
                  </div>
                  {showHidden && hidden && (
                    <button
                      onClick={() => handleAbilityClick(hidden.ability.name)}
                      className="bg-gray-50 dark:bg-zinc-900/30 hover:bg-primary/5 text-gray-500 hover:text-primary text-[11px] font-medium px-3 py-2.5 rounded-xl text-center border border-dashed border-gray-200 dark:border-zinc-800 hover:border-primary/20 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="opacity-60 mr-1">Hidden Ability:</span>
                      <span className="text-gray-700 dark:text-zinc-300 font-bold group-hover:text-primary">
                        {formatName(hidden.ability.name)}
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Growth Rate */}
        {species?.growth_rate && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">Laju Pertumbuhan</p>
            <button
              onClick={() => handleGrowthRateClick(species.growth_rate.name)}
              className="w-full bg-accent2 dark:bg-zinc-900/50 hover:bg-primary/5 text-gray-700 dark:text-zinc-300 hover:text-primary text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-primary/20 transition-all active:scale-95 shadow-sm sm:shadow-none cursor-pointer text-center"
            >
              {formatName(species.growth_rate.name)}
            </button>
          </div>
        )}

        {/* Egg Groups */}
        {species?.egg_groups && species.egg_groups.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">Kelompok Telur</p>
            <div className={`grid gap-2 ${species.egg_groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {species.egg_groups.map((g) => (
                <button
                  key={g.name}
                  onClick={() => handleEggGroupClick(g.name)}
                  className="w-full bg-accent2 dark:bg-zinc-900/50 hover:bg-primary/5 text-gray-700 dark:text-zinc-300 hover:text-primary text-xs font-semibold px-4 py-2.5 rounded-xl text-center border border-gray-100 dark:border-zinc-800 hover:border-primary/20 transition-all active:scale-95 shadow-sm sm:shadow-none cursor-pointer"
                >
                  {formatName(g.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Statistik Dasar</p>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500">
              Total: <span className="text-gray-800 dark:text-zinc-200 text-sm ml-1">{pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0)}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </div>

        {/* Type Weaknesses */}
        <TypeWeaknesses types={pokemon.types.map(t => t.type.name)} />

        {/* Varietas / Form Lain */}
        {varieties.length > 0 && (
          <div className="mb-8 mt-8">
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">Varian Lain</p>
            <div className="flex flex-wrap gap-2">
              {varieties.map((v) => {
                const varId = getIdFromUrl(v.pokemon.url);
                return (
                  <button
                    key={v.pokemon.name}
                    onClick={() => navigate(`/pokemon/${varId}`)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-primary/20 hover:text-primary rounded-lg text-[11px] font-semibold text-gray-600 dark:text-zinc-400 transition-all active:scale-95 cursor-pointer"
                  >
                    {formatName(v.pokemon.name)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Evolution Chain */}
        {species?.evolution_chain && <EvolutionChain url={species.evolution_chain.url} />}

        {/* Moves List */}
        {pokemon.moves && (
          <PokemonMoves moves={pokemon.moves} version={effectiveVersion || versionName} onMoveClick={handleMoveClick} />
        )}

        <div className="mt-10">
          <button
            id="btn-add-team"
            onClick={handleAddToTeam}
            disabled={inTeam}
            className={`w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              inTeam
                ? 'bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                : 'bg-primary text-white active:scale-95 shadow-lg shadow-primary/20'
            }`}
          >
            {inTeam ? <><FaCheck /> Sudah di Tim</> : <><FaPlus /> Tambah ke Tim</>}
          </button>
        </div>
      </div>

      {/* Ability Modal */}
      {/* Ability Modal */}
      <AbilityModal
        isOpen={!!selectedModalAbility}
        onClose={() => setSelectedModalAbility(null)}
        abilityName={selectedModalAbility}
        onFilter={handleFilterByAbility}
      />

      {/* Move Modal */}
      <MoveModal
        isOpen={!!selectedModalMove}
        onClose={() => setSelectedModalMove(null)}
        moveName={selectedModalMove}
        onFilter={handleFilterByMove}
      />
    </motion.div>
  );
}
