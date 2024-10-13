import React from 'react';
import { test, describe, expect, beforeEach, afterEach } from 'bun:test';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '@/pages/404';

const TestNotFound = () => (
  <MemoryRouter>
    <NotFound />
  </MemoryRouter>
);

describe('NotFound Component', () => {
    let originalRandom: typeof Math.random;
    
    beforeEach(() => {
        originalRandom = Math.random;
    });
    
    afterEach(() => {
        Math.random = originalRandom;
    });

    describe('Rendering', () => {
        test('renders the 404 page with correct elements', () => {
            Math.random = () => 0;
            
            const { container } = render(<TestNotFound />);
            
            const notFoundContainer = container.querySelector('[data-testid="404-container"]');
            expect(notFoundContainer).toBeDefined();
            
            const image = notFoundContainer?.querySelector('img');
            expect(image).toBeDefined();
            
            const heading = notFoundContainer?.querySelector('h1');
            expect(heading).toBeDefined();
            expect(heading?.textContent).toBe('404 - Page Not Found');
        });
    });

    describe('Interactions', () => {
        test('changes content when "Next Meme" button is clicked', async () => {
            const user = userEvent.setup();
            
            let counter = 0;
            Math.random = () => counter++ % 2 === 0 ? 0 : 0.5;
            
            const { container } = render(<TestNotFound />);
            
            const initialContent = container.innerHTML;
            
            const nextButton = container.querySelector('button[aria-label="Show next meme"]');
            expect(nextButton).toBeDefined();
            
            if (nextButton) {
                await user.click(nextButton);
                
                expect(container.innerHTML).not.toBe(initialContent);
            }
        });
    });

    describe('Structure', () => {
        test('has correct HTML structure', () => {
            Math.random = () => 0;
            
            const { container } = render(<TestNotFound />);
            
            const notFoundContainer = container.querySelector('[data-testid="404-container"]');
            expect(notFoundContainer).toBeDefined();
            
            const image = notFoundContainer?.querySelector('img');
            expect(image).toBeDefined();
            
            const heading = notFoundContainer?.querySelector('h1');
            expect(heading).toBeDefined();
            
            const flexContainer = notFoundContainer?.querySelector('.flex');
            expect(flexContainer).toBeDefined();
            expect(flexContainer?.classList.contains('flex-col')).toBe(true);
            expect(flexContainer?.classList.contains('sm:flex-row')).toBe(true);
            
            const homeLink = notFoundContainer?.querySelector('a[aria-label="Return to the homepage"]');
            expect(homeLink).toBeDefined();
            
            const nextButton = notFoundContainer?.querySelector('button[aria-label="Show next meme"]');
            expect(nextButton).toBeDefined();
        });
    });
}); 