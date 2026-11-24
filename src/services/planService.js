import api from './api';

const getPlans = () => api.get('/plans').then((res) => res.data);

const createPlan = (payload) => api.post('/plans', payload).then((res) => res.data);

const updatePlan = (id, payload) => api.put(`/plans/${id}`, payload).then((res) => res.data);

const deletePlan = (id) => api.delete(`/plans/${id}`).then((res) => res.data);

export default { getPlans, createPlan, updatePlan, deletePlan };
