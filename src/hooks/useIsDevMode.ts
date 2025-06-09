import { useMemo } from 'react';

export const useIsDevMode = (): boolean => {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('.local')
    );
  }, []);
};
