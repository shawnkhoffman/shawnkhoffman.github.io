import { render as rtlRender } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import MainLayout from '@/layouts/MainLayout';

vi.mock('@/components/layout/Navbar', () => ({
  __esModule: true,
  default: () => (
    <nav 
      data-testid="mocked-navbar-single" 
      aria-label="Mocked Navbar" 
      role="navigation"
    >
      Mocked Navbar
    </nav>
  )
}));

vi.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Mocked Footer</footer>
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children
}));

const render = (ui: React.ReactElement) => rtlRender(ui);

describe('MainLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Structure', () => {
    it('applies correct layout classes to the main container', () => {
      const { container } = render(
        <MainLayout>
          <div>Test Content</div>
        </MainLayout>
      );

      const mainElements = container.getElementsByTagName('main');
      expect(mainElements).toHaveLength(1);
      expect(mainElements[0]).toHaveClass(
        'flex-grow',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'bg-base-200',
        'text-base-content',
        'pt-16'
      );
    });
  });
});
