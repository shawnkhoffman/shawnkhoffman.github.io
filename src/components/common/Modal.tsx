import React, { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';

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
  showScrollIndicator?: boolean;
  isMobile?: boolean;
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
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [showNavigationHint, setShowNavigationHint] = useState(true);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const checkContentOverflow = () => {
    if (contentRef.current) {
      setIsContentOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop > 0 || scrollTop + clientHeight >= scrollHeight) {
        setIsContentOverflowing(false);
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX.current - touchEndX;
      if (diffX > 50) {
        onNext && onNext();
      } else if (diffX < -50) {
        onPrevious && onPrevious();
      }
      touchStartX.current = null;
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
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(checkContentOverflow, 100);
      setShowNavigationHint(true);

      if (isMobile) {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
      }
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, isMobile]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-[70vh] md:h-[60vh] lg:h-[50vh] flex flex-col bg-base-100 rounded-lg shadow-xl"
      >
        <div className="p-4 border-b border-base-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-center">{title}</h2>
        </div>

        {showNavigation && totalPages > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious && onPrevious();
                setShowNavigationHint(false);
              }}
              aria-label="Previous"
            >
              <FaChevronLeft className="text-5xl" />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 p-2 text-5xl text-neutral-content hover:text-info hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                onNext && onNext();
                setShowNavigationHint(false);
              }}
              aria-label="Next"
            >
              <FaChevronRight className="text-5xl" />
            </button>
          </>
        )}

        <div ref={contentRef} className="p-6 flex-grow overflow-y-auto relative" onScroll={handleScroll}>
          {content}

          {isContentOverflowing && (
            <div className="absolute bottom-2 right-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
              <FaChevronDown className="animate-bounce text-xl text-info" />
              <span className="text-sm text-info">Scroll down to see more</span>
            </div>
          )}
        </div>

        {showNavigation && showNavigationHint && totalPages > 1 && !isMobile && (
          <div className="absolute bottom-2 left-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2">
            <span className="text-sm text-info">Use ← → arrow keys to navigate</span>
          </div>
        )}

        <div className="p-4 border-t border-base-300 flex justify-end">
          <button className="btn btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        {totalPages > 1 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${currentPage === index ? 'bg-info' : 'bg-neutral-content'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;