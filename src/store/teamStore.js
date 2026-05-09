import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Menyimpan tim aktif (maks 6 Pokemon) di localStorage
const useTeamStore = create(
  persist(
    (set, get) => ({
      team: [],

      addToTeam(pokemon) {
        const { team } = get();
        if (team.length >= 6) return false;
        if (team.find((p) => p.id === pokemon.id)) return false;
        set({ team: [...team, pokemon] });
        return true;
      },

      removeFromTeam(pokemonId) {
        set((s) => ({ team: s.team.filter((p) => p.id !== pokemonId) }));
      },

      clearTeam() {
        set({ team: [] });
      },
    }),
    { name: 'pokedex-team' }
  )
);

export default useTeamStore;
