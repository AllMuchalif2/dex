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
export async function fetchPokemonIdsByAbility(ability) {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
  if (!res.ok) throw new Error(`Gagal mengambil ability: ${ability}`);
  const data = await res.json();
  return data.pokemon
    .map((p) => ({
      id: parseInt(p.pokemon.url.split('/').filter(Boolean).pop()),
      isHidden: p.is_hidden,
    }))
    .filter((p) => p.id >= 1 && p.id <= 1010);
}
export async function fetchPokemonIdsByGrowthRate(growthRate) {
  const res = await fetch(`https://pokeapi.co/api/v2/growth-rate/${growthRate}`);
  if (!res.ok) throw new Error(`Gagal mengambil growth rate: ${growthRate}`);
  const data = await res.json();
  return data.pokemon_species
    .map((p) => parseInt(p.url.split('/').filter(Boolean).pop()))
    .filter((id) => id >= 1 && id <= 1010)
    .sort((a, b) => a - b);
}
export async function fetchPokemonIdsByEggGroup(eggGroup) {
  const res = await fetch(`https://pokeapi.co/api/v2/egg-group/${eggGroup}`);
  if (!res.ok) throw new Error(`Gagal mengambil egg group: ${eggGroup}`);
  const data = await res.json();
  return data.pokemon_species
    .map((p) => parseInt(p.url.split('/').filter(Boolean).pop()))
    .filter((id) => id >= 1 && id <= 1010)
    .sort((a, b) => a - b);
}

export async function fetchPokemonIdsByMove(move) {
  const query = `
    query getPokemonIdsByMove {
      pokemon_v2_pokemon(where: {pokemon_v2_pokemonmoves: {pokemon_v2_move: {name: {_eq: "${move}"}}}}) {
        id
        pokemon_v2_pokemonmoves(where: {pokemon_v2_move: {name: {_eq: "${move}"}}}) {
          pokemon_v2_movelearnmethod {
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
  if (!res.ok) throw new Error(`Gagal mengambil move: ${move}`);
  const json = await res.json();
  
  return json.data.pokemon_v2_pokemon
    .map((p) => ({
      id: p.id,
      methods: [...new Set(p.pokemon_v2_pokemonmoves.map((m) => m.pokemon_v2_movelearnmethod.name))]
    }))
    .filter((p) => p.id >= 1 && p.id <= 1010)
    .sort((a, b) => a.id - b.id);
}

export async function fetchPokemonIdsByVersionGroup(versionGroup) {
  const query = `
    query getPokemonIdsByVersionGroup {
      pokemon_v2_pokemon(where: {
        pokemon_v2_pokemonmoves: {
          pokemon_v2_versiongroup: {
            _or: [
              { name: { _eq: "${versionGroup}" } },
              { pokemon_v2_versions: { name: { _eq: "${versionGroup}" } } }
            ]
          }
        }
      }) {
        id
      }
    }
  `;
  const res = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error(`Gagal mengambil versi: ${versionGroup}`);
  const json = await res.json();
  
  return json.data.pokemon_v2_pokemon
    .map((p) => p.id)
    .filter((id) => id >= 1 && id <= 1010)
    .sort((a, b) => a - b);
}
