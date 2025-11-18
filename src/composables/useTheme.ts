import { ref, watch, onMounted, provide, inject, type Ref } from 'vue';
import type { Theme } from '@/types/theme';

const THEME_KEY = Symbol('theme');

export function useThemeProvider() {
  // TEMPORARY: Light mode disabled - always use dark mode
  // TODO: Re-enable light mode by restoring: ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')
  const theme = ref<Theme>('dark');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    // TEMPORARY: Light mode disabled - always apply dark theme
    // TODO: Restore theme selection logic: const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // TODO: Restore: const appliedTheme = currentTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : currentTheme;
    const appliedTheme = 'dark';

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
    // TEMPORARY: Light mode disabled - localStorage saving removed
    // TODO: Re-enable: localStorage.setItem('theme', newTheme);
  }, { immediate: true });

  // TEMPORARY: Light mode disabled - system theme watching removed
  // TODO: Re-enable system theme watching with media query listener


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTheme = (newTheme: Theme) => {
    // TEMPORARY: Light mode disabled - always set to dark
    // TODO: Re-enable: theme.value = newTheme;
    theme.value = 'dark';
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
