import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TechnologyCard from '../../../pages/AboutThisSite/TechnologyCard';
import '@testing-library/jest-dom';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('TechnologyCard', () => {
  const defaultProps = {
    icon: <MockIcon />,
    title: 'React',
    description: 'A JavaScript library for building user interfaces.',
    link: 'https://reactjs.org/',
  };

  let container: HTMLElement;

  beforeEach(() => {
    cleanup();
    const result = render(<TechnologyCard {...defaultProps} />);
    container = result.container;
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders all required elements', () => {
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeInTheDocument();
      expect(container.querySelector('h3')).toHaveTextContent(defaultProps.title);
      expect(container.querySelector('p')).toHaveTextContent(defaultProps.description);
    });

    it('matches snapshot', () => {
      expect(container).toMatchSnapshot();
    });
  });

  describe('Structure', () => {
    it('maintains proper content structure', () => {
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toContainElement(container.querySelector('h3'));
      expect(link).toContainElement(container.querySelector('p'));
      expect(link).toContainElement(container.querySelector('[data-testid="mock-icon"]'));
    });
  });

  describe('Interactions', () => {
    it('opens link in new tab when clicked', () => {
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('href', defaultProps.link);
    });

    it('has security attributes for external link', () => {
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible name for the link', () => {
      const link = container.querySelector('a');
      expect(link).toHaveAccessibleName(`Learn more about ${defaultProps.title}`);
    });

    it('hides decorative icon from screen readers', () => {
      const iconWrapper = container.querySelector('[data-testid="mock-icon"]')?.closest('[aria-hidden="true"]');
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('is keyboard focusable', () => {
      const link = container.querySelector('a');
      if (link) {
        link.focus();
        expect(link).toHaveFocus();
      }
    });
  });
});
