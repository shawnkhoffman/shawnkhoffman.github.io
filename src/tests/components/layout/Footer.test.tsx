import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from '../../../components/layout/Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  const originalWindow = { ...window };

  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn());

    Object.defineProperty(window, 'location', {
      value: {
        ...originalWindow.location,
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the footer with social media links', () => {
    render(<Footer />);

    const mediumLink = screen.getByLabelText('Visit my Medium profile');
    const githubLink = screen.getByLabelText('Visit my GitHub profile');
    const linkedInLink = screen.getByLabelText('Visit my LinkedIn profile');
    const twitterLink = screen.getByLabelText('Visit my X (formerly Twitter) profile');

    expect(mediumLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(linkedInLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();

    expect(mediumLink).toHaveAttribute('href', 'https://shawnkhoffman.medium.com');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/shawnkhoffman');
    expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/shawnkhoffman');
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/shawnkhoffman');
  });

  it('triggers the gtag event on social media link clicks', () => {
    render(<Footer />);

    const mediumLink = screen.getByLabelText('Visit my Medium profile');
    const githubLink = screen.getByLabelText('Visit my GitHub profile');
    const linkedInLink = screen.getByLabelText('Visit my LinkedIn profile');
    const twitterLink = screen.getByLabelText('Visit my X (formerly Twitter) profile');

    fireEvent.click(mediumLink);
    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'Medium',
    });

    fireEvent.click(githubLink);
    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'GitHub',
    });

    fireEvent.click(linkedInLink);
    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'LinkedIn',
    });

    fireEvent.click(twitterLink);
    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'X',
    });
  });

  it('displays the correct year in the copyright message', () => {
    const mockYear = 2024;
    const getFullYearSpy = vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(mockYear);

    render(<Footer />);

    expect(
      screen.getByText((content) => {
        const normalizedContent = content.replace(/\s+/g, ' ').trim();
        return normalizedContent === `© ${mockYear} Shawn Hoffman. All rights reserved.`;
      })
    ).toBeInTheDocument();

    getFullYearSpy.mockRestore();
  });

  it('matches the snapshot', () => {
    const mockYear = 2024;
    const getFullYearSpy = vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(mockYear);

    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();

    getFullYearSpy.mockRestore();
  });
});