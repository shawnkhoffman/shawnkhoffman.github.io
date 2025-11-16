import { ref, onMounted, onUnmounted } from 'vue';

export function useMediaQuery(query: string) {
  const matches = ref(false);

  const getMatches = (mediaQuery: string): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(mediaQuery).matches;
    }
    return false;
  };

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    matches.value = getMatches(query);
    const mediaQuery = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      matches.value = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange);
    });
  });

  return matches;
}
