import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import PokedexPage from './pages/PokedexPage';
import DetailPage from './pages/DetailPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import AIChatPage from './pages/AIChatPage';
import useSettingsStore from './store/settingsStore';

export default function App() {
  const { isDark } = useSettingsStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex min-h-svh bg-neutral-bg">
      <Sidebar />

      {/* Area konten utama */}
      <div className="flex-1 md:ml-56 flex flex-col">
        {/* Mobile: container 430px centered. Desktop: full width */}
        <div className="w-full max-w-[430px] mx-auto md:max-w-none flex flex-col min-h-svh">
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<PokedexPage />} />
              <Route path="/pokemon/:id" element={<DetailPage />} />
              <Route path="/team" element={<TeamBuilderPage />} />
              <Route path="/ai" element={<AIChatPage />} />
            </Routes>
          </main>

          {/* Bottom nav — hanya tampil di mobile */}
          <BottomNav />
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '12px', maxWidth: '320px' },
          duration: 2500,
        }}
      />
    </div>
  );
}
