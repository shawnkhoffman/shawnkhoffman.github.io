// setupTests.ts
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