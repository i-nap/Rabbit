// src/hooks/use-media-query.ts
import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const updateMatches = () => setMatches(mediaQueryList.matches);

    // Initial check
    updateMatches();

    // Add event listener
    mediaQueryList.addEventListener('change', updateMatches);

    // Cleanup on unmount
    return () => mediaQueryList.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

export { useMediaQuery };
