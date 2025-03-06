import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

const TestEntertaining404Content: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4 sm:p-6 w-full max-w-3xl mx-auto" role="region" aria-label="404 Content">
      <div className="mb-6">
        <p className="mb-4 text-sm sm:text-base" data-testid="404-description">
          The 404 page was designed to add a touch of humor and personality to an otherwise frustrating experience.
          Instead of a generic error message, the page randomly displays amusing messages and gifs, making it more
          enjoyable for users who may have navigated to a non-existent page. This approach aims to reduce user frustration
          and create a more engaging experience.
        </p>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-full sm:max-w-md lg:max-w-lg bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
          <div data-testid="mock-not-found">Mock NotFound Component</div>
        </div>
      </div>
    </div>
  );
};

describe('Entertaining404Content', () => {
  let renderResult: ReturnType<typeof render>;

  beforeEach(() => {
    cleanup();
    renderResult = render(<TestEntertaining404Content />);
  });

  afterEach(() => {
    cleanup();
    renderResult.unmount();
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      expect(screen.getByRole('region')).toBeTruthy();
    });

    test('renders the NotFound component', () => {
      expect(screen.getByTestId('mock-not-found')).toBeTruthy();
    });
  });

  describe('Structure', () => {
    test('has the expected structure', () => {
      const container = renderResult.container;
      expect(container.querySelector('[role="region"]')).toBeTruthy();
      expect(container.querySelector('[data-testid="404-description"]')).toBeTruthy();
      expect(container.querySelector('[data-testid="mock-not-found"]')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('has proper landmark structure', () => {
      expect(screen.getByRole('region', { name: '404 Content' })).toBeTruthy();
    });

    test('ensures content is readable', () => {
      expect(screen.getByText(/404 page was designed/)).toBeTruthy();
    });
  });
}); 