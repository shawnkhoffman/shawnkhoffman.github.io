import React from 'react';
import { TEST_IDS } from './test-constants';
import { vi } from 'vitest';

export const MockModal = vi.fn(({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  onNext, 
  onPrevious, 
  onToggleExpand, 
  isExpanded 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
}) => 
  isOpen ? (
    <div data-testid={TEST_IDS.MODAL} className={isExpanded ? 'expanded' : ''}>
      <h2>{title}</h2>
      <div>{content}</div>
      {onPrevious && <button onClick={onPrevious}>Previous</button>}
      {onNext && <button onClick={onNext}>Next</button>}
      <button onClick={onClose}>Close</button>
      <button onClick={onToggleExpand}>
        {isExpanded ? 'Compress Modal' : 'Expand Modal'}
      </button>
    </div>
  ) : null
);

export const MockTechnologyCard = vi.fn(({ 
  icon, 
  title, 
  description, 
  link 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    data-testid={TEST_IDS.TECHNOLOGY_CARD}
    className="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300"
    aria-label={`Learn more about ${title}`}
  >
    <span aria-hidden="true">{icon}</span>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm">{description}</p>
  </a>
));
