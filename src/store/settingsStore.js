import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      groqApiKey: '',
      isDark: false,
      setGroqApiKey: (key) => set({ groqApiKey: key }),
      toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'pokedex-settings' }
  )
);

export default useSettingsStore;
