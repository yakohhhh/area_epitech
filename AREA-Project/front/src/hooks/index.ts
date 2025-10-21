/**
 * Custom React hooks
 */

import { useState, useEffect } from 'react';

// Export email validation hook
export { useEmailValidation } from './useEmailValidation';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hook for managing async operations
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const [state, setState] = useState<LoadingState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setState('loading');
    setError(null);

    asyncFunction()
      .then(result => {
        setData(result);
        setState('success');
      })
      .catch(err => {
        setError(err);
        setState('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { state, data, error, isLoading: state === 'loading' };
};

/**
 * Hook for local storage
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

// Export hooks
export {
  usePasswordValidation,
  getPasswordStrength,
} from './usePasswordValidation';
