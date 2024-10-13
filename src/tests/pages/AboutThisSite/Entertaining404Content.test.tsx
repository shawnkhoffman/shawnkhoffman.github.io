import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Entertaining404Content from '../../../pages/AboutThisSite/Entertaining404Content';
import '@testing-library/jest-dom';

vi.mock('../../../pages/404', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-not-found">Mock NotFound Component</div>,
}));

describe('Entertaining404Content', () => {
  let renderResult: ReturnType<typeof render>;

  beforeEach(() => {
    cleanup();
    renderResult = render(<Entertaining404Content />);
  });

  afterEach(() => {
    cleanup();
    renderResult.unmount();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('renders the NotFound component', () => {
      expect(screen.getByTestId('mock-not-found')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('matches the snapshot', () => {
      expect(renderResult.container.firstChild).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark structure', () => {
      expect(screen.getByRole('region', { name: '404 Content' })).toBeInTheDocument();
    });

    it('ensures content is readable', () => {
      expect(screen.getByText(/404 page was designed/)).toBeInTheDocument();
    });
  });
});
