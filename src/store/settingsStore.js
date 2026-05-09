import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Menyimpan API key Groq milik user (BYOK) di localStorage
const useSettingsStore = create(
  persist(
    (set) => ({
      groqApiKey: '',
      setGroqApiKey: (key) => set({ groqApiKey: key }),
    }),
    { name: 'pokedex-settings' }
  )
);

export default useSettingsStore;
