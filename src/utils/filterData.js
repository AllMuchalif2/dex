export const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const GENERATIONS = [
  { id: 1, label: 'Gen I',   range: [1, 151] },
  { id: 2, label: 'Gen II',  range: [152, 251] },
  { id: 3, label: 'Gen III', range: [252, 386] },
  { id: 4, label: 'Gen IV',  range: [387, 493] },
  { id: 5, label: 'Gen V',   range: [494, 649] },
  { id: 6, label: 'Gen VI',  range: [650, 721] },
  { id: 7, label: 'Gen VII', range: [722, 809] },
  { id: 8, label: 'Gen VIII',range: [810, 905] },
  { id: 9, label: 'Gen IX',  range: [906, 1010] },
];

export const REGIONS = [
  { id: 1, label: 'Kanto' },
  { id: 2, label: 'Johto' },
  { id: 3, label: 'Hoenn' },
  { id: 4, label: 'Sinnoh' },
  { id: 5, label: 'Unova' },
  { id: 6, label: 'Kalos' },
  { id: 7, label: 'Alola' },
  { id: 8, label: 'Galar' },
  { id: 9, label: 'Paldea' },
];

// genId = ID range yang dipakai saat filter
export const GAMES = [
  { id: 'rby',  label: 'Red / Blue / Yellow',        genId: 1 },
  { id: 'gsc',  label: 'Gold / Silver / Crystal',    genId: 2 },
  { id: 'rse',  label: 'Ruby / Sapphire / Emerald',  genId: 3 },
  { id: 'frlg', label: 'FireRed / LeafGreen',        genId: 1 },
  { id: 'dppt', label: 'Diamond / Pearl / Platinum', genId: 4 },
  { id: 'hgss', label: 'HeartGold / SoulSilver',     genId: 2 },
  { id: 'bw',   label: 'Black / White',              genId: 5 },
  { id: 'bw2',  label: 'Black 2 / White 2',          genId: 5 },
  { id: 'xy',   label: 'X / Y',                      genId: 6 },
  { id: 'oras', label: 'Omega Ruby / Alpha Sapphire',genId: 3 },
  { id: 'sm',   label: 'Sun / Moon',                 genId: 7 },
  { id: 'usum', label: 'Ultra Sun / Ultra Moon',     genId: 7 },
  { id: 'swsh', label: 'Sword / Shield',             genId: 8 },
  { id: 'sv',   label: 'Scarlet / Violet',           genId: 9 },
];
