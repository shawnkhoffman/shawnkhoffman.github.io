import { ref, watch, onMounted, onUnmounted, provide, inject, type Ref } from 'vue';
import type { Theme } from '@/types/theme';

const THEME_KEY = Symbol('theme');

export function useThemeProvider() {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system');

  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appliedTheme = currentTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : currentTheme;
    
    root.setAttribute('data-theme', appliedTheme);
    
    root.classList.remove('light', 'dark');
    root.classList.add(appliedTheme);
    
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(appliedTheme);
  };

  // Apply theme on mount and when theme changes
  onMounted(() => {
    applyTheme(theme.value);
  });

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, { immediate: true });

  // Watch for system theme changes
  let mediaQuery: MediaQueryList | null = null;
  let handleChange: (() => void) | null = null;

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    handleChange = () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
  });

  onUnmounted(() => {
    if (mediaQuery && handleChange) {
      mediaQuery.removeEventListener('change', handleChange);
    }
  });

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
  };

  provide(THEME_KEY, {
    theme,
    setTheme,
  });

  return {
    theme,
    setTheme,
  };
}

export function useTheme() {
  const context = inject<{ theme: Ref<Theme>; setTheme: (theme: Theme) => void }>(THEME_KEY);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

