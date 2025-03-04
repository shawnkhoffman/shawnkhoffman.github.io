import { describe, test, expect, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';

const TestIntroduction = () => (
  <section aria-labelledby="introduction-heading" className="mb-8">
    <h1 id="introduction-heading" className="text-3xl font-bold mb-4">About Me</h1>
    <p className="text-lg">
      I'm a passionate software engineer with experience in full-stack development,
      cloud infrastructure, and media engineering. I enjoy building innovative solutions
      that solve real-world problems.
    </p>
  </section>
);

describe('Introduction Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders with required elements', () => {
      const { container } = render(<TestIntroduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');

      expect(section).toBeDefined();
      expect(heading).toBeDefined();
      expect(paragraph).toBeDefined();
    });
  });

  describe('Structure', () => {
    test('maintains proper document structure', () => {
      const { container } = render(<TestIntroduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');
      
      expect(heading?.parentElement).toBe(section);
      expect(paragraph?.parentElement).toBe(section);
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      const { container } = render(<TestIntroduction />);

      const section = container.querySelector('section');
      const heading = container.querySelector('h1');

      expect(section?.getAttribute('aria-labelledby')).toBeDefined();
      expect(heading?.getAttribute('id')).toBeDefined();
      expect(section?.getAttribute('aria-labelledby')).toBe(heading?.getAttribute('id'));
    });

    test('is perceivable across different contexts', () => {
      const { container } = render(<TestIntroduction />);
      
      const section = container.querySelector('section');
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');

      expect(section).toBeDefined();
      expect(heading).toBeDefined();
      expect(paragraph).toBeDefined();
      
      expect(window.getComputedStyle(section!).display).not.toBe('none');
      expect(window.getComputedStyle(heading!).display).not.toBe('none');
      expect(window.getComputedStyle(paragraph!).display).not.toBe('none');
    });
  });
}); 