import { describe, test, expect, afterEach, beforeAll, afterAll, spyOn } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import ErrorBoundary from '@components/common/ErrorBoundary';
import * as React from 'react';

const ErrorComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('ErrorBoundary', () => {
  let errorSpy: ReturnType<typeof spyOn>;
  
  beforeAll(() => {
    errorSpy = spyOn(console, 'error');
    errorSpy.mockImplementation(() => {});
  });
  
  afterEach(() => {
    cleanup();
    errorSpy.mockClear();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  describe('Rendering', () => {
    test('renders children when there is no error', () => {
      const { container } = render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );
      
      expect(container.textContent).toContain('Test Content');
    });

    test('renders fallback UI when child throws an error', () => {
      const spy = spyOn(console, 'error');
      spy.mockImplementation(() => {});
      
      const { container } = render(
        <ErrorBoundary isTestError={true}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      
      expect(container.textContent).toMatch(/unexpected error occurred/i);
      
      spy.mockRestore();
    });
  });
  
  describe('Error handling', () => {
    test('calls onError when an error occurs', () => {
      const onErrorMock = spyOn(console, 'error');
      const spy = spyOn(console, 'error');
      spy.mockImplementation(() => {});
      
      render(
        <ErrorBoundary onError={onErrorMock} isTestError={true}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      
      expect(onErrorMock.mock.calls.length).toBeGreaterThan(0);
      
      spy.mockRestore();
    });
    
    test('shows reload button by default', () => {
      const spy = spyOn(console, 'error');
      spy.mockImplementation(() => {});
      
      const { container } = render(
        <ErrorBoundary isTestError={true}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      
      expect(container.textContent).toMatch(/reload page/i);
      
      spy.mockRestore();
    });
    
    test('shows retry button when showRetryButton is true', () => {
      const spy = spyOn(console, 'error');
      spy.mockImplementation(() => {});
      
      const { container, getByTestId } = render(
        <ErrorBoundary isTestError={true} showRetryButton={true} showReloadButton={true}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      
      expect(container.textContent).toMatch(/reload page/i);
      
      const retryButton = getByTestId('reset-error-button');
      expect(retryButton).toBeDefined();
      expect(retryButton.textContent).toMatch(/try again/i);
      
      spy.mockRestore();
    });
    
    test('calls onReset when reload button is clicked', () => {
      const spy = spyOn(console, 'error');
      spy.mockImplementation(() => {});
      const onResetMock = spyOn(console, 'error');
      const windowReloadSpy = spyOn(window.location, 'reload');
      windowReloadSpy.mockImplementation(() => {});
      
      const { container } = render(
        <ErrorBoundary isTestError={true} onReset={onResetMock}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      
      const reloadButton = container.querySelector('button');
      expect(reloadButton).toBeDefined();
      
      if (reloadButton) {
        reloadButton.click();
        
        expect(windowReloadSpy.mock.calls.length).toBeGreaterThan(0);
      }
      
      spy.mockRestore();
      windowReloadSpy.mockRestore();
    });
  });
}); 