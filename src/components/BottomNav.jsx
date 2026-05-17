import { useLocation, useNavigate } from 'react-router-dom';
import { FaList, FaUsers, FaRobot } from 'react-icons/fa6';

const TABS = [
  { path: '/',      label: 'Pokedex',  Icon: FaList },
  { path: '/team',  label: 'Tim',      Icon: FaUsers },
  { path: '/ai',    label: 'AI',       Icon: FaRobot },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/pokemon/')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 flex z-50">
      {TABS.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            id={`nav-${label.toLowerCase()}`}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors cursor-pointer ${
              active ? 'text-primary' : 'text-gray-400 dark:text-zinc-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
