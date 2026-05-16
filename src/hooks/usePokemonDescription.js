import { usePokemonSpecies } from './usePokemonDetail';

// Hook deskripsi Pokemon berdasarkan versi game yang dipilih
export function usePokemonDescription(pokemonId, selectedGameVersion) {
  const { data: species, isLoading, isError } = usePokemonSpecies(pokemonId);

  if (!species) return { description: '', isLoading, isError };

  const enEntries = species.flavor_text_entries.filter(
    (e) => e.language.name === 'en',
  );

  let description = '';
  let versionName = '';

  if (selectedGameVersion) {
    const match = enEntries.find((e) => e.version.name === selectedGameVersion);
    if (match) {
      description = match.flavor_text;
      versionName = match.version.name;
    }
  }

  if (!description && enEntries.length > 0) {
    const fallback = enEntries[enEntries.length - 1];
    description = fallback.flavor_text;
    versionName = fallback.version.name;
  }

  return {
    description: description.replace(/\f/g, ' ').trim(),
    versionName,
    isLoading,
    isError,
  };
}
