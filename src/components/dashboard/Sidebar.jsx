import { NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { navItems } from './navItems.js';
import { APP_NAME } from '../../config';

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="h-screen sticky top-0 w-64 bg-navy-900 border-r border-navy-700 flex flex-col">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-navy-700">
        <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
          <Dumbbell size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <span className="text-lg font-bold tracking-tight block">{APP_NAME}</span>
          <span className="text-[11px] text-gray-500">Admin panel</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-gray-400 border border-transparent hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-navy-700">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-sm">
            {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{admin?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{admin?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-navy-800"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
