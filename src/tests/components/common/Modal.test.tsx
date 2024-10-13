import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Modal from '@/components/common/Modal';
import { within } from '@testing-library/dom';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    content: <div>Test Content</div>,
    isExpanded: false,
    onToggleExpand: vi.fn(),
    triggerOverflowCheck: 0
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Structure', () => {
    it('contains all required landmark regions', () => {
      render(<Modal {...defaultProps} />);
      const dialogs = screen.getAllByRole('dialog');
      
      const dialog = dialogs[0] as HTMLElement;
      expect(dialog).toBeInTheDocument();
      
      const region = screen.getByRole('region') as HTMLElement;
      const heading = screen.getByRole('heading', { level: 2 }) as HTMLElement;
      
      expect(region).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });

    it('displays correct page indicators when multiple pages exist', () => {
      cleanup();
      render(<Modal {...defaultProps} totalPages={3} currentPage={1} />);
      const indicators = screen.getAllByRole('tab');
      const uniqueIndicators = indicators.filter(indicator => 
        indicator.closest('[role="navigation"]')
      );
      expect(uniqueIndicators).toHaveLength(3);
      expect(uniqueIndicators[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Navigation', () => {
    it('handles navigation controls correctly', async () => {
      const onNext = vi.fn();
      const onPrevious = vi.fn();
      
      render(
        <Modal
          {...defaultProps}
          showNavigation
          totalPages={3}
          currentPage={2}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      );

      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
      expect(onNext).toHaveBeenCalled();

      fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
      expect(onPrevious).toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('handles touch gestures', () => {
      const { container } = render(<Modal {...defaultProps} />);
      const modalContent = container.querySelector('[data-testid="modal-content"]') as HTMLElement;
      
      if (!modalContent) {
        throw new Error('Modal content not found');
      }
      
      const region = within(modalContent).getByRole('region');
      
      fireEvent.touchStart(region, {
        touches: [{ clientX: 500, clientY: 0 }]
      });
      
      fireEvent.touchMove(region, {
        touches: [{ clientX: 200, clientY: 0 }]
      });
      
      fireEvent.touchEnd(region);
    });

    it('closes on escape key', async () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('handles outside clicks', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const overlay = screen.getAllByTestId('modal-overlay')[0];
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('maintains focus trap', () => {
      render(<Modal {...defaultProps} />);
      
      const modalContent = screen.getAllByTestId('modal-content')[0] as HTMLElement;
      const focusableElements = within(modalContent).getAllByRole('button');
      
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

    it('provides appropriate ARIA labels', () => {
      render(<Modal {...defaultProps} />);
      
      const dialog = screen.getAllByTestId('modal-overlay')[0];
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
      
      const region = within(dialog).getByRole('region');
      expect(region).toHaveAttribute('aria-label');
    });

    it('announces navigation hints appropriately', () => {
      render(<Modal 
        {...defaultProps}
        showNavigation 
        totalPages={3} 
        currentPage={1}
      />);
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label');
    });
  });

  describe('Rendering', () => {
    it('renders when open', () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container).toMatchSnapshot();
      expect(screen.getAllByTestId('modal-overlay')[0]).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      const { container } = render(<Modal {...defaultProps} isOpen={false} />);
      expect(container).toMatchSnapshot();
      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    });
  });
});
