import { NavLink } from 'react-router-dom';
import { FaList, FaUsers, FaCompass, FaSun, FaMoon } from 'react-icons/fa6';
import useSettingsStore from '../store/settingsStore';

const TABS = [
  { path: '/',           label: 'Pokedex',   Icon: FaList },
  { path: '/team',       label: 'Tim',       Icon: FaUsers },
  { path: '/menu-baru',  label: 'Menu Baru', Icon: FaCompass },
];

export default function Sidebar() {
  const { isDark, toggleDarkMode } = useSettingsStore();

  return (
    <aside className="hidden md:flex flex-col w-56 fixed left-0 top-0 h-screen bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 z-40">
      {/* Logo */}
      <div className="px-5 py-7 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <FaList size={15} className="text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900 dark:text-zinc-100 leading-tight">Pokedex</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 leading-tight">AI Edition</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {TABS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            id={`sidebar-${label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:text-gray-700 dark:hover:text-zinc-200'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5 flex flex-col gap-3">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-between w-full p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-xs font-semibold cursor-pointer"
        >
          <span>Dark Mode</span>
          {isDark ? <FaSun size={14} className="text-amber-500" /> : <FaMoon size={14} className="text-indigo-500" />}
        </button>
        <p className="text-xs text-gray-300 dark:text-zinc-700">PokeAPI + Groq AI</p>
      </div>
    </aside>
  );
}
