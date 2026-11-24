import { NavLink } from 'react-router-dom';
import { navItems } from './navItems.js';

// Phone-style tab bar — only visible below md.
const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-navy-900/95 backdrop-blur border-t border-navy-700 pb-safe">
    <ul className="grid grid-cols-5">
      {navItems.map(({ to, short, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`h-7 w-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-accent/15' : ''}`}>
                  <Icon size={20} />
                </span>
                {short}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default BottomNav;
