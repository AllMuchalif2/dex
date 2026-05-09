import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaCheck } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { usePokemonDetail, usePokemonSpecies } from '../hooks/usePokemonDetail';
import { getTypeColor } from '../utils/typeColors';
import { formatId, formatName, formatHeight, formatWeight, getSpriteUrl } from '../utils/formatters';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import LoadingSpinner from '../components/LoadingSpinner';
import useTeamStore from '../store/teamStore';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id);
  const { data: species } = usePokemonSpecies(id);
  const { team, addToTeam } = useTeamStore();

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

  const flavorText = species?.flavor_text_entries
    ?.find((e) => e.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') ?? '';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-full"
    >
      {/* Header dengan warna tipe */}
      <div className="relative px-4 pt-12 pb-6" style={{ backgroundColor: light }}>
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
          className="mx-auto mt-2 drop-shadow-md"
        />
      </div>

      {/* Konten detail */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-5 pt-6 pb-10">
        {/* Deskripsi */}
        {flavorText && (
          <p className="text-gray-500 text-sm text-center mb-5 leading-relaxed">{flavorText}</p>
        )}

        {/* Info fisik */}
        <div className="flex justify-around mb-6 bg-neutral-bg rounded-2xl py-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Tinggi</p>
            <p className="font-semibold text-gray-800">{formatHeight(pokemon.height)}</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Berat</p>
            <p className="font-semibold text-gray-800">{formatWeight(pokemon.weight)}</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Exp. Dasar</p>
            <p className="font-semibold text-gray-800">{pokemon.base_experience ?? '-'}</p>
          </div>
        </div>

        {/* Ability */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">Kemampuan</p>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <span
                key={a.ability.name}
                className="bg-accent2 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {formatName(a.ability.name)}
                {a.is_hidden && <span className="ml-1 text-gray-400">(tersembunyi)</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Statistik Dasar</p>
          <div className="flex flex-col gap-2.5">
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </div>

        {/* Tombol tambah ke tim */}
        <button
          id="btn-add-team"
          onClick={handleAddToTeam}
          disabled={inTeam}
          className={`w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            inTeam
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white active:scale-95'
          }`}
        >
          {inTeam ? <><FaCheck /> Sudah di Tim</> : <><FaPlus /> Tambah ke Tim</>}
        </button>
      </div>
    </motion.div>
  );
}
