import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechnologyCard from '../../../pages/AboutThisSite/TechnologyCard';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('TechnologyCard', () => {
  const defaultProps = {
    icon: <MockIcon />,
    title: 'React',
    description: 'A JavaScript library for building user interfaces.',
    link: 'https://reactjs.org/',
  };

  it('renders the TechnologyCard with given props', () => {
    const { container } = render(<TechnologyCard {...defaultProps} />);

    const linkElement = screen.getByRole('link', { name: `Learn more about ${defaultProps.title}` });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', defaultProps.link);
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');

    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();

    const titleElement = screen.getByRole('heading', { name: defaultProps.title });
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(defaultProps.description);
    expect(descriptionElement).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('matches the snapshot', () => {
    const { container } = render(<TechnologyCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('has accessible aria-label', () => {
    render(<TechnologyCard {...defaultProps} />);
    const linkElement = screen.getByRole('link', { name: `Learn more about ${defaultProps.title}` });
    expect(linkElement).toBeInTheDocument();
  });

  it('renders without crashing when optional props are missing', () => {
    const propsWithoutOptional = {
      icon: <MockIcon />,
      title: 'TypeScript',
      description: 'A typed superset of JavaScript.',
      link: 'https://www.typescriptlang.org/',
    };

    const { container } = render(<TechnologyCard {...propsWithoutOptional} />);
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});