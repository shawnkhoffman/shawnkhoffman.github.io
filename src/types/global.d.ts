import type { Gtag } from 'gtag.js';

declare global {
  interface Window {
    gtag: Gtag;
    gtagCalls: Array<{
      command: string;
      action: string;
      params?: Record<string, unknown>;
    }>;
    prefersReducedMotion?: boolean;
  }
}

export { };