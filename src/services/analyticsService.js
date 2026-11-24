import api from './api';

const getOverview = () => api.get('/analytics/overview').then((res) => res.data);

const getRevenue = (range = '6m') => api.get('/analytics/revenue', { params: { range } }).then((res) => res.data);

const getRevenueByPlan = () => api.get('/analytics/revenue-by-plan').then((res) => res.data);

const getRecentAdmissions = (limit = 10) =>
  api.get('/analytics/recent-admissions', { params: { limit } }).then((res) => res.data);

export default { getOverview, getRevenue, getRevenueByPlan, getRecentAdmissions };
