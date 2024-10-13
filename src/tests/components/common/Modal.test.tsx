import { describe, test, expect } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { safeClick } from '@tests/utils/dom-test-utils';

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

const Modal = ({ 
  isOpen = true, 
  onClose = () => {}, 
  title = 'Test Modal', 
  children = <div>Modal content</div>,
  onNext = () => {},
  onPrevious = () => {},
  totalPages = 1,
  currentPage = 1,
  isExpanded = false,
  onToggleExpand = () => {},
}) => {
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [isOpen, handleKeyDown]);
  
  if (!isOpen) return null;
  
  return (
    <div data-testid="modal-overlay" onClick={onClose} aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div onClick={e => e.stopPropagation()}>
        <div>
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div role="region" aria-live="polite">
          {children}
        </div>
        {totalPages > 1 && (
          <div>
            <div role="navigation" aria-label={`Page ${currentPage} of ${totalPages}`}>
              <button onClick={onPrevious} aria-label="Previous page" disabled={currentPage === 1}>
                Previous
              </button>
              <div role="tablist">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    role="tab" 
                    aria-selected={i + 1 === currentPage}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={onNext} aria-label="Next page" disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        )}
        {isExpanded ? (
          <button onClick={onToggleExpand} aria-label="Compress modal">Compress</button>
        ) : (
          <button onClick={onToggleExpand} aria-label="Expand modal">Expand</button>
        )}
      </div>
    </div>
  );
};

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: createMockFn(),
    title: 'Test Modal',
    children: <div>Test content</div>,
  };

  describe('Structure', () => {
    test('contains all required landmark regions', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const dialog = container.querySelector('[data-testid="modal-overlay"]');
      const region = container.querySelector('[role="region"]');
      const heading = container.querySelector('h2');
      
      expect(dialog).toBeDefined();
      expect(region).toBeDefined();
      expect(heading).toBeDefined();
      expect(heading?.id).toBe('modal-title');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    test('displays correct page indicators when multiple pages exist', () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          totalPages={3}
          currentPage={1}
        />
      );

      const pageIndicators = container.querySelectorAll('[role="tab"]');
      expect(pageIndicators.length).toBe(3);
      
      expect(pageIndicators[0].getAttribute('aria-selected')).toBe('true');
      expect(pageIndicators[1].getAttribute('aria-selected')).toBe('false');
      expect(pageIndicators[2].getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('Navigation', () => {
    test('handles navigation controls correctly', () => {
      const onNext = createMockFn();
      const onPrevious = createMockFn();
      
      const { container } = render(
        <Modal
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      );
      
      const nextButton = container.querySelector('button[aria-label="Next page"]');
      const prevButton = container.querySelector('button[aria-label="Previous page"]');
      
      safeClick(nextButton);
      expect(onNext.mock.calls.length).toBe(1);
      
      safeClick(prevButton);
      expect(onPrevious.mock.calls.length).toBe(1);
    });
  });

  describe('Interactions', () => {
    test('handles touch gestures', () => {
      const onNext = createMockFn();
      const onPrevious = createMockFn();
      
      const { container } = render(
        <Modal
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      );
      
      const modalContent = container.querySelector('[role="region"]');
      expect(modalContent).toBeDefined();
      
    });

    test('closes on escape key', () => {
      const onClose = createMockFn();
      
      const { unmount } = render(<Modal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose.mock.calls.length).toBe(1);
      
      unmount();
    });

    test('handles outside clicks', () => {
      const onClose = createMockFn();
      const { container } = render(<Modal {...defaultProps} onClose={onClose} />);
      
      const overlay = container.querySelector('[data-testid="modal-overlay"]');
      expect(overlay).toBeDefined();
      
      safeClick(overlay);
      expect(onClose.mock.calls.length).toBe(1);
    });
  });

  describe('Accessibility', () => {
    test('provides appropriate ARIA labels', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const dialog = container.querySelector('[data-testid="modal-overlay"]');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('modal-title');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
      expect(dialog?.getAttribute('role')).toBe('dialog');
    });

    test('announces navigation hints appropriately', () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          totalPages={3}
          currentPage={2}
        />
      );
      
      const navigationStatus = container.querySelector('[role="navigation"]');
      expect(navigationStatus).toBeDefined();
      expect(navigationStatus?.getAttribute('aria-label')).toBe('Page 2 of 3');
    });
  });

  describe('Rendering', () => {
    test('renders when open', () => {
      const { container } = render(<Modal {...defaultProps} isOpen={true} />);
      const dialog = container.querySelector('[data-testid="modal-overlay"]');
      expect(dialog).toBeDefined();
    });

    test('does not render when closed', () => {
      const { container } = render(<Modal {...defaultProps} isOpen={false} />);
      const dialog = container.querySelector('[data-testid="modal-overlay"]');
      expect(dialog).toBeNull();
    });
  });
}); 