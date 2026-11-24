import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'fitzone_token';
const ADMIN_KEY = 'fitzone_admin';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  }, []);

  // On app start: restore the session, then confirm with the server that the token + admin still exist.
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_KEY);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
      setToken(storedToken);
    } catch {
      clear();
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((res) => {
        setAdmin(res.admin);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(res.admin));
      })
      .catch((err) => {
        // Only a real 401 logs out; being offline keeps the cached session so the app still opens.
        if (err.response?.status === 401) clear();
      })
      .finally(() => setLoading(false));
  }, [clear]);

  // Step 1: check credentials. Does NOT sign in yet, so the login page can play the welcome animation first.
  const login = (credentials) => authService.login(credentials);

  // Step 2: actually start the session.
  const setSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
  };

  // Called after profile edits / password change.
  const updateSession = ({ admin: nextAdmin, token: nextToken }) => {
    if (nextAdmin) {
      setAdmin(nextAdmin);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(nextAdmin));
    }
    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem(TOKEN_KEY, nextToken);
    }
  };

  const value = {
    admin,
    token,
    isAuthenticated: !!token,
    isOwner: admin?.role === 'owner',
    loading,
    login,
    setSession,
    updateSession,
    logout: clear,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
