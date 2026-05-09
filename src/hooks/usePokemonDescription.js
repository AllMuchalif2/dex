import { usePokemonSpecies } from './usePokemonDetail';

// Hook deskripsi Pokemon berdasarkan versi game yang dipilih
export function usePokemonDescription(pokemonId, selectedGameVersion) {
  const { data: species, isLoading, isError } = usePokemonSpecies(pokemonId);

  if (!species) return { description: '', isLoading, isError };

  const enEntries = species.flavor_text_entries.filter((e) => e.language.name === 'en');

  let description = '';

  if (selectedGameVersion) {
    const match = enEntries.find((e) => e.version.name === selectedGameVersion);
    description = match?.flavor_text ?? '';
  }

  // Fallback ke entry terakhir jika versi tidak tersedia
  if (!description && enEntries.length > 0) {
    description = enEntries[enEntries.length - 1]?.flavor_text ?? '';
  }

  return {
    description: description.replace(/\f/g, ' ').trim(),
    isLoading,
    isError,
  };
}
