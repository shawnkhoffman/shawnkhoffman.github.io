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

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  private renderErrorMessage(errorMessage: string): ReactNode {
    if (errorMessage.includes('NetworkError')) {
      return "It looks like you're offline or experiencing network issues. Please check your internet connection and try reloading the page.";
    } else if (errorMessage.includes('Failed to fetch')) {
      return "There was a problem fetching data from the server. Please try refreshing the page or come back later.";
    } else if (errorMessage.includes('CORS')) {
      return "It seems we are unable to retrieve the data due to a configuration issue. Please try again later.";
    } else if (errorMessage.includes('AuthenticationError') || errorMessage.includes('AuthorizationError')) {
      return "You do not have permission to access this page, or there's an issue with your credentials. Please try authenticating again.";
    } else if (errorMessage.includes('ValidationError')) {
      return "There was an issue with the form input. Please check the fields and ensure they are correctly filled out.";
    } else if (errorMessage.includes('RateLimitError')) {
      return "Too many requests have been made. Please wait a few minutes before trying again.";
    } else if (errorMessage.includes('TimeoutError')) {
      return "The request took too long to complete. Please check your internet connection and try again later.";
    } else {
      return "Something went wrong while processing your request. Please refresh the page or try again later.";
    }
  }

  public render() {
    const { showReloadButton = true } = this.props;

    if (this.state.hasError && this.state.error) {
      const { error } = this.state;

      return (
        <div
          className="flex flex-col items-center justify-center w-full p-4 sm:p-6 md:p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-base-100 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg overflow-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-error">
              Oops! Something went wrong.
            </h1>

            <p className="mb-4 text-sm sm:text-base md:text-lg">
              {this.renderErrorMessage(error.message)}
            </p>

            {error.message && (
              <pre className="whitespace-pre-wrap text-xs sm:text-sm md:text-base text-base-content bg-error bg-opacity-10 p-2 sm:p-4 rounded-lg font-mono mb-4 max-h-40 overflow-auto">
                {error.message}
              </pre>
            )}

            {showReloadButton && (
              <button
                className="btn btn-primary btn-sm mt-4"
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