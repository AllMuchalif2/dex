// Ambil semua ID pokemon dari endpoint tipe, filter hanya ID 1-1010
export async function fetchPokemonIdsByType(type) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  if (!res.ok) throw new Error(`Gagal mengambil tipe: ${type}`);
  const data = await res.json();
  return data.pokemon
    .map((p) => parseInt(p.pokemon.url.split('/').filter(Boolean).pop()))
    .filter((id) => id >= 1 && id <= 1010)
    .sort((a, b) => a - b);
}
