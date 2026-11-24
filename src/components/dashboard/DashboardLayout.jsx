import { Outlet, useLocation } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import useAuth from '../../hooks/useAuth.js';
import { APP_NAME } from '../../config';

const DashboardLayout = () => {
  const { admin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen min-h-[100dvh] flex bg-navy-950 text-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 bg-navy-900/95 backdrop-blur border-b border-navy-700 pt-safe">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Dumbbell size={16} className="text-white" />
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 max-w-[120px] truncate">{admin?.name}</span>
              <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-sm">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* key re-triggers the fade when the page changes */}
        <main key={location.pathname} className="flex-1 p-4 md:p-8 pb-28 md:pb-8 animate-fade-in max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
