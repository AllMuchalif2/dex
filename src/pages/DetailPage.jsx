import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaCheck, FaMars, FaVenus } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { usePokemonDetail, usePokemonSpecies } from '../hooks/usePokemonDetail';
import { usePokemonDescription } from '../hooks/usePokemonDescription';
import { getTypeColor } from '../utils/typeColors';
import { formatId, formatName, formatHeight, formatWeight, getSpriteUrl, STAT_LABELS } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import LoadingSpinner from '../components/LoadingSpinner';
import useTeamStore from '../store/teamStore';
import useFilterStore from '../store/filterStore';
import { VERSION_TO_GEN } from '../utils/filterData';
import EvolutionChain from '../components/EvolutionChain';
import TypeWeaknesses from '../components/TypeWeaknesses';


export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeAbilityTab, setActiveAbilityTab] = useState('normal');
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id);
  const { data: species } = usePokemonSpecies(id);
  const { team, addToTeam } = useTeamStore();
  const { selectedVersion, setSelectedAbility } = useFilterStore();
  const { description, versionName } = usePokemonDescription(id, selectedVersion);

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


  function handleAddToTeam() {
    const success = addToTeam({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      sprite: getSpriteUrl(pokemon.id),
    });
    if (success) toast.success(`${formatName(pokemon.name)} ditambahkan ke tim!`);
    else if (team.length >= 6) toast.error('Tim sudah penuh (maks 6 Pokemon)');
    else toast.error(`${formatName(pokemon.name)} sudah ada di tim`);
  }
  const evYield = pokemon.stats
    .filter((s) => s.effort > 0)
    .map((s) => `${s.effort} ${STAT_LABELS[s.stat.name] || s.stat.name}`)
    .join(', ');

  const impliedGen = selectedVersion ? VERSION_TO_GEN[selectedVersion] : 'generation-ix';
  const showAbilities = !['generation-i', 'generation-ii'].includes(impliedGen);
  const showHidden = showAbilities && !['generation-iii', 'generation-iv'].includes(impliedGen);

  const genderRate = species?.gender_rate;
  const isGenderless = genderRate === -1;
  const femalePercent = (genderRate / 8) * 100;
  const malePercent = 100 - femalePercent;
  function handleAbilityClick(abilityName) {
    setSelectedAbility(abilityName);
    navigate('/');
    toast.success(`Filter: Ability ${formatName(abilityName)}`);
  }

  const varieties = pokemon.forms.length > 1 || (species?.varieties?.length > 1) 
    ? species.varieties.filter(v => !v.is_default)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row min-h-svh"
    >
      {/* Panel kiri: header + gambar (sticky di desktop) */}
      <div className="relative px-4 pt-12 pb-6 md:w-80 md:min-h-svh md:sticky md:top-0 md:flex md:flex-col md:justify-center md:shrink-0" style={{ backgroundColor: light }}>
        <button
          id="btn-back"
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 p-2 rounded-full bg-white/60 backdrop-blur-sm"
        >
          <FaArrowLeft size={16} className="text-gray-700" />
        </button>

        <div className="text-center mt-4">
          <p className="text-sm font-medium opacity-60">{formatId(pokemon.id)}</p>
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
      <div className="flex-1 bg-white md:rounded-none rounded-t-3xl -mt-4 md:mt-0 px-5 md:px-8 pt-6 pb-24 md:pb-10 md:overflow-y-auto">
        {/* Deskripsi */}
        {description && (
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm leading-relaxed mb-2">{description}</p>
            {versionName && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Pokemon {formatName(versionName)}
              </span>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="bg-neutral-bg rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-y-6">
            {/* Row 1: Physical */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Tinggi</p>
              <p className="text-sm font-bold text-gray-800">{formatHeight(pokemon.height)}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Berat</p>
              <p className="text-sm font-bold text-gray-800">{formatWeight(pokemon.weight)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Generasi</p>
              <p className="text-sm font-bold text-gray-800">{formatName(species?.generation?.name ?? '-')}</p>
            </div>

            <div className="col-span-3 h-px bg-gray-200/50" />

            {/* Row 2: Training */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Catch Rate</p>
              <p className="text-sm font-bold text-gray-800">{species?.capture_rate ?? '-'}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Happiness</p>
              <p className="text-sm font-bold text-gray-800">{species?.base_happiness ?? '-'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Base Exp</p>
              <p className="text-sm font-bold text-gray-800">{pokemon.base_experience ?? '-'}</p>
            </div>

            <div className="col-span-3 h-px bg-gray-200/50" />

            {/* Row 3: Biological */}
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Habitat</p>
              <p className="text-sm font-bold text-gray-800 truncate px-1">{formatName(species?.habitat?.name ?? 'Unknown')}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Growth Rate</p>
              <p className="text-[11px] font-bold text-gray-800 leading-tight">
                {species?.growth_rate ? formatName(species.growth_rate.name) : '-'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Egg Groups</p>
              <p className="text-[11px] font-bold text-gray-800 leading-tight">
                {species?.egg_groups?.map((g) => formatName(g.name)).join(', ') || '-'}
              </p>
            </div>

            <div className="col-span-3 h-px bg-gray-200/50" />

            {/* Row 4: Special */}
            <div className="col-span-1 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Gender</p>
              {isGenderless ? (
                <p className="text-sm font-bold text-gray-400 uppercase">None</p>
              ) : (
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold">
                  <span className="flex items-center text-blue-500 gap-0.5"><FaMars size={10}/>{malePercent}%</span>
                  <span className="flex items-center text-pink-500 gap-0.5"><FaVenus size={10}/>{femalePercent}%</span>
                </div>
              )}
            </div>
            <div className="col-span-2 text-center border-l border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">EV Yield</p>
              <p className="text-xs font-bold text-gray-800">{evYield || '-'}</p>
            </div>
          </div>
        </div>

        {/* Ability */}
        {showAbilities && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Kemampuan</p>
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
                        className="bg-accent2 hover:bg-primary/5 text-gray-700 hover:text-primary text-xs font-medium px-3 py-2.5 rounded-xl text-center border border-gray-100 hover:border-primary/20 transition-all active:scale-95 shadow-sm sm:shadow-none"
                      >
                        {formatName(a.ability.name)}
                      </button>
                    ))}
                  </div>
                  {showHidden && hidden && (
                    <button
                      onClick={() => handleAbilityClick(hidden.ability.name)}
                      className="bg-gray-50 hover:bg-primary/5 text-gray-500 hover:text-primary text-[11px] font-medium px-3 py-2.5 rounded-xl text-center border border-dashed border-gray-200 hover:border-primary/20 transition-all active:scale-95"
                    >
                      <span className="opacity-60 mr-1">Hidden Ability:</span>
                      <span className="text-gray-700 font-bold group-hover:text-primary">
                        {formatName(hidden.ability.name)}
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">Statistik Dasar</p>
          <div className="flex flex-col gap-2.5">
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </div>

        {/* Varietas / Form Lain */}
        {varieties.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">Varian Lain</p>
            <div className="flex flex-wrap gap-2">
              {varieties.map((v) => (
                <div key={v.pokemon.name} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-medium text-gray-600">
                  {formatName(v.pokemon.name)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type Weaknesses */}
        <TypeWeaknesses types={pokemon.types.map(t => t.type.name)} />

        {/* Evolution Chain */}
        {species?.evolution_chain && <EvolutionChain url={species.evolution_chain.url} />}

        <div className="mt-10">
          <button
            id="btn-add-team"
            onClick={handleAddToTeam}
            disabled={inTeam}
            className={`w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              inTeam
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white active:scale-95 shadow-lg shadow-primary/20'
            }`}
          >
            {inTeam ? <><FaCheck /> Sudah di Tim</> : <><FaPlus /> Tambah ke Tim</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
