import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/BottomNav';
import PokedexPage from './pages/PokedexPage';
import DetailPage from './pages/DetailPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import AIChatPage from './pages/AIChatPage';

export default function App() {
  return (
    <div className="relative mx-auto bg-neutral-bg min-h-svh w-full max-w-[430px] flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/pokemon/:id" element={<DetailPage />} />
          <Route path="/team" element={<TeamBuilderPage />} />
          <Route path="/ai" element={<AIChatPage />} />
        </Routes>
      </main>

      <BottomNav />

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
