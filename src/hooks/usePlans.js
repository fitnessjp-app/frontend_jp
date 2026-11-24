import { useState, useEffect, useCallback } from 'react';
import planService from '../services/planService';

const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await planService.getPlans();
      setPlans(res.plans || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
};

export default usePlans;
