import '@testing-library/jest-dom';
import { afterAll, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0].includes('Not implemented: navigation')) {
      return;
    }
    originalConsoleError(...args);
  };

  vi.mock('*.svg', () => 'mock-svg');
});

afterAll(() => {
  cleanup();
});

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;