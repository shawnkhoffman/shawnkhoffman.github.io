import { mount, type VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { expect } from 'vitest';
import type { Component } from 'vue';

export { mount };

export function render(
  ui: Component,
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global?: any;
    route?: string;
    [key: string]: unknown;
  } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): VueWrapper<any> {
  const { global: globalOptions = {}, route = '/', ...mountOptions } = options;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Test</div>' } },
      { path: '/about-me', component: { template: '<div>About</div>' } },
      { path: '/about-this-site', component: { template: '<div>About This Site</div>' } },
    ],
  });

  if (route !== '/') {
    router.push(route);
  }

  return mount(ui, {
    global: {
      plugins: [router],
      ...globalOptions,
    },
    ...mountOptions,
  });
}

export async function clickAndVerify(element: HTMLElement) {
  element.click();
  await new Promise(resolve => setTimeout(resolve, 0));
  return element;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getByTestId(wrapper: VueWrapper<any>, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectElement(element: any) {
  const baseExpect = expect(element);

  return {
    ...baseExpect,

    toBeInTheDocument() {
      if (!element || !element.exists?.()) {
        throw new Error('Expected element to be in the document, but it was not found');
      }
      return baseExpect.toBeTruthy();
    },

    toHaveTextContent(expected: string | RegExp) {
      if (!element) {
        throw new Error('Cannot check text content of null element');
      }

      const content = element.text?.() || element.textContent || '';

      if (typeof expected === 'string') {
        if (!content.includes(expected)) {
          throw new Error(`Expected element to have text content "${expected}" but got "${content}"`);
        }
      } else if (!expected.test(content)) {
        throw new Error(`Expected element to match text pattern ${expected} but got "${content}"`);
      }
    },

    toHaveAttribute(attr: string, value?: string) {
      if (!element) {
        throw new Error('Cannot check attributes of null element');
      }

      const attrValue = element.attributes?.(attr) || element.getAttribute?.(attr);
      const hasAttr = attrValue !== undefined && attrValue !== null;

      if (!hasAttr) {
        throw new Error(`Expected element to have attribute "${attr}" but it was not found`);
      }

      if (value !== undefined && attrValue !== value) {
        throw new Error(`Expected attribute "${attr}" to have value "${value}" but got "${attrValue}"`);
      }
    },
  };
}

export function expectValue<T>(value: T) {
  const baseExpect = expect(value);

  return {
    ...baseExpect,

    toBeGreaterThan(expected: number) {
      if (typeof value !== 'number') {
        throw new Error(`Expected a number but got ${typeof value}`);
      }

      if (!(value > expected)) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
  };
}
