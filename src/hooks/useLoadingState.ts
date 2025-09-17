import { useState, useCallback } from 'react';

/**
 * A hook to manage loading state for API calls
 * 
 * @returns {Object} An object containing loading state and helpers
 */
export const useLoadingState = <T extends (...args: any[]) => Promise<any>>(
  asyncFn: T
): {
  isLoading: boolean;
  error: Error | null;
  execute: (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn]
  );

  return { isLoading, error, execute };
};

export default useLoadingState;