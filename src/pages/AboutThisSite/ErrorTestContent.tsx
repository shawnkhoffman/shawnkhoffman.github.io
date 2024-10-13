import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ErrorBoundary from '../../components/common/ErrorBoundary';

class SimulatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SimulatedError';
  }
}

interface ErrorTestContentProps {
  onClose?: () => void;
}

const BuggyComponent: React.FC<{ errorType: string }> = ({ errorType }) => {
  if (errorType === 'network') {
    throw new SimulatedError('NetworkError: Failed to connect');
  } else if (errorType === 'fetch') {
    throw new SimulatedError('Failed to fetch: Error retrieving data');
  } else if (errorType === 'cors') {
    throw new SimulatedError('CORS error: Blocked by CORS policy');
  } else if (errorType === 'auth') {
    throw new SimulatedError('AuthenticationError: Invalid credentials');
  } else if (errorType === 'timeout') {
    throw new SimulatedError('TimeoutError: The request timed out');
  } else if (errorType === 'validation') {
    throw new SimulatedError('ValidationError: Form input is invalid');
  } else if (errorType === 'rateLimit') {
    throw new SimulatedError('RateLimitError: Too many requests');
  } else if (errorType === 'generic') {
    throw new SimulatedError('Boop beep boooooop!');
  }
  return <div className="text-success text-center">No Errors</div>;
};

const ErrorTestContent: React.FC<ErrorTestContentProps> = ({ onClose }) => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const resetSourceRef = useRef<'selectingError' | 'clearingError' | null>(null);
  
  const errorBoundaryRef = useRef<ErrorBoundary>(null);

  const errorTypes = [
    { label: 'Network Error', value: 'network' },
    { label: 'Fetch Error', value: 'fetch' },
    { label: 'CORS Error', value: 'cors' },
    { label: 'Authentication Error', value: 'auth' },
    { label: 'Timeout Error', value: 'timeout' },
    { label: 'Validation Error', value: 'validation' },
    { label: 'Rate Limit Error', value: 'rateLimit' },
    { label: 'Generic Error', value: 'generic' },
  ];

  const handleErrorSelection = (errorValue: string) => {
    resetSourceRef.current = 'selectingError';
    setSelectedError(errorValue);
    setErrorType(null);
    errorBoundaryRef.current?.resetError();
    setIsDropdownOpen(false);
  };

  const simulateError = () => {
    if (selectedError) {
      setErrorType(selectedError);
    }
  };

  const clearError = () => {
    resetSourceRef.current = 'clearingError';
    setErrorType(null);
    errorBoundaryRef.current?.resetError();
  };

  const handleReset = () => {
    setErrorType(null);
    
    if (!resetSourceRef.current && onClose) {
      onClose();
    }

    resetSourceRef.current = null;
  };

  useEffect(() => {
    const dropdownButton = document.querySelector('[data-testid="error-dropdown-button"]');
    if (dropdownButton && dropdownButton instanceof HTMLElement) {
      dropdownButton.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="mb-4 text-sm sm:text-base">
          This website uses an <strong>ErrorBoundary</strong> to catch and gracefully handle unexpected errors.
          When an error occurs, instead of crashing the entire site, the ErrorBoundary catches it and displays a
          relevant error message. This ensures the user experience remains intact even when problems arise.
        </p>
        <p className="mb-4 text-sm sm:text-base">
          Below you can simulate different types of errors that the ErrorBoundary can catch.
          Use the dropdown menu to select an error type, then click the "Test" button to simulate that error.
          You can clear the error afterward by using the "Clear Error" button or just select a different error type.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="dropdown mb-6 w-full max-w-xs sm:max-w-xl">
          <div
            data-testid="error-dropdown-button"
            role="combobox"
            aria-controls="error-type-listbox"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            className="btn flex items-center w-full justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            tabIndex={0}
          >
            {errorTypes.find((error) => error.value === selectedError)?.label || 'Select Error'}
            <FaChevronDown className="ml-2" />
          </div>
          <ul
            id="error-type-listbox"
            role="listbox"
            tabIndex={-1}
            aria-label="Select error type"
            className={`dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow mt-2 ${
              isDropdownOpen ? '' : 'hidden'
            }`}
            data-testid="error-dropdown-list"
          >
            {errorTypes.map((errorType) => (
              <li 
                key={errorType.value} 
                role="option" 
                aria-selected={selectedError === errorType.value}
                data-testid={`error-option-${errorType.value}`}
                onClick={() => handleErrorSelection(errorType.value)}
              >
                <button className="w-full text-left">
                  {errorType.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button 
            data-testid="test-error-button"
            className={`btn btn-sm btn-outline btn-primary ${selectedError ? '' : 'btn-disabled'}`}
            onClick={simulateError}
            disabled={!selectedError}
          >
            Test
          </button>
          <button
            data-testid="clear-error-button"
            className={`btn btn-sm btn-outline btn-accent ${errorType ? '' : 'btn-disabled'}`}
            onClick={clearError}
            disabled={!errorType}
          >
            Clear Error
          </button>
        </div>

        <div className="w-full max-w-xs sm:max-w-xl bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
          <ErrorBoundary
            ref={errorBoundaryRef}
            showReloadButton={false}
            isTestError={true}
            onReset={handleReset}
          >
            {errorType ? (
              <div className="text-error text-center">
                <BuggyComponent errorType={errorType} />
              </div>
            ) : (
              <div className="text-success text-center">Please select an error to test.</div>
            )}
          </ErrorBoundary>
        </div>
      </div>
      <div className="pb-10"></div>
    </div>
  );
};

export default ErrorTestContent;
