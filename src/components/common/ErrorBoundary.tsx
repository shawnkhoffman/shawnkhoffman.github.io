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
        <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-semibold mb-2 text-error">
            Oops! Something went wrong.
          </h1>

          {this.state.error?.message && (
            <pre className="whitespace-pre-wrap text-sm text-base-content bg-error bg-opacity-10 p-4 rounded-lg font-mono mb-4">
              {this.state.error.message}
            </pre>
          )}

          <div className="mb-4">
            {error.message.includes('NetworkError') && (
              <p>
                It looks like you're offline or experiencing network issues. Please check your internet connection and try reloading the page.
              </p>
            )}

            {error.message.includes('Failed to fetch') && (
              <p>
                There was a problem fetching data from the server. Please try refreshing the page or come back later.
              </p>
            )}

            {error.message.includes('CORS') && (
              <p>
                It seems we are unable to retrieve the data due to a configuration issue. Please try again later.
              </p>
            )}

            {(error.message.includes('AuthenticationError') ||
              error.message.includes('AuthorizationError')) && (
              <p>
                You do not have permission to access this page, or there's an issue with your credentials. Please try authenticating again.
              </p>
            )}

            {error.message.includes('ValidationError') && (
              <p>
                There was an issue with the form input. Please check the fields and ensure they are correctly filled out.
              </p>
            )}

            {error.message.includes('RateLimitError') && (
              <p>
                Too many requests have been made. Please wait a few minutes before trying again.
              </p>
            )}

            {error.message.includes('TimeoutError') && (
              <p>
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
              <p>
                Something went wrong while processing your request. Please refresh the page or try again later.
              </p>
            )}
          </div>

          {showReloadButton && (
            <button
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;