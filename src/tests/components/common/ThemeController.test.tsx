import { describe, it, expect, vi, afterEach } from 'vitest';
import ThemeController from '../../../components/common/ThemeController';
import '@testing-library/jest-dom';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { ThemeContext } from '../../../hooks/useTheme';
import type { Theme } from '../../../types/theme';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ThemeController', () => {
  const setup = (initialTheme: Theme = 'light', props = {}) => {
    cleanup();
    
    const mockSetTheme = vi.fn();
    return {
      mockSetTheme,
      ...render(
        <ThemeContext.Provider value={{ theme: initialTheme, setTheme: mockSetTheme }}>
          <ThemeController {...props} />
        </ThemeContext.Provider>
      ),
      getButton: () => screen.getByRole('switch')
    };
  };

  afterEach(cleanup);

  describe('Rendering', () => {
    it('renders consistently across viewport sizes', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('768'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      const { container: mobile } = setup();
      expect(mobile).toMatchSnapshot('mobile');

      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      const { container: desktop } = setup();
      expect(desktop).toMatchSnapshot('desktop');
    });
  });

  describe('Structure', () => {
    it('contains required elements', () => {
      const { getButton } = setup();
      const button = getButton();
      expect(button).toBeInTheDocument();
      expect(button.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles theme cycling correctly', () => {
      const { mockSetTheme, getButton } = setup('light');
      const button = getButton();

      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith('dark');

      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('meets accessibility requirements', () => {
      const { getButton } = setup();
      const button = getButton();
      
      expect(button).toHaveAttribute('role', 'switch');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-checked');
    });

    it('respects user preferences', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      const { container } = setup();
      expect(container).toMatchSnapshot('reduced-motion');
    });
  });
});
