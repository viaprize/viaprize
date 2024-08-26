import { useCallback, useEffect, useRef } from 'react';

function useIsMounted() {
  const isMounted = useRef(false); // unmounted by default

  useEffect(() => {
    isMounted.current = true; // mounted

    return () => {
      isMounted.current = false; // unmounted
    };
  }, []); // run once on mount

  return useCallback(() => isMounted.current, []); // return function that checks mounted status
}

export default useIsMounted;
