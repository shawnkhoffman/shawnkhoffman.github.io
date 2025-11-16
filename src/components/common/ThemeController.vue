<template>
  <button :class="`
      inline-flex items-center justify-center rounded-full
      hover:bg-base-200 focus:outline-none focus:ring-2
      focus:ring-offset-2 focus:ring-info
      ${buttonSize}
      ${className}
    `" @click="handleThemeChange" @keydown="handleKeyDown"
    :aria-label="`Switch theme to ${getNextTheme(theme) as string} mode`"
    :title="showTooltip ? THEME_LABELS[theme] : undefined" data-theme-controller :data-theme-changed="themeChanged"
    role="switch" :aria-checked="theme === 'dark'" :data-testid="`theme-switch-${theme}`">
    <div class="flex items-center justify-center relative">
      <Icon v-if="theme === 'light'" icon="fa6-solid:sun"
        :class="`text-base-content ${iconSize} ${baseClasses} ${animationClass}`" aria-hidden="true" />
      <Icon v-else-if="theme === 'dark'" icon="fa6-solid:moon"
        :class="`text-base-content ${iconSize} ${baseClasses} ${animationClass}`" aria-hidden="true" />
      <Icon v-else-if="theme === 'system'" :icon="deviceIcon"
        :class="`text-info ${iconSize} ${baseClasses} ${animationClass}`" aria-hidden="true" />
      <span v-if="showLabel" :class="`text-sm font-medium ${labelPosition === 'left' ? 'ml-2' : 'mr-2'
        }`">
        Theme
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useTheme } from '@/composables/useTheme';
import { useMediaQuery } from '@/composables/useMediaQuery';
import type { Theme } from '@/types/theme';

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface ThemeControllerProps {
  showLabel?: boolean;
  className?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<ThemeControllerProps>(), {
  showLabel: false,
  className: '',
  labelPosition: 'right',
  size: 'md',
  showTooltip: true,
  animated: true,
});

const THEME_ORDER: Theme[] = ['light', 'dark', 'system'];

const DEVICE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

const ICON_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const BUTTON_SIZES = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
} as const;

const ANIMATION_CLASSES = {
  light: 'animate-rotate-sun',
  dark: 'animate-rotate-moon',
  system: '',
} as const;

const THEME_LABELS = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
} as const;

const DEVICE_ICONS = {
  mobile: 'fa6-solid:mobile-screen',
  tablet: 'fa6-solid:tablet-screen',
  desktop: 'fa6-solid:desktop',
} as const;

const { theme, setTheme } = useTheme();
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
const isMobile = useMediaQuery(`(max-width: ${DEVICE_BREAKPOINTS.mobile}px)`);
const isTablet = useMediaQuery(`(max-width: ${DEVICE_BREAKPOINTS.tablet}px)`);
const themeChanged = ref(false);

const deviceType = computed((): DeviceType => {
  if (isMobile.value) return 'mobile';
  if (isTablet.value) return 'tablet';
  return 'desktop';
});

const iconSize = computed(() => ICON_SIZES[props.size]);
const buttonSize = computed(() => BUTTON_SIZES[props.size]);

const shouldAnimate = computed(
  () => props.animated && !prefersReducedMotion.value
);

const getNextTheme = (currentTheme: Theme): Theme => {
  const currentIndex = THEME_ORDER.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  return THEME_ORDER[nextIndex];
};

const deviceIcon = computed(() => DEVICE_ICONS[deviceType.value]);

const baseClasses = 'transition-transform duration-200';
const animationClass = computed(() => {
  if (!shouldAnimate.value) return '';
  return ANIMATION_CLASSES[theme.value as Theme] || '';
});

const handleThemeChange = () => {
  setTheme(getNextTheme(theme.value as Theme));
  if (shouldAnimate.value) {
    themeChanged.value = true;
    setTimeout(() => {
      themeChanged.value = false;
    }, theme.value === 'light' ? 150 : 100);
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleThemeChange();
  }
};

watch(() => theme.value, (newTheme) => {
  if (newTheme === 'system') {
    document.documentElement.setAttribute(
      'data-theme',
      prefersDark.value ? 'dark' : 'light'
    );
  }
});
</script>
