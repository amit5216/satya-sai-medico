/**
 * ============================================================
 * useDataFetch — Generic data fetching hook
 * ============================================================
 *
 * 🎓 WHY A CUSTOM HOOK FOR DATA FETCHING?
 * Every admin page repeats the same pattern:
 *   const [data, setData] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   useEffect(() => { fetch... }, []);
 *
 * This hook encapsulates that pattern:
 *   const { data, loading, error, refetch } = useDataFetch('/admin/doctors');
 *
 * Benefits:
 * - DRY: Define fetch logic once
 * - Consistent error handling
 * - Easy refetch after mutations
 *
 * 🎓 INTERVIEW: "Why extract a custom hook?"
 * → "Following Separation of Concerns — the component handles
 *    rendering, the hook handles data lifecycle. This makes both
 *    easier to test and reuse. It's the same pattern as React
 *    Query's useQuery but simpler for our needs."
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function useDataFetch(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
}

export { useDataFetch };
