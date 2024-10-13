import '@testing-library/jest-dom';
import { afterAll, beforeAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const createMediaQueryMock = (query: string, matches: boolean = false) => ({
  matches,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => {
      if (query === '(prefers-color-scheme: dark)') {
        return createMediaQueryMock(query, true);
      }
      return createMediaQueryMock(query);
    }),
  });

  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

expect.extend({
  toHaveAccessibleName(received: Element, expectedName: string) {
    const accessibleName =
      received.getAttribute('aria-label') ||
      received.getAttribute('aria-labelledby') ||
      received.textContent ||
      '';

    return {
      message: () =>
        `expected element to have accessible name "${expectedName}", but got "${accessibleName}"`,
      pass: accessibleName.includes(expectedName),
    };
  },
});

window.scrollTo = vi.fn();

vi.mock('@/hooks/useMediaQuery', () => ({
  default: () => false
}));
