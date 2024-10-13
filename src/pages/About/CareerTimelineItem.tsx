import React from 'react';

export interface CareerTimelineItemProps {
  date: string;
  title: string;
  description: string;
  position: 'start' | 'end';
  testId?: string;
}

const CareerTimelineItem: React.FC<CareerTimelineItemProps> = ({ 
  date, 
  title, 
  description, 
  position,
  testId = 'timeline-item'
}) => {
  return (
    <li 
      data-testid={testId}
      tabIndex={0}
      role="listitem"
    >
      <div className="timeline-middle">
        <svg
          data-testid="decorative-icon"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={`timeline-${position} mb-10 md:text-${position === 'start' ? 'end' : 'start'}`}>
        <time className="font-mono italic">{date}</time>
        <h3 className="text-lg font-black">{title}</h3>
        <p role="article">{description}</p>
      </div>
      <hr />
    </li>
  );
};

export default CareerTimelineItem;
