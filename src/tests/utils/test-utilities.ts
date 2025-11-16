/**
 * General testing utilities for DOM operations and rendering
 */

import { mount, type VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { useThemeProvider } from '@/composables/useTheme';
import type { Component } from 'vue';
import type { Theme } from '@/types/theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountedWrappers: VueWrapper<any>[] = [];

/**
 * Cleanup function to unmount all rendered components
 */
export function cleanup() {
  mountedWrappers.forEach(wrapper => {
    wrapper.unmount();
  });
  mountedWrappers.length = 0;
}

interface CustomRenderOptions {
  withRouter?: boolean;
  withTheme?: boolean;
  theme?: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global?: any;
}

/**
 * Renders a Vue component in a JSDOM environment
 */
export async function render(
  component: Component,
  options: CustomRenderOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<VueWrapper<any>> {
  const {
    withRouter = false,
    withTheme = true,
    theme = 'light',
    global: globalOptions = {},
  } = options;

  const router = withRouter
    ? createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Test</div>' } },
      ],
    })
    : undefined;

  const TestWrapper = {
    components: {
      TestComponent: component,
    },
    setup() {
      if (withTheme) {
        useThemeProvider();
      }
      return {};
    },
    template: '<TestComponent />',
  };

  const wrapper = mount(TestWrapper, {
    global: {
      ...(router ? { plugins: [router] } : {}),
      ...globalOptions,
    },
  });

  mountedWrappers.push(wrapper);

  // Apply theme if needed
  if (withTheme && theme !== 'system') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  await wrapper.vm.$nextTick();

  return wrapper;
}

/**
 * Waits for a condition to be true
 */
export function waitFor(
  callback: () => boolean | Promise<boolean>,
  { timeout = 1000, interval = 50 } = {}
): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        if (await callback()) {
          resolve();
          return;
        }
      } catch (error) {
        console.error('Error in waitFor callback:', error);
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timed out after ${timeout}ms`));
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
}

/**
 * Helper to simulate events - simplified for JSDOM compatibility
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fireEvent: any = {
  click: (element: HTMLElement) => {
    if (element && typeof element.click === 'function') {
      element.click();
    } else {
      const onClickAttr = element.getAttribute('onclick');
      if (onClickAttr) {
        eval(onClickAttr);
      }

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
    }
  },
  change: (element: HTMLInputElement, value: string) => {
    element.value = value;

    const event = new Event('change', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  },
  focus: (element: HTMLElement) => {
    element.focus();
  },
  blur: (element: HTMLElement) => {
    element.blur();
  },
};
