import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import Index from "@/pages/Index";
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Index Component', () => {
  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the main content', () => {
      render(<Index />);
      
      expect(screen.getByRole('img', { name: 'React Logo' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /welcome to my portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view the source code/i })).toBeInTheDocument();
    });

    it('should match snapshot', () => {
      const { container } = render(<Index />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Interactions', () => {
    it('tracks GitHub link clicks', () => {
      render(<Index />);
      const link = screen.getAllByRole('link', { name: /view the source code/i })[0];
      
      fireEvent.click(link);
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'Outbound Link',
        event_label: 'GitHub Source Code',
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Index />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper aria labels', () => {
      render(<Index />);
      const link = screen.getAllByRole('link', { name: /view the source code/i })[0];
      
      expect(link).toHaveAttribute(
        'aria-label',
        'View the source code of this portfolio on GitHub'
      );
    });
  });
});
