import type { Theme } from './theme';
import type { MountingOptions } from '@vue/test-utils';
import type { Gtag } from 'gtag.js';

declare interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare interface RenderOptions extends Omit<MountingOptions<any>, 'global'> {
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
