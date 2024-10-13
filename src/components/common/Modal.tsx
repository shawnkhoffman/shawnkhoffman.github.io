import React, {
  memo,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import useLockedBody from '../../hooks/useLockedBody';
import useResizeObserver from '../../hooks/useResizeObserver';

const ExpandButton = lazy(() =>
  import('./ModalIcons').then((module) => ({ default: module.ExpandButton }))
);

const NavigationButtons = lazy(() =>
  import('./ModalIcons').then((module) => ({ default: module.NavigationButtons }))
);

const ScrollIndicator = lazy(() =>
  import('./ModalIcons').then((module) => ({ default: module.ScrollIndicator }))
);

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  totalPages?: number;
  currentPage?: number;
  showNavigation?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  triggerOverflowCheck: number;
  className?: string;
  contentClassName?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  initialFocus?: 'close' | 'expand' | 'content';
}

interface ModalState {
  isContentOverflowing: boolean;
  scrollIndicatorVisible: boolean;
  showNavigationHint: boolean;
  touchStart: { x: number; y: number; time: number };
  hasInteracted: boolean;
}

type ModalAction =
  | { type: 'SET_OVERFLOW'; payload: boolean }
  | { type: 'SET_SCROLL_INDICATOR'; payload: boolean }
  | { type: 'SET_NAVIGATION_HINT'; payload: boolean }
  | { type: 'SET_TOUCH_START'; payload: { x: number; y: number; time: number } }
  | { type: 'SET_HAS_INTERACTED'; payload: boolean };

const initialState: ModalState = {
  isContentOverflowing: false,
  scrollIndicatorVisible: true,
  showNavigationHint: true,
  touchStart: { x: 0, y: 0, time: 0 },
  hasInteracted: false,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'SET_OVERFLOW':
      return { ...state, isContentOverflowing: action.payload };
    case 'SET_SCROLL_INDICATOR':
      return { ...state, scrollIndicatorVisible: action.payload };
    case 'SET_NAVIGATION_HINT':
      return { ...state, showNavigationHint: action.payload };
    case 'SET_TOUCH_START':
      return { ...state, touchStart: action.payload };
    case 'SET_HAS_INTERACTED':
      return { ...state, hasInteracted: action.payload };
    default:
      return state;
  }
}

interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

type ThrottledFunction<T extends (...args: unknown[]) => void> = {
  (...args: Parameters<T>): void;
};

const SWIPE_CONFIG = {
  minDistance: 50,
  maxTime: 300,
  minVelocity: 0.3,
} as const;

const MODAL_SIZES = {
  expanded: {
    width: 'max-w-[95vw] md:max-w-4xl lg:max-w-5xl',
    height: 'h-[85vh]',
  },
  normal: {
    width: 'max-w-[90vw] md:max-w-2xl lg:max-w-3xl',
    height: 'h-[70vh] md:h-[60vh] lg:h-[50vh]',
  },
} as const;

const TRANSITION_DURATION = 300;
const SCROLL_THROTTLE = 100;
const RESIZE_DEBOUNCE = 100;

const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };

  debouncedFn.cancel = () => clearTimeout(timeoutId);

  return debouncedFn;
};

const throttle = <T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): ThrottledFunction<T> => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      fn(...args);
      lastCall = now;
    }
  };
};

