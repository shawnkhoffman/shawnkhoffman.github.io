import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CareerTimeline from '../../../pages/About/CareerTimeline';

describe('CareerTimeline', () => {
  describe('Rendering', () => {
    it('matches snapshot', () => {
      const { container } = render(<CareerTimeline />);
      expect(container).toMatchSnapshot();
    });

    it('renders timeline container with items', () => {
      render(<CareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      const items = within(timeline).getAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('Structure', () => {
    it('maintains proper document outline', () => {
      render(<CareerTimeline />);
      const mainHeading = screen.getAllByRole('heading', { level: 2 })[0];
      const itemHeadings = screen.getAllByRole('heading', { level: 3 });
      
      expect(mainHeading).toHaveTextContent('Career Timeline');
      expect(itemHeadings.length).toBeGreaterThan(0);
    });

    it('renders each timeline item with required elements', () => {
      render(<CareerTimeline />);
      const items = screen.getAllByRole('listitem');
      
      items.forEach(item => {
        const time = within(item).getByRole('time');
        const heading = within(item).getByRole('heading', { level: 3 });
        const description = within(item).getByRole('article');
        
        expect(time).toBeInTheDocument();
        expect(heading).toBeInTheDocument();
        expect(description).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides semantic timeline structure', () => {
      render(<CareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      
      expect(timeline).toHaveAttribute('aria-label', 'Career Timeline');
      expect(timeline).toHaveClass('timeline', 'timeline-vertical');
    });

    it('maintains proper content order for screen readers', () => {
      render(<CareerTimeline />);
      const items = screen.getAllByRole('listitem');
      
      items.forEach(item => {
        const time = within(item).getByRole('time');
        const heading = within(item).getByRole('heading', { level: 3 });
        const description = within(item).getByRole('article');
        
        expect(time.compareDocumentPosition(heading))
          .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
        expect(heading.compareDocumentPosition(description))
          .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      });
    });

    it('ensures all content remains visible and readable', () => {
      render(<CareerTimeline />);
      const timeline = screen.getAllByRole('list', { name: 'Career Timeline' })[0];
      const items = within(timeline).getAllByRole('listitem');
      
      items.forEach(item => {
        expect(item).toBeVisible();
        expect(item).toHaveAttribute('tabindex', '0');
      });
    });
  });
});
