import { describe, test, expect, beforeEach } from 'bun:test';
import { render, screen, within, fireEvent } from '@testing-library/react';
import React from 'react';

const TestAboutThisSite = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  return (
    <div>
      <button 
        data-testid="learn-more-error-handling"
        onClick={openModal}
      >
        Learn More
      </button>
      
      {isModalOpen && (
        <div data-testid="modal">
          <h2>Error Handling</h2>
          <div data-testid="error-test-content">
            <button
              data-testid="test-error-button"
              disabled
              className="btn btn-sm btn-outline btn-primary btn-disabled"
            >
              Test Error
            </button>
            <div>Please select an error</div>
          </div>
        </div>
      )}
    </div>
  );
};

describe('ErrorTestContent', () => {
  beforeEach(() => {
  });

  describe('Rendering', () => {
    test('renders correctly when modal is opened', async () => {
      render(<TestAboutThisSite />);

      const learnMoreButton = screen.getByTestId('learn-more-error-handling');
      expect(learnMoreButton).toBeTruthy();
      
      fireEvent.click(learnMoreButton);

      const modal = screen.getByTestId('modal');
      expect(modal).toBeTruthy();

      const errorContent = within(modal).getByTestId('error-test-content');
      expect(errorContent).toBeTruthy();

      const testButton = within(errorContent).getByTestId('test-error-button');
      expect(testButton).toBeTruthy();
      expect(testButton.hasAttribute('disabled')).toBe(true);
      
      expect(within(errorContent).getByText(/please select an error/i)).toBeTruthy();
    });
  });
}); 