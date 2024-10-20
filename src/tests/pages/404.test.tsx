import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import NotFound from '../../pages/404';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const getMemeMessage = () => screen.getByText((content, element) => {
    return element !== null && 
           element.tagName.toLowerCase() === 'p' && 
           content.length > 0;
  });

  it('renders correctly with initial message and gif', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<NotFound />);

    const image = screen.getByAltText('A funny gif representing a 404 error');
    expect(image).toBeInTheDocument();

    const heading = screen.getByRole('heading', { name: /404 - Page Not Found/i });
    expect(heading).toBeInTheDocument();

    const message = getMemeMessage();
    expect(message).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Return to the homepage/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const nextMemeButton = screen.getByRole('button', { name: /Show next meme/i });
    expect(nextMemeButton).toBeInTheDocument();
  });

  it('changes meme when "Next Meme" button is clicked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<NotFound />);

    const initialMessage = getMemeMessage();
    const initialContent = initialMessage.textContent;

    const nextMemeButton = screen.getByRole('button', { name: /Show next meme/i });
    fireEvent.click(nextMemeButton);

    const updatedMessage = getMemeMessage();
    expect(updatedMessage.textContent).not.toBe(initialContent);
  });

  it('cycles through memes when "Next Meme" button is clicked multiple times', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<NotFound />);

    const nextMemeButton = screen.getByRole('button', { name: /Show next meme/i });
    const seenMessages = new Set<string>();

    for (let i = 0; i < 30; i++) {
      fireEvent.click(nextMemeButton);
      const message = getMemeMessage().textContent;
      if (message) {
        seenMessages.add(message);
      }
    }

    expect(seenMessages.size).toBeGreaterThan(1);
  });

  it('matches snapshot', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });
});