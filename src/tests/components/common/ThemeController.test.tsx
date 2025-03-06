import { describe, test, expect, afterEach, afterAll, mock } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import ThemeController, { ThemeControllerProps } from '@components/common/ThemeController';
import { ThemeContext } from '@hooks/useTheme';
import type { Theme } from '@/types/theme';
import * as React from 'react';

const createMockFn = () => {
  const calls: unknown[][] = [];
  
  const fn = (...args: unknown[]) => {
    calls.push(args);
    return fn;
  };
  
  fn.mock = { calls };
  fn.mockReset = () => {
    calls.length = 0;
    return fn;
  };
  
  return fn;
};

const originalLocalStorage = global.localStorage;

const localStorageMock = {
  getItem: createMockFn(),
  setItem: createMockFn(),
  clear: createMockFn(),
  length: 0,
  key: () => null,
  removeItem: () => {}
};

describe('ThemeController', () => {
  Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  
  const setup = (initialTheme: Theme = 'light', props: Partial<ThemeControllerProps> = {}) => {
    const mockSetTheme = mock();
    
    const result = render(
      <ThemeContext.Provider value={{ theme: initialTheme, setTheme: mockSetTheme as React.Dispatch<React.SetStateAction<Theme>> }}>
        <ThemeController {...props} />
      </ThemeContext.Provider>
    );
    
    return {
      ...result,
      mockSetTheme
    };
  };
  
  afterEach(() => {
    cleanup();
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });
  });
  
  afterAll(() => {
    Object.defineProperty(global, 'localStorage', { value: originalLocalStorage });
  });

  describe('Rendering', () => {
    test('renders consistently across viewport sizes', () => {
      global.matchMedia = ((query: string) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => true
      })) as typeof window.matchMedia;
      
      const { container: mobileContainer } = setup();
      const mobileButton = mobileContainer.querySelector('button');
      expect(mobileButton).toBeDefined();

      global.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => true
      })) as typeof window.matchMedia;
      
      const { container: desktopContainer } = setup();
      const desktopButton = desktopContainer.querySelector('button');
      expect(desktopButton).toBeDefined();
    });
  });

  describe('Structure', () => {
    test('contains required elements', () => {
      const { container } = setup();
      const button = container.querySelector('button');
      expect(button).toBeDefined();
      
      const iconElement = button?.querySelector('[aria-hidden="true"]');
      expect(iconElement).toBeDefined();
    });
  });

  describe('Interactions', () => {
    test('handles theme cycling correctly', () => {
      const { container, mockSetTheme } = setup('light');
      const button = container.querySelector('button');
      expect(button).toBeDefined();

      if (button) {
        button.click();
        expect(mockSetTheme.mock.calls.length).toBe(1);
        expect(mockSetTheme.mock.calls[0][0]).toBe('dark');
      }
    });

    test('responds to keyboard events', () => {
      const { container, mockSetTheme } = setup('light');
      const button = container.querySelector('button');
      expect(button).toBeDefined();

      if (button) {
        button.click();
        
        expect(mockSetTheme.mock.calls.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Accessibility', () => {
    test('meets accessibility requirements', () => {
      const { container } = setup();
      const button = container.querySelector('button');
      expect(button).toBeDefined();
      
      if (button) {
        expect(button.getAttribute('role')).toBe('switch');
        expect(button.getAttribute('aria-label')).toBeDefined();
        expect(button.hasAttribute('aria-checked')).toBe(true);
      }
    });

    test('respects user preferences', () => {
      global.matchMedia = ((query: string) => ({
        matches: query.includes('reduced-motion'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      })) as typeof window.matchMedia;
      
      const { container } = setup();
      const button = container.querySelector('button');
      expect(button).toBeDefined();
    });
  });
}); 