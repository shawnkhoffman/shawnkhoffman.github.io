import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Skills from '../../../pages/About/Skills';
import '@testing-library/jest-dom';

vi.mock('../../../components/common/Modal', () => ({
  default: ({ isOpen, onClose, title, content, onNext, onPrevious, onToggleExpand, isExpanded }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    onNext: () => void;
    onPrevious: () => void;
    onToggleExpand: () => void;
    isExpanded: boolean;
  }) => 
    isOpen ? (
      <div role="dialog" aria-modal="true">
        <h2 data-testid="modal-title">{title}</h2>
        <div>{content}</div>
        <button onClick={onClose} aria-label="Close modal">Close</button>
        <button onClick={onPrevious} aria-label="Go to the previous page">Previous</button>
        <button onClick={onNext} aria-label="Go to the next page">Next</button>
        <button onClick={onToggleExpand} aria-label={isExpanded ? "Compress modal" : "Expand modal"}>
          {isExpanded ? "Compress" : "Expand"}
        </button>
      </div>
    ) : null
}));

describe('Skills Component', () => {
  const skillCategories = [
    'Software Engineering',
    'Cloud Infrastructure',
    'Media Engineering',
    'Machine Learning',
    'Data Engineering',
    'Security',
  ];

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all skill categories with "Learn More" buttons', () => {
    render(<Skills />);

    skillCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });

    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    expect(learnMoreButtons).toHaveLength(skillCategories.length);
  });

  it('opens a modal when "Learn More" is clicked', () => {
    render(<Skills />);

    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    fireEvent.click(learnMoreButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent(skillCategories[0]);
  });

  it('closes the modal when close button is clicked', () => {
    render(<Skills />);

    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    fireEvent.click(learnMoreButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates through modals using next and previous buttons', () => {
    render(<Skills />);

    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    fireEvent.click(learnMoreButtons[0]);

    expect(screen.getByTestId('modal-title')).toHaveTextContent(skillCategories[0]);

    fireEvent.click(screen.getByRole('button', { name: /go to the next page/i }));
    expect(screen.getByTestId('modal-title')).toHaveTextContent(skillCategories[1]);

    fireEvent.click(screen.getByRole('button', { name: /go to the previous page/i }));
    expect(screen.getByTestId('modal-title')).toHaveTextContent(skillCategories[0]);
  });

  it('expands and compresses the modal', () => {
    render(<Skills />);

    const learnMoreButtons = screen.getAllByRole('button', { name: /learn more/i });
    fireEvent.click(learnMoreButtons[0]);

    expect(screen.getByRole('button', { name: /compress modal/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /compress modal/i }));
    expect(screen.getByRole('button', { name: /expand modal/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /expand modal/i }));
    expect(screen.getByRole('button', { name: /compress modal/i })).toBeInTheDocument();
  });
});