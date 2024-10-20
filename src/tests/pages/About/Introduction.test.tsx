import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Introduction from '../../../pages/About/Introduction';
import '@testing-library/jest-dom';

describe('Introduction Component', () => {
  it('renders the introduction section with heading and paragraph', () => {
    const { container } = render(<Introduction />);

    const section = screen.getByRole('region', { name: 'About Me' });
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole('heading', { name: 'About Me' });
    expect(heading).toBeInTheDocument();

    const paragraphText = /I'm a full-stack software engineer with a background in platform and site reliability engineering in media and video streaming\. I specialize in building high-quality user experiences using modern web technologies, and highly scalable, reliable cloud software for large, global platforms\./i;
    const paragraph = screen.getByText(paragraphText);
    expect(paragraph).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('has appropriate ARIA attributes', () => {
    render(<Introduction />);

    const section = screen.getByRole('region', { name: 'About Me' });
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');
  });
});