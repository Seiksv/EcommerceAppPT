import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useFetch = <T>(
  fetchFunction: () => Promise<T>, 
  immediate = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setStatus('loading');
    try {
      const result = await fetchFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setStatus('error');
      throw err;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, status, error, refetch: execute };
};
