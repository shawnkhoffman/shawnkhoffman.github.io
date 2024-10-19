import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Navbar from '../../../components/layout/Navbar';
import { ThemeProvider } from '../../../context/ThemeContext';

vi.mock('../../../components/common/ThemeController', () => ({
  default: ({ showLabel, className }: { showLabel?: boolean; className?: string }) => (
    <div data-testid="theme-controller" data-show-label={showLabel} className={className} />
  ),
}));

describe('Navbar', () => {
  const originalWindow = { ...window };

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.stubGlobal('gtag', vi.fn());

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    });

    Object.defineProperty(window, 'location', {
      value: {
        ...originalWindow.location,
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderNavbar = () =>
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

  it('renders main navigation elements', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: 'My Portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About Menu' })).toBeInTheDocument();
    expect(screen.getAllByTestId('theme-controller')).toHaveLength(2);
  });

  describe('Navbar Snapshot', () => {
    it('matches the snapshot', () => {
      const { asFragment } = renderNavbar();
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Accessibility checks for Navbar', () => {
    it('sets aria-expanded to true when About submenu is opened', () => {
      renderNavbar();
      const aboutButton = screen.getByRole('button', { name: 'About Menu' });

      fireEvent.click(aboutButton);
      expect(aboutButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(aboutButton);
      expect(aboutButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded to true when mobile menu is opened', () => {
      renderNavbar();
      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' });

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Desktop view', () => {
    it('toggles About submenu visibility', () => {
      renderNavbar();
      const aboutButton = screen.getByRole('button', { name: 'About Menu' });

      expect(screen.queryByRole('link', { name: 'About Me' })).not.toBeVisible();

      fireEvent.click(aboutButton);
      expect(screen.getByRole('link', { name: 'About Me' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'About This Site' })).toBeVisible();

      fireEvent.click(aboutButton);
      expect(screen.queryByRole('link', { name: 'About Me' })).not.toBeVisible();
    });

    it('closes submenu when clicking outside', () => {
      renderNavbar();
      const aboutButton = screen.getByRole('button', { name: 'About Menu' });

      fireEvent.click(aboutButton);
      expect(screen.getByRole('link', { name: 'About Me' })).toBeVisible();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByRole('link', { name: 'About Me' })).not.toBeVisible();
    });
  });

  describe('Mobile view', () => {
    beforeEach(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    it('toggles mobile menu visibility', () => {
      renderNavbar();
      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' });

      let mobileMenu = screen.queryByRole('menu', { name: 'Mobile navigation drawer' });
      expect(mobileMenu).not.toBeInTheDocument();

      fireEvent.click(menuButton);
      mobileMenu = screen.queryByRole('menu', { name: 'Mobile navigation drawer' });
      expect(mobileMenu).toBeInTheDocument();

      fireEvent.click(menuButton);
      mobileMenu = screen.queryByRole('menu', { name: 'Mobile navigation drawer' });
      expect(mobileMenu).not.toBeInTheDocument();
    });

    it('closes mobile menu when clicking a link', () => {
      renderNavbar();
      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' });

      fireEvent.click(menuButton);
      const mobileMenu = screen.getByRole('menu', { name: 'Mobile navigation drawer' });
      const homeLink = within(mobileMenu).getByRole('link', { name: 'Home' });

      fireEvent.click(homeLink);
      expect(screen.queryByRole('menu', { name: 'Mobile navigation drawer' })).not.toBeInTheDocument();
    });

    it('renders ThemeController with correct props in mobile view', () => {
      renderNavbar();
      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' });
      fireEvent.click(menuButton);

      const themeControllers = screen.getAllByTestId('theme-controller');
      const mobileThemeController = themeControllers[themeControllers.length - 1];
      
      expect(mobileThemeController).toHaveAttribute('data-show-label', 'true');
      expect(mobileThemeController).toHaveClass('block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 w-full');
    });
  });

  describe('Navbar with localStorage unavailable', () => {
    beforeEach(() => {
      vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
      vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {});

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders the Navbar and defaults to system light theme if localStorage fails', () => {
      renderNavbar();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('renders the Navbar and defaults to system dark theme if localStorage fails', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderNavbar();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Analytics', () => {
    it('triggers gtag event when clicking navigation links', () => {
      renderNavbar();

      const homeLink = screen.getByRole('link', { name: 'Home' });
      fireEvent.click(homeLink);
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'Navigation',
        event_label: 'Home',
      });

      const aboutButton = screen.getByRole('button', { name: 'About Menu' });
      fireEvent.click(aboutButton);
      const aboutMeLink = screen.getByRole('link', { name: 'About Me' });
      fireEvent.click(aboutMeLink);
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'Navigation',
        event_label: 'About Me',
      });
    });
  });
});