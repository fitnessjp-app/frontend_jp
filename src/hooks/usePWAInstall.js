import { useEffect, useState } from 'react';

// Wraps the browser "install app" prompt (Chrome / Edge / Android).
// iOS Safari has no prompt — the Profile page shows "Add to Home Screen" steps instead.
const usePWAInstall = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(
    window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
  );

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return { canInstall: !!promptEvent, install, installed, isIOS };
};

export default usePWAInstall;
