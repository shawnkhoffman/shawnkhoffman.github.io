import React, { useState, useId } from 'react';

interface CollapsibleSectionProps {
  title: string;
  content: string;
  testId?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  content,
  testId = 'collapsible-section'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const contentId = `collapsible-content-${uniqueId}`;

  const handleToggle = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsOpen(prev => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(event);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    event.preventDefault();
    handleToggle(event);
  };

  return (
    <div
      data-testid={testId}
      className={`collapse collapse-arrow bg-base-200 ${isOpen ? 'collapse-open' : ''}`}
    >
      <button
        type="button"
        className="collapse-title text-xl font-medium"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        {title}
      </button>
      <div
        id={contentId}
        className="collapse-content"
        role="region"
        aria-hidden={!isOpen}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default CollapsibleSection;
