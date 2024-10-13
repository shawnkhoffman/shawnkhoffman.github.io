import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

describe('ErrorBoundary', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders children when there is no error', () => {
      const { container } = render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );
      expect(container).toHaveTextContent('Test Content');
    });
    });
  });
