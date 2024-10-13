import { fireEvent, cleanup, within } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import CollapsibleSection from '../../../pages/AboutThisSite/CollapsibleSection';
import { render } from '../../utils/test-utils';
import { TEST_IDS } from '../../utils/test-constants';

describe('CollapsibleSection', () => {
  const mockProps = {
    title: 'Section Title',
    content: 'This is the collapsible content.',
    testId: TEST_IDS.COLLAPSIBLE_SECTION
  };

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('matches snapshot', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Structure', () => {
    it('contains required elements', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      const section = container.firstChild as HTMLElement;
      const titleElement = within(section).getByText(mockProps.title);
      const contentElement = within(section).getByText(mockProps.content);
      
      expect(titleElement).toBeInTheDocument();
      expect(contentElement).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('toggles content visibility on click', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('maintains correct ARIA states', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      const content = section.querySelector('[role="region"]');
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(content).toHaveAttribute('aria-hidden', 'true');
      
      fireEvent.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(content).toHaveAttribute('aria-hidden', 'false');
    });

    it('maintains tab order', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      
      expect(button).toHaveAttribute('tabindex', '0');
    });

    it('supports screen readers', () => {
      const { container } = render(<CollapsibleSection {...mockProps} />, { withLayout: false });
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      const content = section.querySelector('[role="region"]');
      
      expect(button).toHaveAttribute('aria-controls');
      expect(content).toHaveAttribute('role', 'region');
    });
  });
});
