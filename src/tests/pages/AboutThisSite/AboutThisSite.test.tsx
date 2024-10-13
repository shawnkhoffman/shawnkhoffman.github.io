import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutThisSite from '../../../pages/AboutThisSite/AboutThisSite';

vi.mock('../../../components/common/Modal', () => ({
  default: ({ isOpen, content }: { isOpen: boolean; content: React.ReactNode }) => 
    isOpen ? <div data-testid="modal">{content}</div> : null
}));

vi.mock('../../../pages/AboutThisSite/TechnologyCard', () => ({
  default: ({ title }: { title: string }) => 
    <div data-testid="technology-card" role="link" aria-label={`Learn more about ${title}`}>{title}</div>
}));

describe('AboutThisSite', () => {
  describe('Rendering', () => {
    it('renders the page', () => {
      const { container } = render(<AboutThisSite />);
      expect(container).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  describe('Structure', () => {
    it('contains main content sections', () => {
      render(<AboutThisSite />);
      const mainHeading = screen.getAllByRole('heading', { level: 1 })[0];
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      
      expect(mainHeading).toBeInTheDocument();
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('displays interactive elements', () => {
      render(<AboutThisSite />);
      expect(screen.getAllByRole('button')).not.toHaveLength(0);
      expect(screen.getAllByTestId('technology-card')).not.toHaveLength(0);
    });
  });

  describe('Interactions', () => {
    it('handles modal interactions', () => {
      render(<AboutThisSite />);
      
      const buttons = screen.getAllByTestId('learn-more-error-handling');
      if (buttons.length === 0) {
        throw new Error('No error handling buttons found');
      }
      
      const button = buttons[0] as HTMLButtonElement;
      if (!button) {
        throw new Error('Error handling button not found');
      }
      
      fireEvent.click(button);
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<AboutThisSite />);
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label');
        const hasTextContent = button.textContent ? button.textContent.trim().length > 0 : false;
        expect(hasAriaLabel || hasTextContent).toBe(true);
      });

      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
      });
    });
  });
});
