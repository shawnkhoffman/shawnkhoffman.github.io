import { screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from '../../../components/layout/Footer';
import { render as customRender } from '../../utils/test-utils';

describe('Footer', () => {
  beforeEach(() => {
    cleanup();
    vi.stubGlobal('gtag', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the footer with copyright and social links sections', () => {
      const { container } = customRender(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toMatchSnapshot('footer-structure');
    });
  });

  describe('Structure', () => {
    it('contains required structural elements', () => {
      const { container } = customRender(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      const copyrightText = container.querySelector('p');
      expect(copyrightText).toHaveTextContent(/©.*all rights reserved/i);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('triggers analytics event when social links are clicked', () => {
      customRender(<Footer />);
      const links = screen.getAllByRole('link');
      
      const firstLink = links[0];
      fireEvent.click(firstLink);
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', expect.any(Object));
    });
  });

  describe('Accessibility', () => {
    it('has accessible names for all interactive elements', () => {
      customRender(<Footer />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
      });
    });

    it('follows external link best practices', () => {
      customRender(<Footer />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    it('properly handles decorative elements', () => {
      customRender(<Footer />);
      const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', async () => {
      customRender(<Footer />);
      const links = screen.getAllByRole('link');
      
      links[0].focus();
      expect(document.activeElement).toBe(links[0]);
      
      links[links.length - 1].focus();
      expect(document.activeElement).toBe(links[links.length - 1]);
    });
  });
});
