import React, { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaExpand, FaCompress } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  totalPages?: number;
  currentPage?: number;
  showNavigation?: boolean;
  isMobile?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  triggerOverflowCheck: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  content,
  title,
  onNext,
  onPrevious,
  totalPages = 1,
  currentPage = 0,
  showNavigation = true,
  isMobile = false,
  isExpanded,
  onToggleExpand,
  triggerOverflowCheck,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [showNavigationHint, setShowNavigationHint] = useState(true);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const checkContentOverflow = () => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsContentOverflowing(isOverflowing);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop } = contentRef.current;
      if (scrollTop > 0) {
        setScrollIndicatorVisible(false);
      }
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const focusTrap = (e: KeyboardEvent) => {
    const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50 && onNext) {
      onNext();
      setShowNavigationHint(false);
    }
    if (touchEndX - touchStartX > 50 && onPrevious) {
      onPrevious();
      setShowNavigationHint(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
        setShowNavigationHint(false);
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
        setShowNavigationHint(false);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', focusTrap);
      closeButtonRef.current?.focus();
      checkContentOverflow();

      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', focusTrap);

      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onNext, onPrevious, onClose]);

  useEffect(() => {
    if (isOpen) {
      checkContentOverflow();
    }
  }, [isOpen, currentPage, isExpanded, triggerOverflowCheck]);

  useEffect(() => {
    const currentContent = contentRef.current;
    
    const observer = new ResizeObserver(() => {
      checkContentOverflow();
    });

    if (currentContent) {
      observer.observe(currentContent);
    }

    return () => {
      if (currentContent) {
        observer.unobserve(currentContent);
      }
    };
  }, [isOpen, isExpanded, currentPage, triggerOverflowCheck]);

  useEffect(() => {
    if (isOpen) {
      const modalElement = modalRef.current;
      if (modalElement) {
        modalElement.addEventListener('touchstart', handleTouchStart);
        modalElement.addEventListener('touchmove', handleTouchMove);
        modalElement.addEventListener('touchend', handleTouchEnd);
      }

      return () => {
        if (modalElement) {
          modalElement.removeEventListener('touchstart', handleTouchStart);
          modalElement.removeEventListener('touchmove', handleTouchMove);
          modalElement.removeEventListener('touchend', handleTouchEnd);
        }
      };
    }
  }, [isOpen, touchStartX, touchEndX]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pointer-events-auto"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${
          isExpanded
            ? 'max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[85vh]'
            : 'max-w-[90vw] md:max-w-2xl lg:max-w-3xl h-[70vh] md:h-[60vh] lg:h-[50vh]'
        } flex flex-col bg-base-100 rounded-lg shadow-xl transition-all duration-300 p-4 sm:p-6 lg:p-8`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold text-center flex-grow">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onToggleExpand}
            className="text-xl p-2 hover:text-info focus:outline-none"
            aria-label={isExpanded ? 'Compress modal' : 'Expand modal'}
          >
            {isExpanded ? <FaCompress aria-hidden="true" /> : <FaExpand aria-hidden="true" />}
          </button>
        </div>

        {showNavigation && totalPages > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                if (onPrevious) {
                  onPrevious();
                  setShowNavigationHint(false);
                }
              }}
              aria-label="Go to the previous page"
            >
              <FaChevronLeft className="text-5xl" aria-hidden="true" />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                if (onNext) {
                  onNext();
                  setShowNavigationHint(false);
                }
              }}
              aria-label="Go to the next page"
            >
              <FaChevronRight className="text-5xl" aria-hidden="true" />
            </button>
          </>
        )}

        <div
          ref={contentRef}
          className="p-6 pb-10 flex-grow overflow-y-auto relative"
          onScroll={handleScroll}
        >
          {content}

          {isContentOverflowing && scrollIndicatorVisible && (
            <div className="absolute bottom-2 right-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
              <FaChevronDown className="animate-bounce text-xl text-info" aria-hidden="true" />
              <span className="text-sm text-info">Scroll down to see more</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-base-300 flex justify-end">
          <button
            ref={closeButtonRef}
            className="btn btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {showNavigation && showNavigationHint && totalPages > 1 && (
          <div className="absolute bottom-2 left-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
            <span className="text-sm text-info">
              {isMobile ? 'Swipe left or right to navigate' : 'Use ← → arrow keys to navigate'}
            </span>
          </div>
        )}

        {totalPages > 1 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${currentPage === index ? 'bg-info' : 'bg-neutral-content'}`}
                aria-label={`Page ${index + 1} of ${totalPages}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;