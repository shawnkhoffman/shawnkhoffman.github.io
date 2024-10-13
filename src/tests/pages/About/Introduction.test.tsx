import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Introduction from '../../../pages/About/Introduction';
import '@testing-library/jest-dom';

describe('Introduction Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders with required elements', () => {
      const { container } = render(<Introduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');

      expect(section).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('maintains proper document structure', () => {
      const { container } = render(<Introduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');
      
      expect(heading?.parentElement).toBe(section);
      expect(paragraph?.parentElement).toBe(section);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(<Introduction />);

      const section = container.querySelector('section');
      const heading = container.querySelector('h1');

      expect(section).toHaveAttribute('aria-labelledby');
      expect(heading).toHaveAttribute('id');
      expect(section?.getAttribute('aria-labelledby')).toBe(heading?.getAttribute('id'));
    });

    it('is perceivable across different contexts', () => {
      const { container } = render(<Introduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');

      expect(section).toBeVisible();
      expect(heading).toBeVisible();
      expect(paragraph).toBeVisible();
    });
  });
});
