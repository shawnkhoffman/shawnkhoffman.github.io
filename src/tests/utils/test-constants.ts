export const TEST_IDS = {
  MODAL: 'modal',
  TECHNOLOGY_CARD: 'technology-card',
  THEME_CONTROLLER: 'theme-controller',
  NAVBAR: 'navbar',
  FOOTER: 'footer',
  ERROR_BOUNDARY: 'error-boundary',
  COLLAPSIBLE_SECTION: 'collapsible-section',
  ERROR_TEST_BUTTON: 'test-error-button',
  ERROR_DROPDOWN_BUTTON: 'error-dropdown-button',
  ERROR_DROPDOWN_LIST: 'error-dropdown-list',
  CLEAR_ERROR_BUTTON: 'clear-error-button',
} as const;

export const ARIA_LABELS = {
  SWITCH_THEME: {
    TO_DARK: 'Switch theme to dark mode',
    TO_LIGHT: 'Switch theme to light mode',
    TO_SYSTEM: 'Switch theme to system mode',
  },
  MODAL: {
    CLOSE: 'Close modal',
    EXPAND: 'Expand modal',
    COMPRESS: 'Compress modal',
  },
} as const;

export const TEST_TIMEOUTS = {
  ANIMATION: 300,
  THEME_TRANSITION: 200,
  MODAL_TRANSITION: 150,
} as const;

export const MOCK_DEFAULTS = {
  THEME: 'light',
  ROUTE: '/',
} as const;
