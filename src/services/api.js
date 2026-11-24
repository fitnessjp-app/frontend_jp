import axios from 'axios';

// Single Axios instance — every API call goes through this.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitzone_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Invalid / expired token (or password changed elsewhere) -> back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem('fitzone_token');
      localStorage.removeItem('fitzone_admin');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
