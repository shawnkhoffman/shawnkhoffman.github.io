import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showReloadButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { showReloadButton = true } = this.props;

    if (this.state.hasError && this.state.error) {
      const { error } = this.state;

      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-full max-w-xl bg-base-100 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-error">
              Oops! Something went wrong.
            </h1>

            <div className="mb-4">
              {error.message.includes('NetworkError') && (
                <p className="text-base mb-4">
                  It looks like you're offline or experiencing network issues. Please check your internet connection and try reloading the page.
                </p>
              )}

              {error.message.includes('Failed to fetch') && (
                <p className="text-base mb-4">
                  There was a problem fetching data from the server. Please try refreshing the page or come back later.
                </p>
              )}

              {error.message.includes('CORS') && (
                <p className="text-base mb-4">
                  It seems we are unable to retrieve the data due to a configuration issue. Please try again later.
                </p>
              )}

              {(error.message.includes('AuthenticationError') ||
                error.message.includes('AuthorizationError')) && (
                <p className="text-base mb-4">
                  You do not have permission to access this page, or there's an issue with your credentials. Please try authenticating again.
                </p>
              )}

              {error.message.includes('ValidationError') && (
                <p className="text-base mb-4">
                  There was an issue with the form input. Please check the fields and ensure they are correctly filled out.
                </p>
              )}

              {error.message.includes('RateLimitError') && (
                <p className="text-base mb-4">
                  Too many requests have been made. Please wait a few minutes before trying again.
                </p>
              )}

              {error.message.includes('TimeoutError') && (
                <p className="text-base mb-4">
                  The request took too long to complete. Please check your internet connection and try again later.
                </p>
              )}

              {(!error.message.includes('NetworkError') &&
                !error.message.includes('Failed to fetch') &&
                !error.message.includes('CORS') &&
                !error.message.includes('AuthenticationError') &&
                !error.message.includes('AuthorizationError') &&
                !error.message.includes('ValidationError') &&
                !error.message.includes('RateLimitError') &&
                !error.message.includes('TimeoutError')) && (
                <p className="text-base mb-4">
                  Something went wrong while processing your request. Please refresh the page or try again later.
                </p>
              )}
            </div>

            {this.state.error?.message && (
              <pre
                className="whitespace-pre-wrap text-sm text-base-content bg-error bg-opacity-10 p-4 rounded-lg font-mono mb-6"
                aria-live="polite"
              >
                {this.state.error.message}
              </pre>
            )}

            {showReloadButton && (
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={() => window.location.reload()}
                aria-label="Reload the page to try again"
              >
                Reload Page
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;