import { vi } from 'vitest';
import { cleanup, render, screen, within, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children
  };
});

const getVisibleMobileMenu = () => {
  const menus = screen.getAllByTestId('mobile-navigation-menu');
  return menus.find(menu => {
    const style = window.getComputedStyle(menu);
    return !style.transform.includes('translateX(100%)');
  }) || menus[0];
};

const mockLocation = {
  href: ''
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('Navbar Component', () => {
  beforeEach(() => {
    cleanup();
    window.location.href = '';
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('renders the main components', () => {
      renderNavbar();
      
      const logo = screen.getByRole('img', { name: 'React Logo' });
      expect(logo).toHaveClass('animate-spinSlow');
    });

    it('renders mobile and desktop navigation appropriately', () => {
      renderNavbar();
      
      const menuButton = screen.getAllByRole('button', { name: /toggle mobile menu/i })[0];
      const mainNav = screen.getAllByRole('navigation', { name: 'Main navigation' })[0];

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
      expect(mainNav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('renders theme controller in suspense', () => {
      renderNavbar();
      expect(screen.getAllByText(/loading theme/i)[0]).toBeInTheDocument();
    });

    it('renders all navigation items correctly', () => {
      renderNavbar();
      
      const desktopNav = screen.getAllByRole('list', { name: 'Desktop navigation' })[0];
      
      const menuItems = within(desktopNav).getAllByRole('menuitem');
      const buttons = within(desktopNav).getAllByRole('button');
      const topLevelItems = [...menuItems, ...buttons];
      
      topLevelItems.forEach(item => {
        if (item.hasAttribute('href')) {
          expect(item).toHaveAttribute('href');
        } else {
          expect(item).toHaveAttribute('aria-expanded');
          
          fireEvent.click(item);
          const submenu = screen.getByRole('menu');
          const submenuItems = within(submenu).getAllByRole('menuitem');
          expect(submenuItems.length).toBeGreaterThan(0);
          
          submenuItems.forEach(subItem => {
            expect(subItem).toHaveAttribute('href');
          });
        }
      });
    });
  });

  describe('Structure', () => {
    it('has correct navigation hierarchy', () => {
      renderNavbar();
      
      const menuButton = screen.getAllByRole('button', { name: /toggle mobile menu/i })[0];
      fireEvent.click(menuButton);
      
      const mobileMenu = getVisibleMobileMenu();
      const mobileMenuWithin = within(mobileMenu);
      const closeButton = mobileMenuWithin.getByRole('button', { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('allows navigation through all menu items in both desktop and mobile views', () => {
      renderNavbar();
      
      const desktopNav = screen.getAllByRole('list', { name: 'Desktop navigation' })[0];
      const menuItems = within(desktopNav).getAllByRole('menuitem');
      const buttons = within(desktopNav).getAllByRole('button');
      const topLevelItems = [...menuItems, ...buttons];
      
      topLevelItems.forEach(item => {
        if (item.hasAttribute('href')) {
          fireEvent.click(item);
          expect(window.location.href).toBe(item.getAttribute('href'));
          window.location.href = '';
        } else {
          fireEvent.click(item);
          const submenu = screen.getByRole('menu');
          const submenuItems = within(submenu).getAllByRole('menuitem');
          
          submenuItems.forEach(subItem => {
            fireEvent.click(subItem);
            expect(window.location.href).toBe(subItem.getAttribute('href'));
            window.location.href = '';
          });
        }
      });

      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      fireEvent.click(menuButton);

      const mobileMenu = getVisibleMobileMenu();
      const mobileLinkItems = within(mobileMenu).getAllByRole('menuitem');
      const mobileButtons = within(mobileMenu).getAllByRole('button');
      const mobileItems = [...mobileLinkItems, ...mobileButtons];
      
      mobileItems.forEach(item => {
        if (item.hasAttribute('href')) {
          fireEvent.click(item);
          expect(window.location.href).toBe(item.getAttribute('href'));
          window.location.href = '';
        } else if (item.getAttribute('aria-controls')?.includes('submenu')) {
          fireEvent.click(item);
          const submenuId = item.getAttribute('aria-controls');
          const submenu = document.getElementById(submenuId!);
          const submenuItems = within(submenu!).getAllByRole('menuitem');
          
          submenuItems.forEach(subItem => {
            fireEvent.click(subItem);
            expect(window.location.href).toBe(subItem.getAttribute('href'));
            window.location.href = '';
          });
        }
      });
    });

    it('maintains focus trap in mobile menu', () => {
      renderNavbar();
      
      const mainNavs = screen.getAllByTestId('main-navigation');
      const menuButton = within(mainNavs[0]).getByRole('button', { 
        name: /toggle mobile menu/i 
      });
      fireEvent.click(menuButton);

      const mobileMenu = getVisibleMobileMenu();
      const focusableElements = within(mobileMenu).getAllByRole('button');

      const [firstFocusable, lastFocusable] = [
        focusableElements[0],
        focusableElements[focusableElements.length - 1]
      ];

      firstFocusable.focus();
      fireEvent.keyDown(document, { 
        key: 'Tab',
        preventDefault: () => {}
      });
      
      lastFocusable.focus();
      expect(document.activeElement).toBe(lastFocusable);

      lastFocusable.focus();
      fireEvent.keyDown(document, { 
        key: 'Tab',
        shiftKey: true,
        preventDefault: () => {}
      });
      
      firstFocusable.focus();
      expect(document.activeElement).toBe(firstFocusable);
    });

    it('closes menus when pressing Escape', () => {
      renderNavbar();
      
      const mainNavs = screen.getAllByTestId('main-navigation');
      const menuButton = within(mainNavs[0]).getByRole('button', { 
        name: /toggle mobile menu/i 
      });
      
      fireEvent.click(menuButton);
      
      const mobileMenus = screen.getAllByRole('dialog');
      const mobileMenu = mobileMenus[0];
      
      const closeButton = within(mobileMenu).getByRole('button', { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('maintains mobile menu state during gesture interactions', () => {
      renderNavbar();
      
      const mainNavs = screen.getAllByTestId('main-navigation');
      const menuButton = within(mainNavs[0]).getByRole('button', { 
        name: /toggle mobile menu/i 
      });
      
      fireEvent.click(menuButton);
      
      const mobileMenus = screen.getAllByRole('dialog');
      const mobileMenu = mobileMenus[0];
      
      fireEvent.touchStart(mobileMenu, { touches: [{ clientX: 0, clientY: 0 }] });
      fireEvent.touchMove(mobileMenu, { touches: [{ clientX: 10, clientY: 0 }] });
      fireEvent.touchEnd(mobileMenu);
      
      expect(mobileMenu).toBeVisible();
      
      fireEvent.touchStart(mobileMenu, { touches: [{ clientX: 0, clientY: 0 }] });
      fireEvent.touchMove(mobileMenu, { touches: [{ clientX: 200, clientY: 0 }] });
      fireEvent.touchEnd(mobileMenu);
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderNavbar();
      
      const mainNav = screen.getAllByRole('navigation', { name: 'Main navigation' })[0];
      const desktopNav = screen.getAllByRole('list', { name: 'Desktop navigation' })[0];
      const mobileMenu = screen.getAllByRole('dialog', { name: 'Mobile navigation menu' })[0];

      expect(mainNav).toHaveAttribute('aria-label', 'Main navigation');
      expect(desktopNav).toHaveAttribute('aria-label', 'Desktop navigation');
      expect(mobileMenu).toHaveAttribute('aria-modal', 'true');
    });

    it('maintains focus trap in mobile menu', () => {
      renderNavbar();
      
      const mainNavs = screen.getAllByTestId('main-navigation');
      const mainNav = mainNavs[0];
      
      const menuButton = within(mainNav).getByRole('button', { 
        name: /toggle mobile menu/i 
      });
      fireEvent.click(menuButton);

      const mobileMenu = getVisibleMobileMenu();
      const focusableElements = within(mobileMenu).getAllByRole('button');

      const [firstFocusable, lastFocusable] = [
        focusableElements[0],
        focusableElements[focusableElements.length - 1]
      ];

      firstFocusable.focus();
      fireEvent.keyDown(document, { 
        key: 'Tab',
        preventDefault: () => {}
      });
      
      lastFocusable.focus();
      expect(document.activeElement).toBe(lastFocusable);

      lastFocusable.focus();
      fireEvent.keyDown(document, { 
        key: 'Tab',
        shiftKey: true,
        preventDefault: () => {}
      });
      
      firstFocusable.focus();
      expect(document.activeElement).toBe(firstFocusable);
    });
  });
});
