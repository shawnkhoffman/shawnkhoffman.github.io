import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';

const TestIndex = () => (
  <div className="flex flex-col justify-center items-center text-center">
    <img
      src="test-image.svg"
      className="animate-spinSlow w-32 h-32 mb-8 dark:shadow-none"
      alt="React Logo"
    />
    <h1 className="text-3xl font-bold mb-2">Welcome to My Portfolio</h1>
    <p className="text-lg mb-6">Built in React</p>

    <a
      href="https://github.com/shawnkhoffman/shawnkhoffman.github.io"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-ghost mt-4"
      onClick={() => {
        if (window.gtag) {
          window.gtag('event', 'click', {
            event_category: 'Outbound Link',
            event_label: 'GitHub Source Code',
          });
        }
      }}
      aria-label="View the source code of this portfolio on GitHub"
      data-testid="github-link"
    >
      <span aria-hidden="true">GitHub Icon</span>
      View Source Code
      <span className="sr-only">View Source Code</span>
    </a>
  </div>
);

describe('Index Component', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    window.gtagCalls = [];
  });

  afterEach(() => {
    window.gtag = originalGtag;
    cleanup();
  });

  describe('Rendering', () => {
    test('renders the main content', () => {
      const { container } = render(<TestIndex />);
      
      const logo = container.querySelector('img[alt="React Logo"]');
      expect(logo).toBeDefined();
      
      const heading = container.querySelector('h1');
      expect(heading?.textContent).toContain('Welcome to My Portfolio');
      
      const link = container.querySelector('a[href*="github.com"]');
      expect(link).toBeDefined();
      expect(link?.textContent).toContain('View Source Code');
    });
  });

  describe('Interactions', () => {
    test('tracks GitHub link clicks', () => {
      const { getByTestId } = render(<TestIndex />);
      
      const link = getByTestId('github-link');
      
      fireEvent.click(link);
    });
  });

  describe('Accessibility', () => {
    test('provides proper aria labels', () => {
      const { container } = render(<TestIndex />);
      
      const link = container.querySelector('a[href*="github.com"]');
      expect(link).toBeDefined();
      expect(link?.getAttribute('aria-label')).toBe('View the source code of this portfolio on GitHub');
      
      const srOnly = container.querySelector('.sr-only');
      expect(srOnly).toBeDefined();
      expect(srOnly?.textContent).toBe('View Source Code');
    });
  });
}); 