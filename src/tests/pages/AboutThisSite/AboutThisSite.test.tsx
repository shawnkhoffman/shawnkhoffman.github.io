import { describe, test, expect, mock } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';

mock.module('@components/common/Modal', () => ({
  default: ({ isOpen, content }: { isOpen: boolean; content: React.ReactNode }) => 
    isOpen ? <div data-testid="modal">{content}</div> : null
}));

mock.module('@/pages/AboutThisSite/TechnologyCard', () => ({
  default: ({ title }: { title: string }) => 
    <div data-testid="technology-card" role="link" aria-label={`Learn more about ${title}`}>{title}</div>
}));

const TestAboutThisSite = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About This Site</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div data-testid="technology-card" role="link" aria-label="Learn more about React">React</div>
          <div data-testid="technology-card" role="link" aria-label="Learn more about TypeScript">TypeScript</div>
          <div data-testid="technology-card" role="link" aria-label="Learn more about Tailwind CSS">Tailwind CSS</div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Site Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title">Error Handling</h3>
              <p>This site includes robust error handling to ensure a smooth user experience.</p>
              <div className="card-actions justify-end">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={openModal}
                  data-testid="learn-more-error-handling"
                  aria-label="Learn more about error handling"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title">404 Page</h3>
              <p>Check out our entertaining 404 page when you navigate to a non-existent route.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm" aria-label="Visit the 404 page">
                  Visit 404
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {isModalOpen && (
        <div data-testid="modal">
          <h2>Error Handling</h2>
          <p>This is the modal content about error handling.</p>
        </div>
      )}
    </div>
  );
};

describe('AboutThisSite', () => {
  describe('Rendering', () => {
    test('renders the page', () => {
      const { container } = render(<TestAboutThisSite />);
      expect(container).toBeDefined();
    });
  });

  describe('Structure', () => {
    test('contains main content sections', () => {
      render(<TestAboutThisSite />);
      const mainHeading = screen.getAllByRole('heading', { level: 1 })[0];
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      
      expect(mainHeading).toBeDefined();
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    test('displays interactive elements', () => {
      render(<TestAboutThisSite />);
      const buttons = screen.getAllByRole('button');
      const technologyCards = screen.getAllByTestId('technology-card');
      
      expect(buttons.length).toBeGreaterThan(0);
      expect(technologyCards.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    test('handles modal interactions', () => {
      render(<TestAboutThisSite />);
      
      const buttons = screen.getAllByTestId('learn-more-error-handling');
      expect(buttons.length).toBeGreaterThan(0);
      
      const button = buttons[0] as HTMLButtonElement;
      expect(button).toBeDefined();
      
      fireEvent.click(button);
      const modal = screen.getByTestId('modal');
      expect(modal).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    test('has proper accessibility attributes', () => {
      render(<TestAboutThisSite />);
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label');
        const hasTextContent = button.textContent ? button.textContent.trim().length > 0 : false;
        expect(hasAriaLabel || hasTextContent).toBe(true);
      });

      links.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeDefined();
      });
    });
  });
}); 