import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import Modal from '../../../components/common/Modal';
import '@testing-library/jest-dom';

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  observedElements: Set<Element>;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    this.observedElements = new Set();
  }

  observe = vi.fn((element: Element) => {
    this.observedElements.add(element);
  });

  unobserve = vi.fn((element: Element) => {
    this.observedElements.delete(element);
  });

  disconnect = vi.fn(() => {
    this.observedElements.clear();
  });

  trigger(entries: ResizeObserverEntry[] = []) {
    this.callback(entries, this);
  }
}

let resizeObserverInstances: ResizeObserverMock[] = [];

beforeEach(() => {
  resizeObserverInstances = [];

  global.ResizeObserver = vi.fn((callback: ResizeObserverCallback) => {
    const instance = new ResizeObserverMock(callback);
    resizeObserverInstances.push(instance);
    return instance as unknown as ResizeObserver;
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnToggleExpand = vi.fn();

  const modalProps = {
    isOpen: true,
    onClose: mockOnClose,
    content: <div>Modal Content</div>,
    title: 'Test Modal Title',
    onNext: mockOnNext,
    onPrevious: mockOnPrevious,
    totalPages: 3,
    currentPage: 1,
    showNavigation: true,
    isMobile: false,
    isExpanded: false,
    onToggleExpand: mockOnToggleExpand,
    triggerOverflowCheck: 0,
  };

  it('renders the modal with title and content', () => {
    const { container } = render(<Modal {...modalProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('does not render the modal when isOpen is false', () => {
    const { container } = render(<Modal {...modalProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('closes the modal when the close button is clicked', () => {
    const { container } = render(<Modal {...modalProps} />);

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });

  it('expands and compresses the modal when the expand button is clicked', () => {
    const { container, rerender } = render(<Modal {...modalProps} />);

    const expandButton = screen.getByLabelText('Expand modal');
    fireEvent.click(expandButton);

    expect(mockOnToggleExpand).toHaveBeenCalled();

    rerender(<Modal {...modalProps} isExpanded={true} />);

    expect(container).toMatchSnapshot();

    const compressButton = screen.getByLabelText('Compress modal');
    fireEvent.click(compressButton);

    expect(mockOnToggleExpand).toHaveBeenCalledTimes(2);

    rerender(<Modal {...modalProps} isExpanded={false} />);

    expect(container).toMatchSnapshot();
  });

  it('navigates to the next page when the right arrow is clicked', () => {
    const { container, rerender } = render(<Modal {...modalProps} />);

    const nextButton = screen.getByLabelText('Go to the next page');
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalled();

    rerender(<Modal {...modalProps} currentPage={2} />);

    expect(container).toMatchSnapshot();
  });

  it('navigates to the previous page when the left arrow is clicked', () => {
    const { container, rerender } = render(<Modal {...modalProps} currentPage={2} />);

    const prevButton = screen.getByLabelText('Go to the previous page');
    fireEvent.click(prevButton);

    expect(mockOnPrevious).toHaveBeenCalled();

    rerender(<Modal {...modalProps} currentPage={1} />);

    expect(container).toMatchSnapshot();
  });

  it('triggers next page on right arrow key press', () => {
    const { container, rerender } = render(<Modal {...modalProps} />);

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockOnNext).toHaveBeenCalled();

    rerender(<Modal {...modalProps} currentPage={2} />);

    expect(container).toMatchSnapshot();
  });

  it('triggers previous page on left arrow key press', () => {
    const { container, rerender } = render(<Modal {...modalProps} currentPage={2} />);

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockOnPrevious).toHaveBeenCalled();

    rerender(<Modal {...modalProps} currentPage={1} />);

    expect(container).toMatchSnapshot();
  });

  it('closes the modal on Escape key press', () => {
    const { container } = render(<Modal {...modalProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });

  it('displays navigation dots for multiple pages', () => {
    const { container } = render(<Modal {...modalProps} />);

    const dots = screen.getAllByLabelText(/Page \d of 3/);
    expect(dots).toHaveLength(3);

    expect(container).toMatchSnapshot();
  });

  it('shows the scroll indicator if content overflows', async () => {
    const { container } = render(<Modal {...modalProps} />);

    const contentDiv = screen.getByText('Modal Content').parentElement;
    expect(contentDiv).toBeTruthy();

    if (contentDiv) {
      Object.defineProperty(contentDiv, 'scrollHeight', {
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(contentDiv, 'clientHeight', {
        configurable: true,
        value: 500,
      });

      await act(async () => {
        resizeObserverInstances[0].trigger();
      });

      fireEvent.scroll(contentDiv);

      expect(screen.getByText('Scroll down to see more')).toBeInTheDocument();

      expect(container).toMatchSnapshot();
    }
  });

  it('matches snapshot when modal is expanded', () => {
    const { container } = render(<Modal {...modalProps} isExpanded={true} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when modal is in mobile view', () => {
    const { container } = render(<Modal {...modalProps} isMobile={true} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for single-page modal without navigation', () => {
    const { container } = render(
      <Modal
        {...modalProps}
        totalPages={1}
        currentPage={0}
        showNavigation={false}
        onNext={undefined}
        onPrevious={undefined}
      />
    );

    expect(container).toMatchSnapshot();
  });
});