import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CollapsibleSection from '../../../pages/AboutThisSite/CollapsibleSection';

describe('CollapsibleSection', () => {
  const title = 'Section Title';
  const content = 'This is the collapsible content.';

  it('renders the component with given title and content', () => {
    const { container } = render(<CollapsibleSection title={title} content={content} />);

    const titleButton = screen.getByRole('button', { name: title });
    expect(titleButton).toBeInTheDocument();

    const contentDiv = screen.getByText(content).closest('.collapse-content');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveAttribute('aria-hidden', 'true');

    expect(container).toMatchSnapshot();
  });

  it('toggles the content visibility when the title is clicked', () => {
    render(<CollapsibleSection title={title} content={content} />);

    const titleButton = screen.getByRole('button', { name: title });
    const contentDiv = screen.getByText(content).closest('.collapse-content');

    expect(contentDiv).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(titleButton);
    expect(contentDiv).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(titleButton);
    expect(contentDiv).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets the correct aria attributes', () => {
    render(<CollapsibleSection title={title} content={content} />);

    const titleButton = screen.getByRole('button', { name: title });
    const contentDiv = screen.getByText(content).closest('.collapse-content');

    expect(titleButton).toHaveAttribute('aria-expanded', 'false');
    expect(titleButton).toHaveAttribute('aria-controls', contentDiv?.id);
    expect(contentDiv).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(titleButton);
    expect(titleButton).toHaveAttribute('aria-expanded', 'true');
    expect(contentDiv).toHaveAttribute('aria-hidden', 'false');
  });

  it('matches the snapshot when expanded', () => {
    const { container } = render(<CollapsibleSection title={title} content={content} />);

    const titleButton = screen.getByRole('button', { name: title });
    fireEvent.click(titleButton);

    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot when collapsed', () => {
    const { container } = render(<CollapsibleSection title={title} content={content} />);

    const contentDiv = screen.getByText(content).closest('.collapse-content');
    expect(contentDiv).toHaveAttribute('aria-hidden', 'true');

    expect(container).toMatchSnapshot();
  });
});