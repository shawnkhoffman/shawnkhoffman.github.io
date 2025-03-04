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

  interface RenderOptions extends import('@testing-library/react').RenderOptions {
    withRouter?: boolean;
    withTheme?: boolean;
    route?: string;
    initialState?: Record<string, unknown>;
    theme?: import('./theme').Theme;
  }

  interface TestModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
}

export {};