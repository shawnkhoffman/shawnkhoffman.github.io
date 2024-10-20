import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import { vi } from 'vitest';

describe('ErrorBoundary', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const ProblemChild = ({ errorMessage }: { errorMessage?: string }) => {
    throw new Error(errorMessage || 'Test error');
  };

  it('catches errors and displays fallback UI', () => {
    const { container } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('Oops! Something went wrong.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Something went wrong while processing your request. Please refresh the page or try again later.'
      )
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('displays the error message', () => {
    const { container } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('displays the reload button by default', () => {
    const { container } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole('button', { name: 'Reload the page to try again' })
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('does not display the reload button when showReloadButton is false', () => {
    const { container } = render(
      <ErrorBoundary showReloadButton={false}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(
      screen.queryByRole('button', { name: 'Reload the page to try again' })
    ).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('reloads the page when reload button is clicked', () => {
    const reloadMock = vi.fn();

    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadMock },
    });

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Reload the page to try again' })
    );
    expect(reloadMock).toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('logs the error to console', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  const errorScenarios = [
    {
      errorMessage: 'NetworkError: Failed to connect',
      expectedText:
        "It looks like you're offline or experiencing network issues. Please check your internet connection and try reloading the page.",
    },
    {
      errorMessage: 'Failed to fetch',
      expectedText:
        'There was a problem fetching data from the server. Please try refreshing the page or come back later.',
    },
    {
      errorMessage: 'CORS Error',
      expectedText:
        'It seems we are unable to retrieve the data due to a configuration issue. Please try again later.',
    },
    {
      errorMessage: 'AuthenticationError: Invalid token',
      expectedText:
        "You do not have permission to access this page, or there's an issue with your credentials. Please try authenticating again.",
    },
    {
      errorMessage: 'AuthorizationError: Access denied',
      expectedText:
        "You do not have permission to access this page, or there's an issue with your credentials. Please try authenticating again.",
    },
    {
      errorMessage: 'ValidationError: Invalid input',
      expectedText:
        'There was an issue with the form input. Please check the fields and ensure they are correctly filled out.',
    },
    {
      errorMessage: 'RateLimitError: Too many requests',
      expectedText:
        'Too many requests have been made. Please wait a few minutes before trying again.',
    },
    {
      errorMessage: 'TimeoutError: Request timed out',
      expectedText:
        'The request took too long to complete. Please check your internet connection and try again later.',
    },
  ];

  errorScenarios.forEach(({ errorMessage, expectedText }) => {
    it(`displays correct message for error: "${errorMessage}"`, () => {
      const { container } = render(
        <ErrorBoundary>
          <ProblemChild errorMessage={errorMessage} />
        </ErrorBoundary>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();

      expect(container).toMatchSnapshot(`ErrorBoundary with error: ${errorMessage}`);
    });
  });

  it('does not render error message if error is null', () => {
    class TestErrorBoundary extends ErrorBoundary {
      public render() {
        this.state = { hasError: true, error: null };
        return super.render();
      }
    }

    const { container } = render(
      <TestErrorBoundary>
        <div>Child Component</div>
      </TestErrorBoundary>
    );

    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();

    expect(container).toMatchSnapshot('ErrorBoundary with error null');
  });

  it('resets error state when component is unmounted and remounted', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    unmount();

    const { container } = render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();

    expect(container).toMatchSnapshot('ErrorBoundary after remount');
  });
});