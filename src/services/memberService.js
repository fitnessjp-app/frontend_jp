import api from './api';

const getMembers = (params) => api.get('/members', { params }).then((res) => res.data);

const getMemberById = (id) => api.get(`/members/${id}`).then((res) => res.data);

const createMember = (formData) =>
  api
    .post('/members', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

const updateMember = (id, formData) =>
  api
    .put(`/members/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

const renewMember = (id, payload) => api.put(`/members/${id}/renew`, payload).then((res) => res.data);

const deleteMember = (id) => api.delete(`/members/${id}`).then((res) => res.data);

export default { getMembers, getMemberById, createMember, updateMember, renewMember, deleteMember };
