import { useState, useEffect } from 'react';
import type { Result } from '../models/Result';

interface UseFetchReturn<T> {
  data: T;
  loading: boolean;
  error: string | undefined;
}

export const useFetch = <T>(
  fetcher: () => Promise<Result<T>>,
  defaultValue: T,
  deps: React.DependencyList
): UseFetchReturn<T> => {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    const execute = async (): Promise<void> => {
      setLoading(true);
      setError(undefined);
      const result = await fetcher();
      if (cancelled) return;
      if (result.ok) {
        setData(result.data);
      } else {
        setError(result.error.message);
      }
      setLoading(false);
    };

    execute().catch(() => { /* handled inside */ });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
};
