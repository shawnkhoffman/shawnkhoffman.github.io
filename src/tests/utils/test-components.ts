/**
 * Vue components for testing
 */

import { defineComponent, ref, provide } from 'vue';
import type { Theme } from '@/types/theme';

const THEME_KEY = Symbol('theme');

/**
 * Theme provider wrapper for tests
 */
export const TestThemeProvider = defineComponent({
  name: 'TestThemeProvider',
  props: {
    initialTheme: {
      type: String as () => Theme,
      default: 'light' as Theme,
    },
  },
  setup(props, { slots }) {
    const theme = ref<Theme>(props.initialTheme);

    const setTheme = (newTheme: Theme) => {
      theme.value = newTheme;
    };

    provide(THEME_KEY, {
      theme,
      setTheme,
    });

    return () => slots.default?.();
  },
});

