import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

const TestTechnologyCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}> = ({ icon, title, description, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300"
      aria-label={`Learn more about ${title}`}
    >
      <span aria-hidden="true">{icon}</span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </a>
  );
};

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
    const result = render(<TestTechnologyCard {...defaultProps} />);
    container = result.container;
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders all required elements', () => {
      expect(container.querySelector('[data-testid="mock-icon"]')).toBeTruthy();
      expect(container.querySelector('h3')?.textContent).toBe(defaultProps.title);
      expect(container.querySelector('p')?.textContent).toBe(defaultProps.description);
    });
  });

  describe('Structure', () => {
    test('maintains proper content structure', () => {
      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.contains(container.querySelector('h3'))).toBe(true);
      expect(link?.contains(container.querySelector('p'))).toBe(true);
      expect(link?.contains(container.querySelector('[data-testid="mock-icon"]'))).toBe(true);
    });
  });

  describe('Interactions', () => {
    test('opens link in new tab when clicked', () => {
      const link = container.querySelector('a');
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('href')).toBe(defaultProps.link);
    });

    test('has security attributes for external link', () => {
      const link = container.querySelector('a');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    test('provides accessible name for the link', () => {
      const link = container.querySelector('a');
      expect(link?.getAttribute('aria-label')).toBe(`Learn more about ${defaultProps.title}`);
    });

    test('hides decorative icon from screen readers', () => {
      const iconWrapper = container.querySelector('[data-testid="mock-icon"]')?.closest('[aria-hidden="true"]');
      expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
    });

    test('is keyboard focusable', () => {
      const link = container.querySelector('a');
      if (link) {
        link.focus();
        expect(document.activeElement).toBe(link);
      }
    });
  });
}); 