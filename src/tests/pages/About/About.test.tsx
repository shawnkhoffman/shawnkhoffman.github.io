import { render, screen, cleanup, RenderResult, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from "@/pages/About/About";
import '@testing-library/jest-dom';

describe('About Component', () => {
  let component: RenderResult;

  beforeEach(() => {
    cleanup();
    component = render(<About />);
  });

  afterEach(() => {
    component.unmount();
    cleanup();
  });

  describe('Rendering', () => {
    it('renders main content sections', () => {
      expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /career timeline/i })).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('maintains correct layout hierarchy', () => {
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      const headings = screen.getAllByRole('heading', { level: 2 });
      headings.forEach(heading => {
        expect(main).toContainElement(heading);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('has proper ARIA landmarks', () => {
      expect(screen.getByRole('main')).toHaveAttribute('aria-label');
      
      const aboutSection = screen.getByRole('region', { name: /about me/i });
      expect(aboutSection).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Interactions', () => {
    it('allows users to interact with skill items', async () => {
      const skillsHeading = screen.getByRole('heading', { name: /skills/i });
      const skillsContainer = skillsHeading.parentElement;
      const buttons = within(skillsContainer!).getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toBeEnabled();
      });
    });
  });
});