const Modal = memo<ModalProps>(({
  isOpen,
  onClose,
  content,
  title,
  onNext,
  onPrevious,
  totalPages = 1,
  currentPage = 0,
  showNavigation = true,
  isExpanded,
  onToggleExpand,
  triggerOverflowCheck,
  className = '',
  contentClassName = '',
  closeOnEscape = true,
  closeOnOutsideClick = true,
  initialFocus = 'close',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  const [state, dispatch] = useReducer(modalReducer, initialState);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isTouchDevice = useMediaQuery('(pointer: coarse)');

  useLockedBody(isOpen);

  const memoizedThrottle = useCallback(throttle, []);
  const memoizedDebounce = useCallback(debounce, []);

  const modalSize = useMemo(
    () => (isExpanded ? MODAL_SIZES.expanded : MODAL_SIZES.normal),
    [isExpanded]
  );

  const isNavigationEnabled = useMemo(
    () => showNavigation && totalPages > 1 && !isTouchDevice,
    [showNavigation, totalPages, isTouchDevice]
  );

  const handleOutsideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnOutsideClick) return;
      
      const target = e.target as HTMLElement;
      if (target.dataset.testid === 'modal-overlay') {
        onClose();
      }
    },
    [closeOnOutsideClick, onClose]
  );

  const checkContentOverflow = useCallback(() => {
    if (contentRef.current) {
      const isOverflowing =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
      dispatch({ type: 'SET_OVERFLOW', payload: isOverflowing });
      if (!state.hasInteracted) {
        dispatch({ type: 'SET_SCROLL_INDICATOR', payload: isOverflowing });
      }
    }
  }, [state.hasInteracted]);

  const handleScroll = useMemo(
    () =>
      memoizedThrottle(() => {
        if (contentRef.current?.scrollTop && contentRef.current.scrollTop > 0) {
          dispatch({ type: 'SET_SCROLL_INDICATOR', payload: false });
          dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
        }
      }, SCROLL_THROTTLE),
    [memoizedThrottle]
  );

  const preventScrollPropagation = useCallback((e: WheelEvent) => {
    if (!contentRef.current) return;

    const { deltaY } = e;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isScrollingUp = deltaY < 0;
    const isScrollingDown = deltaY > 0;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;

    if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
      e.preventDefault();
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    dispatch({
      type: 'SET_TOUCH_START',
      payload: {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      },
    });
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const { x: startX, y: startY, time: startTime } = state.touchStart;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - startX;
      const deltaY = touchEndY - startY;
      const deltaTime = touchEndTime - startTime;
      const velocity = Math.abs(deltaX) / deltaTime;

      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_CONFIG.minDistance &&
        deltaTime < SWIPE_CONFIG.maxTime &&
        velocity > SWIPE_CONFIG.minVelocity
      ) {
        if (deltaX > 0 && onPrevious) {
          onPrevious();
          dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
          dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
        } else if (deltaX < 0 && onNext) {
          onNext();
          dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
          dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
        }
      }
    },
    [state.touchStart, onNext, onPrevious]
  );

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          if (onNext) {
            onNext();
            dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
            dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
          }
          break;
        case 'ArrowLeft':
          if (onPrevious) {
            onPrevious();
            dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
            dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
          }
          break;
        case 'Escape':
          if (closeOnEscape) {
            onClose();
          }
          break;
        default:
          break;
      }
    },
    [onNext, onPrevious, onClose, closeOnEscape]
  );

  const focusTrap = useCallback((e: globalThis.KeyboardEvent) => {
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', focusTrap);

    const timer = setTimeout(() => {
      switch (initialFocus) {
        case 'content': {
          contentRef.current?.focus();
          break;
        }
        case 'expand': {
          expandButtonRef.current?.focus();
          break;
        }
        case 'close':
        default: {
          const closeBtn = closeButtonRef.current;
          if (closeBtn && !closeBtn.hasAttribute('disabled')) {
            closeBtn.focus();
          } else {
            modalRef.current?.focus();
          }
          break;
        }
      }
    }, TRANSITION_DURATION);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', focusTrap);
      clearTimeout(timer);
    };
  }, [isOpen, handleKeyDown, focusTrap, initialFocus]);

  useEffect(() => {
    const modalContent = contentRef.current;
    if (!modalContent) return;

    modalContent.addEventListener('wheel', preventScrollPropagation, { passive: false });
    return () => modalContent.removeEventListener('wheel', preventScrollPropagation);
  }, [preventScrollPropagation]);

  const debouncedCheckContentOverflow = useMemo(
    () => memoizedDebounce(checkContentOverflow, RESIZE_DEBOUNCE),
    [checkContentOverflow, memoizedDebounce]
  );

  useResizeObserver(contentRef, debouncedCheckContentOverflow);

  useEffect(() => {
    if (!isOpen) return;

    debouncedCheckContentOverflow();
    return () => debouncedCheckContentOverflow.cancel();
  }, [isOpen, currentPage, isExpanded, triggerOverflowCheck, debouncedCheckContentOverflow]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!isOpen || !modalElement || !isTouchDevice) return;

    modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isTouchDevice, handleTouchStart, handleTouchEnd]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto overflow-hidden"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        data-testid="modal-content"
        className={`relative w-full ${modalSize.width} ${modalSize.height} 
          flex flex-col bg-base-100 rounded-lg shadow-xl 
          ${prefersReducedMotion ? '' : 'transition-all duration-300'} 
          p-4 sm:p-6 lg:p-8 ${className}`}
        tabIndex={-1}
      >
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-semibold text-center flex-grow"
          >
            {title}
          </h2>

          <Suspense fallback={<div className="w-6 h-6" />}>
            <ExpandButton
              ref={expandButtonRef}
              isExpanded={isExpanded}
              onClick={onToggleExpand}
            />
          </Suspense>
        </div>

        {isNavigationEnabled && (
          <Suspense fallback={null}>
            <NavigationButtons
              onPrevious={() => {
                onPrevious?.();
                dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
                dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
              }}
              onNext={() => {
                onNext?.();
                dispatch({ type: 'SET_NAVIGATION_HINT', payload: false });
                dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
              }}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        )}

        <div
          ref={contentRef}
          className={`p-6 pb-10 flex-grow overflow-y-auto relative scroll-smooth
            ${contentClassName}`}
          onScroll={handleScroll}
          role="region"
          aria-label="Modal content"
          tabIndex={0}
        >
          {content}

          {state.isContentOverflowing && state.scrollIndicatorVisible && (
            <Suspense fallback={null}>
              <ScrollIndicator
                prefersReducedMotion={prefersReducedMotion}
                message="Scroll down to see more"
              />
            </Suspense>
          )}
        </div>

        <div className="p-4 border-t border-base-300 flex justify-end space-x-2">
          <button
            ref={closeButtonRef}
            className="btn btn-sm btn-neutral"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {showNavigation && state.showNavigationHint && totalPages > 1 && (
          <div
            className="absolute bottom-2 left-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm text-info">
              {isTouchDevice
                ? 'Swipe left or right to navigate'
                : 'Use ← → arrow keys to navigate'}
            </span>
          </div>
        )}

        {totalPages > 1 && (
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex space-x-2"
            role="navigation"
            aria-label={`Page ${currentPage + 1} of ${totalPages}`}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200
                  ${currentPage === index ? 'bg-info' : 'bg-neutral-content'}`}
                role="tab"
                aria-selected={currentPage === index}
                aria-label={`Page ${index + 1}`}
                tabIndex={-1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
