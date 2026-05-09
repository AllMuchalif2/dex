import { NavLink } from 'react-router-dom';
import { FaList, FaUsers, FaRobot } from 'react-icons/fa6';

const TABS = [
  { path: '/',     label: 'Pokedex', Icon: FaList },
  { path: '/team', label: 'Tim',     Icon: FaUsers },
  { path: '/ai',   label: 'AI',      Icon: FaRobot },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-5 py-7 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <FaList size={15} className="text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900 leading-tight">Pokedex</p>
          <p className="text-xs text-gray-400 leading-tight">AI Edition</p>
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
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5">
        <p className="text-xs text-gray-300">PokeAPI + Groq AI</p>
      </div>
    </aside>
  );
}
