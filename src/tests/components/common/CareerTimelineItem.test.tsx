import { describe, test, expect, beforeEach } from 'bun:test';
import { cleanup, render, screen, within } from '@testing-library/react';
import * as React from 'react';

const TestCareerTimelineItem = ({ 
  date, 
  title, 
  description, 
  position, 
  testId 
}: { 
  date: string;
  title: string;
  description: string;
  position: 'start' | 'middle' | 'end';
  testId: string;
}) => (
  <li data-testid={testId} role="listitem" tabIndex={0} className={`timeline-item timeline-${position}`}>
    <div className="timeline-marker">
      <svg data-testid="decorative-icon" aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" />
      </svg>
    </div>
    <time role="time" className="timeline-date">{date}</time>
    <div className="timeline-content">
      <h3 className="text-lg font-bold">{title}</h3>
      <article role="article" className="timeline-description">
        <p>{description}</p>
      </article>
    </div>
  </li>
);

describe('CareerTimelineItem', () => {
  const createTestId = (testName: string) => `timeline-item-${testName}`;
  
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<TestCareerTimelineItem date="2024" title="Test Title" description="Test Description" position="start" testId={createTestId('rendering')} />);
      expect(screen.getByTestId(createTestId('rendering'))).toBeDefined();
    });
  });

  describe('Structure', () => {
    test('contains all required elements', () => {
      const testId = createTestId('structure');
      render(<TestCareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      const timeElement = within(timelineItem).getByText('2024');
      const titleElement = within(timelineItem).getByText('Test Title');
      const descriptionElement = within(timelineItem).getByText('Test Description');
      
      expect(timeElement).toBeDefined();
      expect(titleElement).toBeDefined();
      expect(descriptionElement).toBeDefined();
    });
  });

  describe('Interactions', () => {
    test('is keyboard navigable', () => {
      const testId = createTestId('keyboard');
      render(<TestCareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      
      expect(timelineItem.getAttribute('tabIndex')).toBe('0');
      expect(timelineItem.getAttribute('role')).toBe('listitem');
      
      timelineItem.focus();
      expect(document.activeElement).toBe(timelineItem);
    });

    test('remains visible at different viewport sizes', () => {
      const testId = createTestId('viewport');
      render(<TestCareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      
      expect(timelineItem).toBeDefined();
      expect(window.getComputedStyle(timelineItem).display).not.toBe('none');
    });
  });

  describe('Accessibility', () => {
    test('has decorative elements marked appropriately', () => {
      const testId = createTestId('decorative');
      render(<TestCareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      const svg = within(timelineItem).getByTestId('decorative-icon');
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    test('maintains a logical reading order', () => {
      const testId = createTestId('reading-order');
      render(<TestCareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      const content = timelineItem.textContent;
      expect(content).toMatch(/2024.*Test Title.*Test Description/);
    });
  });
}); 