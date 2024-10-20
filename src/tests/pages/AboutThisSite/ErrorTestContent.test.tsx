import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorTestContent from '../../../pages/AboutThisSite/ErrorTestContent';

const mockOnClose = vi.fn();

describe('ErrorTestContent', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the component with initial state and matches snapshot', () => {
    const { asFragment } = render(<ErrorTestContent onClose={mockOnClose} />);

    expect(screen.getByText((_content, element) => {
      const hasText = (node: Element | null): boolean => 
        node?.textContent?.includes('This website uses an ErrorBoundary to catch and gracefully handle unexpected errors') ?? false;
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children ?? []).every(child => !hasText(child));
      return elementHasText && childrenDontHaveText;
    })).toBeInTheDocument();

    expect(screen.getByText('Please select an error to test.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear Error' })).toBeDisabled();

    expect(asFragment()).toMatchSnapshot();
  });

  it('opens and closes the error type dropdown', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    const dropdown = screen.getByRole('button', { name: 'Network Error' });
    
    fireEvent.click(dropdown);
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    fireEvent.click(dropdown);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('selects a different error type from the dropdown', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    const dropdown = screen.getByRole('button', { name: 'Network Error' });
    
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByText('Fetch Error'));
    
    expect(dropdown).toHaveTextContent('Fetch Error');
  });

  it('simulates a network error and displays the error message', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Test' }));
    
    expect(screen.getByText('NetworkError: Failed to connect')).toBeInTheDocument();
  });

  it('simulates a fetch error and displays the error message', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Network Error' }));
    fireEvent.click(screen.getByText('Fetch Error'));
    fireEvent.click(screen.getByRole('button', { name: 'Test' }));
    
    expect(screen.getByText('Failed to fetch: Error retrieving data')).toBeInTheDocument();
  });

  it('simulates a CORS error and displays the error message', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Network Error' }));
    fireEvent.click(screen.getByText('CORS Error'));
    fireEvent.click(screen.getByRole('button', { name: 'Test' }));
    
    expect(screen.getByText('CORS error: Blocked by CORS policy')).toBeInTheDocument();
  });

  it('clears the error and displays the initial message', () => {
    render(<ErrorTestContent onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Test' }));
    expect(screen.getByText('NetworkError: Failed to connect')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'Clear Error' }));
    expect(screen.getByText('Please select an error to test.')).toBeInTheDocument();
  });

  it('matches snapshot after clearing an error', () => {
    const { asFragment } = render(<ErrorTestContent onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Test' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear Error' }));
    
    expect(asFragment()).toMatchSnapshot();
  });
});