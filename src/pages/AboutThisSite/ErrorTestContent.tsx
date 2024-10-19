import React, { useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ErrorBoundary from '../../components/common/ErrorBoundary';

const BuggyComponent: React.FC<{ errorType: string }> = ({ errorType }) => {
  if (errorType === 'network') {
    throw new Error('NetworkError: Failed to connect');
  } else if (errorType === 'fetch') {
    throw new Error('Failed to fetch: Error retrieving data');
  } else if (errorType === 'cors') {
    throw new Error('CORS error: Blocked by CORS policy');
  } else if (errorType === 'auth') {
    throw new Error('AuthenticationError: Invalid credentials');
  } else if (errorType === 'timeout') {
    throw new Error('TimeoutError: The request timed out');
  } else if (errorType === 'validation') {
    throw new Error('ValidationError: Form input is invalid');
  } else if (errorType === 'rateLimit') {
    throw new Error('RateLimitError: Too many requests');
  } else if (errorType === 'generic') {
    throw new Error('Boop beep boooooop!');
  }
  return <div className="text-success text-center">No Errors</div>;
};

interface ErrorTestContentProps {
  onClose: () => void;
}

const ErrorTestContent: React.FC<ErrorTestContentProps> = () => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState<string>('network');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    setSelectedError(errorValue);
    setErrorType(null);
    errorBoundaryRef.current?.resetErrorBoundary();
    setIsDropdownOpen(false);
  };

  const simulateError = () => {
    setErrorType(selectedError);
  };

  const clearError = () => {
    setErrorType(null);
    errorBoundaryRef.current?.resetErrorBoundary();
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
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
        <div className="dropdown mb-6 w-full max-w-xs sm:max-w-md">
          <div
            tabIndex={0}
            role="button"
            className="btn flex items-center w-full justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {errorTypes.find((error) => error.value === selectedError)?.label || 'Select Error'}
            <FaChevronDown className="ml-2" />
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow mt-2"
            >
              {errorTypes.map((error) => (
                <li key={error.value}>
                  <a
                    onClick={() => handleErrorSelection(error.value)}
                    className={selectedError === error.value ? 'active' : ''}
                  >
                    {error.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button className="btn btn-sm btn-outline" onClick={simulateError}>
            Test
          </button>
          <button
            className={`btn btn-sm btn-outline btn-accent ${errorType ? '' : 'btn-disabled'}`}
            onClick={clearError}
            disabled={!errorType}
          >
            Clear Error
          </button>
        </div>

        <div className="w-full max-w-xs sm:max-w-md bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
          <ErrorBoundary ref={errorBoundaryRef} showReloadButton={false}>
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