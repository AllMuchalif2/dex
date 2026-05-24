import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FaRobot } from 'react-icons/fa6';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import PokedexPage from './pages/PokedexPage';
import DetailPage from './pages/DetailPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import AIChatPage from './pages/AIChatPage';
import EmptyPage from './pages/EmptyPage';
import useSettingsStore from './store/settingsStore';

export default function App() {
  const { isDark } = useSettingsStore();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex min-h-svh bg-neutral-bg w-full">
      <Sidebar />

      {/* Area konten utama */}
      <div className="flex-1 min-w-0 md:ml-56 flex flex-col">
        {/* Mobile: container 430px centered. Desktop: full width */}
        <div className="w-full max-w-[430px] mx-auto md:max-w-none flex flex-col min-h-svh">
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<PokedexPage />} />
              <Route path="/pokemon/:id" element={<DetailPage />} />
              <Route path="/team" element={<TeamBuilderPage />} />
              <Route path="/menu-baru" element={<EmptyPage />} />
              <Route path="/ai" element={<AIChatPage />} />
            </Routes>
          </main>

          {/* Bottom nav — hanya tampil di mobile */}
          <BottomNav />
        </div>
      </div>

      {/* Floating AI Button */}
      {location.pathname !== '/ai' && !location.pathname.startsWith('/pokemon/') && (
        <Link
          to="/ai"
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all z-50 hover:scale-105 active:scale-95"
          title="Tanya AI Advisor"
        >
          <FaRobot size={24} />
        </Link>
      )}

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
