const BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Gagal mengambil daftar pokemon');
  return res.json();
}

// Fetch semua nama pokemon sekali, di-cache 24h
export async function fetchAllPokemonNames() {
  const res = await fetch(`${BASE}/pokemon?limit=1010`);
  if (!res.ok) throw new Error('Gagal mengambil semua nama pokemon');
  const data = await res.json();
  return data.results;
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

export async function fetchEvolutionChain(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil rantai evolusi');
  return res.json();
}
