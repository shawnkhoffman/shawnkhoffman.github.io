import React, { forwardRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaExpand, FaCompress } from 'react-icons/fa';

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  prefersReducedMotion: boolean;
}

interface ScrollIndicatorProps {
  prefersReducedMotion: boolean;
  message: string;
}

const ICON_CLASSES = {
  base: 'transition-all duration-200',
  expandButton: 'text-xl p-2 hover:text-info focus:text-info',
  chevron: 'text-5xl',
  scrollIndicator: 'text-xl text-info',
} as const;

const BUTTON_CLASSES = {
  navigation: `absolute top-1/2 transform -translate-y-1/2 p-2 
    text-neutral-content hover:text-info focus:text-info focus:outline-none 
    focus:ring-2 focus:ring-info rounded-lg hidden md:block
    transition-colors duration-200`,
  expand: `text-xl p-2 hover:text-info focus:text-info focus:outline-none 
    focus:ring-2 focus:ring-info rounded-lg transition-colors duration-200`,
} as const;

const ExpandButton = forwardRef<HTMLButtonElement, ExpandButtonProps>(
  ({ isExpanded, onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={BUTTON_CLASSES.expand}
      aria-label={isExpanded ? 'Compress modal' : 'Expand modal'}
      title={isExpanded ? 'Compress modal' : 'Expand modal'}
    >
      {isExpanded ? (
        <FaCompress
          className={ICON_CLASSES.base}
          aria-hidden="true"
        />
      ) : (
        <FaExpand
          className={ICON_CLASSES.base}
          aria-hidden="true"
        />
      )}
    </button>
  )
);

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  prefersReducedMotion,
}) => {
  const animationClass = prefersReducedMotion ? '' : 'hover:scale-110 transition-transform';

  return (
    <>
      <button
        className={`${BUTTON_CLASSES.navigation} -translate-x-16 left-0`}
        onClick={onPrevious}
        aria-label="Previous page"
        title="Previous page"
      >
        <FaChevronLeft
          className={`${ICON_CLASSES.chevron} ${animationClass}`}
          aria-hidden="true"
        />
      </button>
      <button
        className={`${BUTTON_CLASSES.navigation} translate-x-16 right-0`}
        onClick={onNext}
        aria-label="Next page"
        title="Next page"
      >
        <FaChevronRight
          className={`${ICON_CLASSES.chevron} ${animationClass}`}
          aria-hidden="true"
        />
      </button>
    </>
  );
};

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  prefersReducedMotion,
  message,
}) => (
  <div 
    className="absolute bottom-2 right-2 bg-base-200/90 p-2 rounded-lg 
      flex items-center space-x-2 shadow-lg backdrop-blur-sm
      transition-opacity duration-200 hover:opacity-100"
    role="status"
    aria-live="polite"
  >
    <FaChevronDown
      className={`${ICON_CLASSES.scrollIndicator} ${
        prefersReducedMotion ? '' : 'animate-bounce'
      }`}
      aria-hidden="true"
    />
    <span className="text-sm font-medium text-info">
      {message}
    </span>
  </div>
);

ExpandButton.displayName = 'ExpandButton';
NavigationButtons.displayName = 'NavigationButtons';
ScrollIndicator.displayName = 'ScrollIndicator';

const ModalIcons = {
  ExpandButton,
  NavigationButtons,
  ScrollIndicator,
  default: () => null,
};

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export type ModalIconsType = typeof ModalIcons;

export { ExpandButton, NavigationButtons, ScrollIndicator };

export default ModalIcons;
