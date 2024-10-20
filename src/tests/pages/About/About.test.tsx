import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import About from '../../../pages/About/About';
import '@testing-library/jest-dom';

vi.mock('../../../pages/About/Introduction', () => ({
  default: () => <div data-testid="introduction">Introduction Component</div>,
}));

vi.mock('../../../pages/About/Skills', () => ({
  default: () => <div data-testid="skills">Skills Component</div>,
}));

vi.mock('../../../pages/About/CareerTimeline', () => ({
  default: () => <div data-testid="career-timeline">Career Timeline Component</div>,
}));

describe('About Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the About section with Introduction, Skills, and Timeline components', () => {
    render(<About />);

    const mainElement = screen.getByRole('main', { name: 'About Section' });
    expect(mainElement).toBeInTheDocument();

    expect(screen.getByTestId('introduction')).toBeInTheDocument();
    expect(screen.getByTestId('skills')).toBeInTheDocument();
    expect(screen.getByTestId('career-timeline')).toBeInTheDocument();

    expect(screen.getByText('Introduction Component')).toBeInTheDocument();
    expect(screen.getByText('Skills Component')).toBeInTheDocument();
    expect(screen.getByText('Career Timeline Component')).toBeInTheDocument();
  });

  it('renders the About section with the correct structure', () => {
    const { container } = render(<About />);
    
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-base-200', 'p-6');
    expect(mainElement).toHaveAttribute('role', 'main');
    expect(mainElement).toHaveAttribute('aria-label', 'About Section');

    const children = mainElement?.children;
    expect(children?.[0]).toHaveAttribute('data-testid', 'introduction');
    expect(children?.[1]).toHaveAttribute('data-testid', 'skills');
    expect(children?.[2]).toHaveAttribute('data-testid', 'career-timeline');
  });
});