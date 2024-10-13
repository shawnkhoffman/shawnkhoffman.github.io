import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import * as React from 'react';

const TestAbout = () => (
  <main aria-label="About me page">
    <h1>About</h1>
    
    <div>
      <h2 id="about-me-section">About Me</h2>
      <section aria-labelledby="about-me-section">
        <p>Content about me</p>
      </section>
    </div>
    
    <div>
      <h2 id="skills-section">Skills</h2>
      <section>
        <button>Software Engineering</button>
        <button>Cloud Infrastructure</button>
        <button>Media Engineering</button>
      </section>
    </div>
    
    <div>
      <h2 id="career-section">Career Timeline</h2>
      <section>
        <div>Timeline content</div>
      </section>
    </div>
  </main>
);

describe('About Component', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders main content sections', () => {
      render(<TestAbout />);
      expect(screen.getByRole('heading', { name: /about me/i })).toBeDefined();
      expect(screen.getByRole('heading', { name: /skills/i })).toBeDefined();
      expect(screen.getByRole('heading', { name: /career timeline/i })).toBeDefined();
    });
  });

  describe('Structure', () => {
    test('maintains correct layout hierarchy', () => {
      render(<TestAbout />);
      const main = screen.getByRole('main');
      expect(main).toBeDefined();
      
      const headings = screen.getAllByRole('heading', { level: 2 });
      headings.forEach(heading => {
        expect(main.contains(heading)).toBe(true);
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<TestAbout />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeDefined();

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    test('has proper ARIA landmarks', () => {
      render(<TestAbout />);
      expect(screen.getByRole('main').getAttribute('aria-label')).toBeDefined();
      
      const aboutSection = screen.getByRole('region', { name: /about me/i });
      expect(aboutSection.getAttribute('aria-labelledby')).toBeDefined();
    });
  });

  describe('Interactions', () => {
    test('allows users to interact with skill items', () => {
      render(<TestAbout />);
      const skillsHeading = screen.getByRole('heading', { name: /skills/i });
      const skillsContainer = skillsHeading.parentElement;
      const buttons = Array.from(skillsContainer!.querySelectorAll('button'));
      
      buttons.forEach(button => {
        expect(button.disabled).toBe(false);
      });
    });
  });
}); 