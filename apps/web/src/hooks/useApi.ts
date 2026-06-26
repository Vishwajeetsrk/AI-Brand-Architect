import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev: UseApiState<T>) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: (error as Error).message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { ...state, refetch };
}

export function useMutation<T, R = void>(
  mutator: (data: T) => Promise<R>
) {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: string | null;
    data: R | null;
  }>({ isLoading: false, error: null, data: null });

  const mutate = useCallback(async (data: T) => {
    setState({ isLoading: true, error: null, data: null });
    try {
      const result = await mutator(data);
      setState({ isLoading: false, error: null, data: result });
      return result;
    } catch (error) {
      setState({ isLoading: false, error: (error as Error).message, data: null });
      throw error;
    }
  }, [mutator]);

  return { ...state, mutate };
}
