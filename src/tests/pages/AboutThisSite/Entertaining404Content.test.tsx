import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Entertaining404Content from '../../../pages/AboutThisSite/Entertaining404Content';
import '@testing-library/jest-dom';

vi.mock('../../../pages/404', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-not-found">Mock NotFound Component</div>,
}));

describe('Entertaining404Content', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the descriptive paragraph', () => {
    render(<Entertaining404Content />);
    
    const paragraphText = /The 404 page was designed to add a touch of humor and personality to an otherwise frustrating experience./i;
    expect(screen.getByText(paragraphText)).toBeInTheDocument();
  });

  it('renders the NotFound component', () => {
    render(<Entertaining404Content />);
    
    const notFoundElement = screen.getByTestId('mock-not-found');
    expect(notFoundElement).toBeInTheDocument();
    expect(notFoundElement).toHaveTextContent('Mock NotFound Component');
  });

  it('matches the snapshot', () => {
    const { container } = render(<Entertaining404Content />);
    
    expect(container).toMatchSnapshot();
  });
});