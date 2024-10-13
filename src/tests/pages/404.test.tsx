import { render, screen, cleanup, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../pages/404';
import '@testing-library/jest-dom';

const renderNotFound = () => {
    cleanup();
    return render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );
};

describe('NotFound Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('Rendering', () => {
        it('matches snapshot', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const { container } = renderNotFound();
            expect(container).toMatchSnapshot();
        });
    });

    describe('Interactions', () => {
        it('changes content when "Next Meme" button is clicked', async () => {
            const user = userEvent.setup();
            
            vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(1);
            
            const { container } = renderNotFound();
            
            const nextButton = screen.getByRole('button', { name: /Show next meme/i });
            const initialContent = container.innerHTML;
            
            await user.click(nextButton);
            
            expect(container.innerHTML).not.toBe(initialContent);
        });

        it('changes content when clicked multiple times', async () => {
            const user = userEvent.setup();
            
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1)
                .mockReturnValueOnce(2);
            
            const { container } = renderNotFound();
            const nextButton = screen.getByRole('button', { name: /Show next meme/i });
            
            const initialContent = container.innerHTML;
            await user.click(nextButton);
            
            expect(container.innerHTML).not.toBe(initialContent);
        });
    });

    describe('Accessibility', () => {
        it('ensures interactive elements are focusable', () => {
            renderNotFound();
            const container = screen.getByTestId('404-container');

            const homeLink = within(container).getByRole('link', { name: /home/i });
            const nextButton = within(container).getByRole('button', { name: /next/i });

            expect(homeLink).toBeInTheDocument();
            expect(nextButton).toBeInTheDocument();
            expect(homeLink).not.toHaveAttribute('tabindex', '-1');
            expect(nextButton).not.toHaveAttribute('tabindex', '-1');
        });
    });

    describe('Structure', () => {
        it('has correct HTML structure', () => {
            renderNotFound();
            const container = screen.getByTestId('404-container');
            
            expect(container).toBeInTheDocument();
            expect(container.querySelector('img')).toBeInTheDocument();
            expect(container.querySelector('h1')).toBeInTheDocument();
            expect(container.querySelector('.flex')).toHaveClass('flex-col', 'sm:flex-row');
        });
    });
});
