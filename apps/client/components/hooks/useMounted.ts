import { useCallback, useEffect, useRef } from 'react';

function useIsMounted() {
  const isMounted = useRef(false); // unmounted by default

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isMounted.current = false;
    }

    return () => {
      isMounted.current = true; // unmounted
    };
  }, []); // run once on mount

  return useCallback(() => isMounted.current, []); // return function that checks mounted status
}

export default useIsMounted;
