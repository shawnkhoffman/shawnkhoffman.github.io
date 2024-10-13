import { useState, useEffect } from 'react';

const getMatches = (query: string): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(query).matches;
  }
  return false;
};

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia(query);
      const listener = () => setMatches(media.matches);
      
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
}
