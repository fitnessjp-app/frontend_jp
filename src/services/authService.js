import api from './api';

const unwrap = (res) => res.data;

const login = (credentials) => api.post('/auth/login', credentials).then(unwrap);
const me = () => api.get('/auth/me').then(unwrap);
const updateProfile = (payload) => api.put('/auth/profile', payload).then(unwrap);
const changePassword = (payload) => api.put('/auth/password', payload).then(unwrap);

// Owner only
const listAdmins = () => api.get('/auth/admins').then(unwrap);
const createAdmin = (payload) => api.post('/auth/admins', payload).then(unwrap);
const resetAdminPassword = (id, newPassword) => api.put(`/auth/admins/${id}/password`, { newPassword }).then(unwrap);
const deleteAdmin = (id) => api.delete(`/auth/admins/${id}`).then(unwrap);

export default { login, me, updateProfile, changePassword, listAdmins, createAdmin, resetAdminPassword, deleteAdmin };
