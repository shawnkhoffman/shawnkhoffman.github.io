import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../../components/common/Modal', () => ({
  default: ({ 
    isOpen, 
    onClose, 
    title, 
    content, 
    onNext, 
    onPrevious, 
    onToggleExpand, 
    isExpanded 
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    onNext?: () => void;
    onPrevious?: () => void;
    onToggleExpand: () => void;
    isExpanded: boolean;
  }) => 
    isOpen ? (
      <div data-testid="modal" className={isExpanded ? 'expanded' : ''}>
        <h2>{title}</h2>
        <div>{content}</div>
        {onPrevious && <button onClick={onPrevious}>Previous</button>}
        {onNext && <button onClick={onNext}>Next</button>}
        <button onClick={onClose}>Close</button>
        <button onClick={onToggleExpand}>
          {isExpanded ? 'Compress Modal' : 'Expand Modal'}
        </button>
      </div>
    ) : null
}));

vi.mock('../../../pages/AboutThisSite/TechnologyCard', () => ({
  default: ({ icon, title, description, link }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
  }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="technology-card"
      className="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300"
      aria-label={`Learn more about ${title}`}
    >
      <span aria-hidden="true">{icon}</span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </a>
  )
}));

vi.mock('../../../pages/AboutThisSite/ErrorTestContent', () => ({
  default: () => <div data-testid="error-test-content">Error handling content</div>
}));

vi.mock('../../../pages/AboutThisSite/Entertaining404Content', () => ({
  default: () => <div data-testid="entertaining-404-content">404 Content</div>
}));

import AboutThisSite from '../../../pages/AboutThisSite/AboutThisSite';

describe('AboutThisSite', () => {
  const originalResizeObserver = window.ResizeObserver;
  const originalInnerWidth = window.innerWidth;

  class ResizeObserverMock implements ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor() {}
  }

  beforeEach(() => {
    window.ResizeObserver = ResizeObserverMock;
    vi.resetAllMocks();
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
  });

  it('renders without crashing and matches the snapshot', () => {
    const { container } = render(<AboutThisSite />);
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('displays all TechnologyCard components', () => {
    render(<AboutThisSite />);
    const technologyCards = screen.getAllByTestId('technology-card');
    expect(technologyCards).toHaveLength(5);
  });

  it('displays all Site Features, including "Coming Soon"', () => {
    render(<AboutThisSite />);
    const featureButtons = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page|Feature coming soon/i,
    });
    expect(featureButtons).toHaveLength(3);
  });

  it('disables the "Feature coming soon" button', () => {
    render(<AboutThisSite />);
    const comingSoonButton = screen.getByRole('button', { name: /Feature coming soon/i });
    expect(comingSoonButton).toBeDisabled();
  });

  it('enables the "Learn More" buttons and opens the modal on click', async () => {
    render(<AboutThisSite />);
    const learnMoreButtons = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page/i,
    });

    for (const button of learnMoreButtons) {
      expect(button).toBeEnabled();
      fireEvent.click(button);

      const modal = await screen.findByTestId('modal');
      expect(modal).toBeInTheDocument();

      const modalTitle = within(modal).getByRole('heading', { level: 2 });
      expect(modalTitle).toBeInTheDocument();

      const closeModalButton = within(modal).getByRole('button', { name: /Close/i });
      fireEvent.click(closeModalButton);

      await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    }
  });

  it('renders the correct content in the modal based on the selected feature', async () => {
    render(<AboutThisSite />);
    const learnMoreButtons = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page/i,
    });

    fireEvent.click(learnMoreButtons[0]);
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    const modalTitle = within(modal).getByRole('heading', { level: 2, name: /Error Handling/i });
    expect(modalTitle).toBeInTheDocument();
    expect(within(modal).getByTestId('error-test-content')).toBeInTheDocument();

    const closeModalButton = within(modal).getByRole('button', { name: /Close/i });
    fireEvent.click(closeModalButton);
    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());

    fireEvent.click(learnMoreButtons[1]);
    const secondModal = await screen.findByTestId('modal');
    expect(secondModal).toBeInTheDocument();

    const secondModalTitle = within(secondModal).getByRole('heading', { level: 2, name: /Entertaining 404 Page/i });
    expect(secondModalTitle).toBeInTheDocument();
    expect(within(secondModal).getByTestId('entertaining-404-content')).toBeInTheDocument();

    fireEvent.click(within(secondModal).getByRole('button', { name: /Close/i }));
    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
  });

  it('handles modal navigation (Next and Previous)', async () => {
    render(<AboutThisSite />);
    const learnMoreButtons = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page/i,
    });

    fireEvent.click(learnMoreButtons[0]);

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    const initialModalTitle = within(modal).getByRole('heading', { level: 2, name: /Error Handling/i });
    expect(initialModalTitle).toBeInTheDocument();
    expect(within(modal).getByTestId('error-test-content')).toBeInTheDocument();

    const nextButton = within(modal).getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      const newModalTitle = within(modal).getByRole('heading', { level: 2, name: /Entertaining 404 Page/i });
      expect(newModalTitle).toBeInTheDocument();
      expect(within(modal).getByTestId('entertaining-404-content')).toBeInTheDocument();
    });

    const previousButton = within(modal).getByRole('button', { name: /Previous/i });
    fireEvent.click(previousButton);

    await waitFor(() => {
      const originalModalTitle = within(modal).getByRole('heading', { level: 2, name: /Error Handling/i });
      expect(originalModalTitle).toBeInTheDocument();
      expect(within(modal).getByTestId('error-test-content')).toBeInTheDocument();
    });

    fireEvent.click(within(modal).getByRole('button', { name: /Close/i }));
    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
  });

  it('matches the snapshot when a modal is open', async () => {
    const { container } = render(<AboutThisSite />);
    const learnMoreButton = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page/i,
    })[0];

    fireEvent.click(learnMoreButton);

    await screen.findByTestId('modal');

    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot in mobile view', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });

    const { container } = render(<AboutThisSite />);
    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot in desktop view', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { container } = render(<AboutThisSite />);
    expect(container).toMatchSnapshot();
  });

  it('toggles modal expansion', async () => {
    render(<AboutThisSite />);
    const learnMoreButton = screen.getAllByRole('button', {
      name: /Learn more about Error Handling|Learn more about Entertaining 404 Page/i,
    })[0];

    fireEvent.click(learnMoreButton);

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    expect(modal).toHaveClass('expanded');

    const compressButton = within(modal).getByRole('button', { name: /Compress Modal/i });
    fireEvent.click(compressButton);

    await waitFor(() => expect(modal).not.toHaveClass('expanded'));

    const expandButton = within(modal).getByRole('button', { name: /Expand Modal/i });
    expect(expandButton).toBeInTheDocument();

    fireEvent.click(expandButton);

    await waitFor(() => expect(modal).toHaveClass('expanded'));
  });

  it('renders the "View Source Code" button and opens GitHub link on click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<AboutThisSite />);
    const viewSourceButton = screen.getByRole('button', { name: /View the source code on GitHub/i });
    expect(viewSourceButton).toBeInTheDocument();

    fireEvent.click(viewSourceButton);
    expect(openSpy).toHaveBeenCalledWith(
      'https://github.com/shawnkhoffman/shawnkhoffman.github.io',
      '_blank'
    );

    openSpy.mockRestore();
  });
});