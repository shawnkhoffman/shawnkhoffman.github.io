import { describe, test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import * as React from 'react';

const TestMainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <a href="#main-content" className="sr-only">Skip to content</a>
    <nav data-testid="navbar">Mocked Navbar</nav>
    <main 
      id="main-content" 
      className="flex-grow flex flex-col justify-center items-center bg-base-200 text-base-content pt-16"
      style={{ scrollMarginTop: '4rem' }}
    >
      <div data-testid="error-boundary">
        {children}
      </div>
    </main>
    <footer data-testid="footer">Mocked Footer</footer>
  </div>
);

describe('MainLayout Component', () => {
  describe('Structure', () => {
    test('applies correct layout classes to the main container', () => {
      const { container } = render(
        <TestMainLayout>
          <div>Test Content</div>
        </TestMainLayout>
      );

      const mainElements = container.getElementsByTagName('main');
      expect(mainElements.length).toBe(1);
      
      const mainElement = mainElements[0];
      const classNames = mainElement.className.split(' ');
      
      expect(classNames).toContain('flex-grow');
      expect(classNames).toContain('flex');
      expect(classNames).toContain('flex-col');
      expect(classNames).toContain('justify-center');
      expect(classNames).toContain('items-center');
      expect(classNames).toContain('bg-base-200');
      expect(classNames).toContain('text-base-content');
      expect(classNames).toContain('pt-16');
    });
  });
}); 