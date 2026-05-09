export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatName(name) {
  return name.split('-').map(capitalize).join(' ');
}

export function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`;
}

export function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`;
}

export function getIdFromUrl(url) {
  return parseInt(url.split('/').filter(Boolean).pop());
}

export function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.ATK',
  'special-defense': 'Sp.DEF',
  speed: 'SPD',
};
