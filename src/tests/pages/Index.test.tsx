import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Index from '../../pages/Index';
import '@testing-library/jest-dom';

vi.mock('../../assets/images/react.svg', () => ({
  default: 'mocked-react.svg'
}));

vi.mock('react-icons/fa', () => ({
  FaGithub: () => <svg data-testid="fa-github" />
}));

describe('Index Component', () => {
  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders the component with all elements', () => {
    render(<Index />);

    const logo = screen.getByAltText('React Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-react.svg');
    expect(logo).toHaveClass('animate-spinSlow', 'w-32', 'h-32', 'mb-8', 'dark:shadow-none');

    const heading = screen.getByRole('heading', { name: /Welcome to My Portfolio/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'mb-2');

    const paragraph = screen.getByText(/Built in React/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('text-lg', 'mb-6');

    const githubLink = screen.getByRole('link', {
      name: /View the source code of this portfolio on GitHub/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/shawnkhoffman/shawnkhoffman.github.io'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveClass('btn', 'btn-sm', 'btn-ghost', 'mt-4');

    const githubIcon = screen.getByTestId('fa-github');
    expect(githubIcon).toBeInTheDocument();

    const srOnlySpan = screen.getByText('View Source Code', { selector: 'span.sr-only' });
    expect(srOnlySpan).toBeInTheDocument();
    expect(srOnlySpan).toHaveClass('sr-only');
  });

  it('calls window.gtag with correct parameters when GitHub link is clicked', () => {
    render(<Index />);

    const githubLink = screen.getByRole('link', {
      name: /View the source code of this portfolio on GitHub/i,
    });

    fireEvent.click(githubLink);

    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'GitHub Source Code',
    });
  });

  it('renders the component with correct layout', () => {
    const { container } = render(<Index />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'justify-center', 'items-center', 'text-center');
  });
});