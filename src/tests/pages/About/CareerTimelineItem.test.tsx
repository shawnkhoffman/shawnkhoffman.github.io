import { cleanup, render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CareerTimelineItem from '@/pages/About/CareerTimelineItem';

describe('CareerTimelineItem', () => {
  const createTestId = (testName: string) => `timeline-item-${testName}`;
  
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CareerTimelineItem date="2024" title="Test Title" description="Test Description" position="start" testId={createTestId('rendering')} />);
      expect(screen.getByTestId(createTestId('rendering'))).toBeInTheDocument();
    });

    it('matches snapshot', () => {
      const { container } = render(<CareerTimelineItem date="2024" title="Test Title" description="Test Description" position="start" testId={createTestId('snapshot')} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Structure', () => {
    it('contains all required elements', () => {
      const testId = createTestId('structure');
      render(<CareerTimelineItem 
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
      
      expect(timeElement).toBeInTheDocument();
      expect(titleElement).toBeInTheDocument();
      expect(descriptionElement).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('is keyboard navigable', () => {
      const testId = createTestId('keyboard');
      render(<CareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      
      expect(timelineItem).toHaveAttribute('tabIndex', '0');
      expect(timelineItem).toHaveAttribute('role', 'listitem');
      
      timelineItem.focus();
      expect(timelineItem).toHaveFocus();
    });

    it('remains visible at different viewport sizes', () => {
      const testId = createTestId('viewport');
      render(<CareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      expect(timelineItem).toBeVisible();
      
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));
      expect(timelineItem).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('has decorative elements marked appropriately', () => {
      const testId = createTestId('decorative');
      render(<CareerTimelineItem 
        date="2024"
        title="Test Title"
        description="Test Description"
        position="start"
        testId={testId}
      />);
      
      const timelineItem = screen.getByTestId(testId);
      const svg = within(timelineItem).getByTestId('decorative-icon');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('maintains a logical reading order', () => {
      const testId = createTestId('reading-order');
      render(<CareerTimelineItem 
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
