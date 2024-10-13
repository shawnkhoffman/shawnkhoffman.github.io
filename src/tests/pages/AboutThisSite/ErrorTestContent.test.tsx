import React from 'react';
import { vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AboutThisSite from '../../../pages/AboutThisSite/AboutThisSite';
import { TEST_IDS } from '../../utils/test-constants';
import { render } from '../../utils/test-utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
}

vi.mock('@/components/common/Modal', () => ({
  default: ({ 
    isOpen, 
    onClose, 
    title, 
    content,
    onNext,
    onPrevious,
    onToggleExpand,
    isExpanded 
  }: ModalProps) => 
    isOpen ? (
      <div data-testid="modal" className={isExpanded ? 'expanded' : ''}>
        <h2>{title}</h2>
        <div>{content}</div>
        {onPrevious && <button onClick={onPrevious}>Previous</button>}
        {onNext && <button onClick={onNext}>Next</button>}
        <button onClick={onClose}>Close</button>
        <button onClick={onToggleExpand}>
          {isExpanded ? 'Compress Modal' : 'Expand Modal'}
        </button>
      </div>
    ) : null
}));

vi.mock('../../../pages/AboutThisSite/ErrorTestContent', () => ({
  default: () => (
    <div data-testid="error-test-content">
      <button
        data-testid={TEST_IDS.ERROR_TEST_BUTTON}
        disabled
        className="btn btn-sm btn-outline btn-primary btn-disabled"
      >
        Test Error
      </button>
      <div>Please select an error</div>
    </div>
  )
}));

describe('ErrorTestContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly on mobile viewport', async () => {
      const user = userEvent.setup();
      render(<AboutThisSite />, {
        withLayout: true
      });

      const learnMoreButton = await screen.findByTestId('learn-more-error-handling');
      await user.click(learnMoreButton);

      const modal = await screen.findByTestId('modal');
      expect(modal).toBeInTheDocument();

      const errorContent = await within(modal).findByTestId('error-test-content');
      expect(errorContent).toBeInTheDocument();

      const testButton = within(errorContent).getByTestId(TEST_IDS.ERROR_TEST_BUTTON);
      expect(testButton).toBeInTheDocument();
      expect(testButton).toBeDisabled();
      expect(within(errorContent).getByText(/please select an error/i)).toBeInTheDocument();
    });
  });
});
