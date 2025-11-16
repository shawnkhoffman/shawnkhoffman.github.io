/**
 * Mocking utilities for testing
 */

import { mock } from 'bun:test';

/**
 * Creates a mock function for testing
 * @returns A properly typed mock function that tracks calls
 */
export function createMock<T = void>() {
  return mock(() => {
    return undefined as unknown as T;
  });
}

/**
 * Creates mock for global window.gtag
 * @returns Object with the mock and utility functions
 */
export function mockGtag() {
  const original = window.gtag;

  const gtagMock = mock(() => { });

  window.gtag = gtagMock as typeof window.gtag;

  return {
    mock: gtagMock,
    restore: () => {
      window.gtag = original;
    },
    clearCalls: () => {
      gtagMock.mockClear();
    }
  };
}
