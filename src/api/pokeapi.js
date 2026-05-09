const BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Gagal mengambil daftar pokemon');
  return res.json();
}

export async function fetchPokemonDetail(idOrName) {
  const res = await fetch(`${BASE}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Gagal mengambil detail: ${idOrName}`);
  return res.json();
}

export async function fetchPokemonSpecies(id) {
  const res = await fetch(`${BASE}/pokemon-species/${id}`);
  if (!res.ok) throw new Error(`Gagal mengambil spesies: ${id}`);
  return res.json();
}

export async function searchPokemon(name) {
  const res = await fetch(`${BASE}/pokemon/${name.toLowerCase().trim()}`);
  if (!res.ok) return null;
  return res.json();
}
