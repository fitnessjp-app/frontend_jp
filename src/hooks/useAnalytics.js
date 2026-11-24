import { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';

// Fetches all analytics widgets independently via Promise.allSettled so one
// slow/failed request never blocks the rest of the dashboard from rendering.
const useAnalytics = () => {
  const [overview, setOverview] = useState({ data: null, loading: true, error: null });
  const [revenue, setRevenue] = useState({ data: null, loading: true, error: null });
  const [revenueByPlan, setRevenueByPlan] = useState({ data: null, loading: true, error: null });
  const [recentAdmissions, setRecentAdmissions] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    analyticsService
      .getOverview()
      .then((res) => setOverview({ data: res, loading: false, error: null }))
      .catch((err) => setOverview({ data: null, loading: false, error: err.message }));

    analyticsService
      .getRevenue('6m')
      .then((res) => setRevenue({ data: res.revenue, loading: false, error: null }))
      .catch((err) => setRevenue({ data: null, loading: false, error: err.message }));

    analyticsService
      .getRevenueByPlan()
      .then((res) => setRevenueByPlan({ data: res.revenueByPlan, loading: false, error: null }))
      .catch((err) => setRevenueByPlan({ data: null, loading: false, error: err.message }));

    analyticsService
      .getRecentAdmissions(10)
      .then((res) => setRecentAdmissions({ data: res.members, loading: false, error: null }))
      .catch((err) => setRecentAdmissions({ data: null, loading: false, error: err.message }));
  }, []);

  return { overview, revenue, revenueByPlan, recentAdmissions };
};

export default useAnalytics;
