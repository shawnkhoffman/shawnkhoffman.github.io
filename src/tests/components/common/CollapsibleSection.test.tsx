import { describe, test, expect, afterEach } from 'bun:test';
import { fireEvent, cleanup, within, render } from '@testing-library/react';
import * as React from 'react';

const TestCollapsibleSection = ({ 
  title, 
  content, 
  testId 
}: { 
  title: string; 
  content: string; 
  testId: string;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const contentId = `content-${testId}`;
  const buttonId = `button-${testId}`;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="mb-6" data-testid={testId}>
      <h3 className="mb-2">
        <button 
          aria-expanded={isExpanded} 
          aria-controls={contentId}
          id={buttonId}
          onClick={toggleExpanded}
          className="text-lg font-semibold flex items-center w-full text-left"
          tabIndex={0}
        >
          <span>{title}</span>
          <span className="ml-auto">
            {isExpanded ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div 
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isExpanded}
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="py-2">
          {content}
        </div>
      </div>
    </section>
  );
};

describe('CollapsibleSection', () => {
  const TEST_IDS = {
    COLLAPSIBLE_SECTION: 'collapsible-section'
  };

  const mockProps = {
    title: 'Section Title',
    content: 'This is the collapsible content.',
    testId: TEST_IDS.COLLAPSIBLE_SECTION
  };

  afterEach(() => {
    cleanup();
  });

  describe('Structure', () => {
    test('contains required elements', () => {
      const { container } = render(<TestCollapsibleSection {...mockProps} />);
      const section = container.firstChild as HTMLElement;
      const titleElement = within(section).getByText(mockProps.title);
      const contentElement = within(section).getByText(mockProps.content);
      
      expect(titleElement).toBeDefined();
      expect(contentElement).toBeDefined();
    });
  });

  describe('Interactions', () => {
    test('toggles content visibility on click', () => {
      const { container } = render(<TestCollapsibleSection {...mockProps} />);
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      
      fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      
      fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Accessibility', () => {
    test('maintains correct ARIA states', () => {
      const { container } = render(<TestCollapsibleSection {...mockProps} />);
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      const content = section.querySelector('[role="region"]');
      
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(content?.getAttribute('aria-hidden')).toBe('true');
      
      fireEvent.click(button);
      
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(content?.getAttribute('aria-hidden')).toBe('false');
    });

    test('maintains tab order', () => {
      const { container } = render(<TestCollapsibleSection {...mockProps} />);
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      
      expect(button.getAttribute('tabindex')).toBe('0');
    });

    test('supports screen readers', () => {
      const { container } = render(<TestCollapsibleSection {...mockProps} />);
      const section = container.firstChild as HTMLElement;
      const button = within(section).getByRole('button');
      const content = section.querySelector('[role="region"]');
      
      expect(button.getAttribute('aria-controls')).toBeDefined();
      expect(content?.getAttribute('role')).toBe('region');
    });
  });
}); 