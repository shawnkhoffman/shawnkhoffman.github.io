import { useState, useEffect } from 'react';

export const useFetch = <T>(fetchFunction: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, loading, error };
};