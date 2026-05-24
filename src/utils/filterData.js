// Range ID per generasi (PokeAPI format)
export const GEN_RANGES = {
  'generation-i':    [1, 151],
  'generation-ii':   [152, 251],
  'generation-iii':  [252, 386],
  'generation-iv':   [387, 493],
  'generation-v':    [494, 649],
  'generation-vi':   [650, 721],
  'generation-vii':  [722, 809],
  'generation-viii': [810, 905],
  'generation-ix':   [906, 1010],
};

// Mapping versi game → nama generasi PokeAPI
export const VERSION_TO_GEN = {
  red: 'generation-i', blue: 'generation-i', yellow: 'generation-i', 'red-blue': 'generation-i',
  gold: 'generation-ii', silver: 'generation-ii', crystal: 'generation-ii', 'gold-silver': 'generation-ii',
  ruby: 'generation-iii', sapphire: 'generation-iii', emerald: 'generation-iii', 'ruby-sapphire': 'generation-iii',
  firered: 'generation-i', leafgreen: 'generation-i', 'firered-leafgreen': 'generation-i',
  diamond: 'generation-iv', pearl: 'generation-iv', platinum: 'generation-iv', 'diamond-pearl': 'generation-iv',
  heartgold: 'generation-ii', soulsilver: 'generation-ii', 'heartgold-soulsilver': 'generation-ii',
  black: 'generation-v', white: 'generation-v', 'black-white': 'generation-v',
  'black-2': 'generation-v', 'white-2': 'generation-v', 'black-2-white-2': 'generation-v',
  x: 'generation-vi', y: 'generation-vi', 'x-y': 'generation-vi',
  'omega-ruby': 'generation-iii', 'alpha-sapphire': 'generation-iii', 'omega-ruby-alpha-sapphire': 'generation-iii',
  sun: 'generation-vii', moon: 'generation-vii', 'sun-moon': 'generation-vii',
  'ultra-sun': 'generation-vii', 'ultra-moon': 'generation-vii', 'ultra-sun-ultra-moon': 'generation-vii',
  sword: 'generation-viii', shield: 'generation-viii', 'sword-shield': 'generation-viii',
  scarlet: 'generation-ix', violet: 'generation-ix', 'scarlet-violet': 'generation-ix',
};

export const GAME_VERSIONS = [
  { value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }, { value: 'yellow', label: 'Yellow' },
  { value: 'gold', label: 'Gold' }, { value: 'silver', label: 'Silver' }, { value: 'crystal', label: 'Crystal' },
  { value: 'ruby', label: 'Ruby' }, { value: 'sapphire', label: 'Sapphire' }, { value: 'emerald', label: 'Emerald' },
  { value: 'firered', label: 'FireRed' }, { value: 'leafgreen', label: 'LeafGreen' },
  { value: 'diamond', label: 'Diamond' }, { value: 'pearl', label: 'Pearl' }, { value: 'platinum', label: 'Platinum' },
  { value: 'heartgold', label: 'HeartGold' }, { value: 'soulsilver', label: 'SoulSilver' },
  { value: 'black', label: 'Black' }, { value: 'white', label: 'White' },
  { value: 'black-2', label: 'Black 2' }, { value: 'white-2', label: 'White 2' },
  { value: 'x', label: 'X' }, { value: 'y', label: 'Y' },
  { value: 'omega-ruby', label: 'Omega Ruby' }, { value: 'alpha-sapphire', label: 'Alpha Sapphire' },
  { value: 'sun', label: 'Sun' }, { value: 'moon', label: 'Moon' },
  { value: 'ultra-sun', label: 'Ultra Sun' }, { value: 'ultra-moon', label: 'Ultra Moon' },
  { value: 'sword', label: 'Sword' }, { value: 'shield', label: 'Shield' },
  { value: 'scarlet', label: 'Scarlet' }, { value: 'violet', label: 'Violet' },
];

export const GEN_OPTIONS = [
  { value: 'generation-i',    label: 'Generation I' },
  { value: 'generation-ii',   label: 'Generation II' },
  { value: 'generation-iii',  label: 'Generation III' },
  { value: 'generation-iv',   label: 'Generation IV' },
  { value: 'generation-v',    label: 'Generation V' },
  { value: 'generation-vi',   label: 'Generation VI' },
  { value: 'generation-vii',  label: 'Generation VII' },
  { value: 'generation-viii', label: 'Generation VIII' },
  { value: 'generation-ix',   label: 'Generation IX' },
];

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
