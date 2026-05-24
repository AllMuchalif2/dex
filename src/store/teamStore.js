import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => Math.random().toString(36).substr(2, 9);

const useTeamStore = create(
  persist(
    (set, get) => ({
      teams: [
        {
          id: 'default',
          name: 'Tim Utama',
          gameVersion: null,
          pokemonList: [],
        },
      ],
      activeTeamId: 'default',

      getActiveTeam() {
        const { teams, activeTeamId } = get();
        return teams.find((t) => t.id === activeTeamId) || teams[0];
      },

      addTeam(name, gameVersion) {
        const id = generateId();
        set((s) => ({
          teams: [
            ...s.teams,
            {
              id,
              name: name || `Tim ${s.teams.length + 1}`,
              gameVersion: gameVersion || null,
              pokemonList: [],
            },
          ],
          activeTeamId: id,
        }));
      },

      removeTeam(id) {
        set((s) => {
          const newTeams = s.teams.filter((t) => t.id !== id);
          if (newTeams.length === 0) {
            const newId = generateId();
            return {
              teams: [
                {
                  id: newId,
                  name: 'Tim Utama',
                  gameVersion: null,
                  pokemonList: [],
                },
              ],
              activeTeamId: newId,
            };
          }
          return {
            teams: newTeams,
            activeTeamId:
              s.activeTeamId === id ? newTeams[0].id : s.activeTeamId,
          };
        });
      },

      setActiveTeam(id) {
        set({ activeTeamId: id });
      },

      updateTeam(id, updates) {
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      addToTeam(pokemon, teamId) {
        const { getActiveTeam, teams } = get();
        const targetTeam = teamId ? teams.find(t => t.id === teamId) : getActiveTeam();

        if (!targetTeam || targetTeam.pokemonList.length >= 6) return false;
        if (targetTeam.pokemonList.find((p) => p.id === pokemon.id))
          return false;

        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === targetTeam.id
              ? { ...t, pokemonList: [...t.pokemonList, pokemon] }
              : t,
          ),
        }));
        return true;
      },

      removeFromTeam(pokemonId) {
        const { getActiveTeam } = get();
        const activeTeam = getActiveTeam();

        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === activeTeam.id
              ? {
                  ...t,
                  pokemonList: t.pokemonList.filter((p) => p.id !== pokemonId),
                }
              : t,
          ),
        }));
      },

      clearTeam() {
        const { getActiveTeam } = get();
        const activeTeam = getActiveTeam();

        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === activeTeam.id ? { ...t, pokemonList: [] } : t,
          ),
        }));
      },
    }),
    {
      name: 'pokedex-team-v2',
    },
  ),
);

export default useTeamStore;
