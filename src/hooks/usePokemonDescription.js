import { usePokemonSpecies } from './usePokemonDetail';

export function usePokemonDescription(pokemonId, selectedGameVersion) {
  const { data: species, isLoading, isError } = usePokemonSpecies(pokemonId);

  if (!species) return { description: '', isLoading, isError };

  const enEntries = species.flavor_text_entries.filter(
    (e) => e.language.name === 'en',
  );

  let description = '';
  let versionName = '';

  if (selectedGameVersion) {
    const allowedVersions = selectedGameVersion.split('-');
    const match = enEntries.find((e) => allowedVersions.includes(e.version.name));
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
    description: description.replace(/[\n\f]/g, ' ').trim(),
    versionName,
    isLoading,
    isError,
  };
}
