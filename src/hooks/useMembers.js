import { useState, useEffect, useCallback } from 'react';
import memberService from '../services/memberService';

const useMembers = (params) => {
  const [data, setData] = useState({ members: [], total: 0, page: 1, pages: 1, counts: { all: 0, active: 0, expiring: 0, expired: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await memberService.getMembers(params);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { ...data, loading, error, refetch: fetchMembers };
};

export default useMembers;
