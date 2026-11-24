import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, KeyRound, Users, Smartphone, LogOut, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import usePWAInstall from '../hooks/usePWAInstall.js';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import PasswordForm from '../components/profile/PasswordForm.jsx';
import AdminsManager from '../components/profile/AdminsManager.jsx';
import Button from '../components/common/Button.jsx';

const AppInstall = () => {
  const { canInstall, install, installed, isIOS } = usePWAInstall();

  return (
    <div className="max-w-lg space-y-4">
      {installed ? (
        <p className="text-sm text-emerald-400">✓ App is installed on this device.</p>
      ) : canInstall ? (
        <>
          <p className="text-sm text-gray-400">Install this panel as an app: it opens full-screen from your home screen, like a normal app.</p>
          <Button variant="primary" onClick={install}><Download size={16} /> Install app</Button>
        </>
      ) : isIOS ? (
        <p className="text-sm text-gray-400">
          On iPhone/iPad: open this site in <b className="text-white">Safari</b>, tap the <b className="text-white">Share</b> button, then
          <b className="text-white"> Add to Home Screen</b>.
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          On Android: open the browser menu (⋮) and tap <b className="text-white">Install app</b> / <b className="text-white">Add to Home screen</b>.
          On desktop Chrome/Edge: click the install icon in the address bar.
        </p>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { admin, isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(null); // null = phone menu is showing

  const items = [
    { id: 'profile', label: 'Edit profile', hint: 'Name and username', icon: User },
    { id: 'password', label: 'Change password', hint: 'Keep your account safe', icon: KeyRound },
    ...(isOwner ? [{ id: 'admins', label: 'Manage admins', hint: 'Add, remove, reset passwords', icon: Users }] : []),
    { id: 'app', label: 'Install app', hint: 'Add to home screen', icon: Smartphone },
  ];
  const active = tab || 'profile'; // desktop always shows one section
  const current = items.find((i) => i.id === active);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <div>
      {/* Header card (hidden on phones while a section is open) */}
      <div className={`flex items-center gap-4 mb-6 ${tab ? 'hidden md:flex' : ''}`}>
        <div className="h-14 w-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xl shrink-0">
          {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white truncate">{admin?.name}</h1>
          <p className="text-gray-500 text-sm">@{admin?.username} · <span className="capitalize">{admin?.role}</span></p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="hidden md:inline-flex shrink-0"><LogOut size={16} /> Logout</Button>
      </div>

      {/* Phone: menu list */}
      {!tab && (
        <div className="md:hidden space-y-3">
          {items.map(({ id, label, hint, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="w-full flex items-center gap-4 bg-navy-800 border border-navy-700 rounded-2xl p-4 text-left active:scale-[0.99] transition-transform"
            >
              <span className="h-11 w-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0"><Icon size={20} /></span>
              <span className="flex-1 min-w-0">
                <span className="block text-white font-medium">{label}</span>
                <span className="block text-xs text-gray-500">{hint}</span>
              </span>
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 bg-navy-800 border border-red-500/30 rounded-2xl p-4 text-left"
          >
            <span className="h-11 w-11 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0"><LogOut size={20} /></span>
            <span className="text-red-400 font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Desktop: tabs */}
      <div className="hidden md:flex gap-2 mb-6 flex-wrap">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
              active === id ? 'bg-accent text-white border-accent' : 'bg-navy-800 border-navy-700 text-gray-300 hover:border-navy-600'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className={tab ? '' : 'hidden md:block'}>
        {tab && (
          <button onClick={() => setTab(null)} className="md:hidden inline-flex items-center gap-1 text-sm text-gray-400 mb-4">
            <ChevronLeft size={18} /> Back
          </button>
        )}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 sm:p-6">
          <h2 className="md:hidden text-white font-semibold text-lg mb-4">{current?.label}</h2>
          {active === 'profile' && <ProfileForm />}
          {active === 'password' && <PasswordForm />}
          {active === 'admins' && isOwner && <AdminsManager />}
          {active === 'app' && <AppInstall />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
