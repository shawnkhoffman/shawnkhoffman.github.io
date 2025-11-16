import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { vi } from 'vitest';

GlobalRegistrator.register();

// Mock gtag
global.window.gtag = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof ResizeObserver;

// Global mock for Icon component to avoid SVG namespace errors
vi.mock('@iconify/vue', () => ({
  Icon: {
    name: 'Icon',
    template: '<span class="icon-mock" aria-hidden="true"></span>',
  },
}));
