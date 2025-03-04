import type { Theme } from './theme';
import type { RenderOptions as RTLRenderOptions } from '@testing-library/react';
import type { Gtag } from 'gtag.js';

declare interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

declare interface RenderOptions extends RTLRenderOptions {
  withRouter?: boolean;
  withTheme?: boolean;
  route?: string;
  initialState?: Record<string, unknown>;
  theme?: Theme;
}

interface Window {
  gtag: Gtag;
  gtagCalls: Array<{
    command: string;
    action: string;
    params?: Record<string, unknown>;
  }>;
  prefersReducedMotion?: boolean;
}

declare interface GtagCall {
  command: string;
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

declare interface EventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}