import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm.jsx';
import WelcomeSplash from '../components/auth/WelcomeSplash.jsx';
import useAuth from '../hooks/useAuth.js';
import { APP_NAME } from '../config';

const LoginPage = () => {
  const { isAuthenticated, loading, setSession } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(null); // login result waiting for the welcome animation

  const finish = useCallback(() => {
    if (!pending) return;
    setSession(pending);
    navigate('/dashboard', { replace: true });
  }, [pending, setSession, navigate]);

  // Already signed in (e.g. opened the installed app) -> straight to dashboard.
  if (!loading && isAuthenticated && !pending) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-navy-950 px-4 pt-safe pb-safe relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,122,26,0.12),transparent_55%)]" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/25 mb-4">
            <Dumbbell size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">{APP_NAME} Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your gym</p>
        </div>

        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <LoginForm onSuccess={setPending} />
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">Authorised staff only</p>
      </div>

      {pending && <WelcomeSplash name={pending.admin?.name} onDone={finish} />}
    </div>
  );
};

export default LoginPage;
