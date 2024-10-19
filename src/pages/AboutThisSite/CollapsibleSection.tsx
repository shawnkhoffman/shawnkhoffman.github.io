import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  content: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <button
        className="collapse-title text-xl font-medium"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggleCollapse}
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