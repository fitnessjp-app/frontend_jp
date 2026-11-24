import { useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { APP_NAME } from '../../config';

// Full-screen greeting shown right after a successful login, then hands over to the dashboard.
const WelcomeSplash = ({ name, onDone, duration = 2600 }) => {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  const first = (name || 'Admin').trim().split(' ')[0];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,122,26,0.18),transparent_60%)]" />

      <div className="relative h-24 w-24 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-accent/60 animate-ring" />
        <span className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ring [animation-delay:0.6s]" />
        <div className="relative h-20 w-20 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30 animate-pop">
          <Dumbbell size={36} className="text-white" />
        </div>
      </div>

      <p className="relative mt-8 text-gray-400 text-sm tracking-widest uppercase animate-fade-up [animation-delay:0.4s]">
        Welcome back
      </p>
      <h1 className="relative mt-2 text-4xl sm:text-5xl font-extrabold text-white animate-fade-up [animation-delay:0.6s]">
        {first}<span className="text-accent">.</span>
      </h1>
      <p className="relative mt-3 text-gray-500 text-sm animate-fade-up [animation-delay:0.9s]">
        Opening your {APP_NAME} dashboard…
      </p>

      <div className="relative mt-8 h-1 w-48 rounded-full bg-navy-700 overflow-hidden">
        <div className="h-full bg-accent rounded-full animate-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
};

export default WelcomeSplash;
