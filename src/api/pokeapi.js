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

export async function fetchPokemonAbility(name) {
  const res = await fetch(`${BASE}/ability/${name}`);
  if (!res.ok) throw new Error(`Gagal mengambil ability: ${name}`);
  return res.json();
}

export async function fetchPokemonMove(name) {
  const res = await fetch(`${BASE}/move/${name}`);
  if (!res.ok) throw new Error(`Gagal mengambil move: ${name}`);
  return res.json();
}

export async function fetchPokemonBatchGraphQL(ids) {
  if (!ids || ids.length === 0) return [];
  const query = `
    query getPokemonBatch {
      pokemon_v2_pokemon(where: {id: {_in: [${ids.join(',')}]}}) {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
      }
    }
  `;
  const res = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Gagal mengambil data batch via GraphQL');
  const json = await res.json();
  
  // Transform GraphQL response to match REST response shape expected by the app
  return json.data.pokemon_v2_pokemon.map(p => ({
    id: p.id,
    name: p.name,
    types: p.pokemon_v2_pokemontypes.map(pt => ({
      type: { name: pt.pokemon_v2_type.name }
    }))
  }));
}
