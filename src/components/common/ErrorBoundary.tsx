import { Component, ErrorInfo, ReactNode, createRef } from 'react';
import { datadogRum } from '@datadog/browser-rum';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
  showReloadButton?: boolean;
  showRetryButton?: boolean;
  isTestError?: boolean;
  maxRetries?: number;
  className?: string;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
  retryCount: number;
  isResetting: boolean;
}

type ErrorType = {
  match?: RegExp;
  message: string;
};

const ERROR_MESSAGES: Record<string, ErrorType> = {
  NETWORK: {
    match: /(NetworkError|net::ERR)/i,
    message: "It looks like you're offline or experiencing network issues. Please check your internet connection and try again.",
  },
  FETCH: {
    match: /Failed to fetch/i,
    message: "There was a problem fetching data from the server. Please try refreshing the page or come back later.",
  },
  CORS: {
    match: /CORS|Cross-Origin/i,
    message: "A security restriction was encountered while fetching data. Please try again later.",
  },
  AUTH: {
    match: /(Authentication|Authorization)Error/i,
    message: "You don't have permission to access this resource or your session has expired. Please try logging in again.",
  },
  VALIDATION: {
    match: /ValidationError/i,
    message: "There was an issue with the provided data. Please check your input and try again.",
  },
  RATE_LIMIT: {
    match: /RateLimitError|Too Many Requests/i,
    message: "You've made too many requests. Please wait a moment before trying again.",
  },
  TIMEOUT: {
    match: /TimeoutError|deadline exceeded/i,
    message: "The request took too long to complete. Please check your connection and try again.",
  },
  DEFAULT: {
    message: "An unexpected error occurred. Your error has been submitted and will be fixed soon.",
  },
} as const;

const MAX_ERROR_RETRIES = 3;
const RESET_TIMEOUT = 300;
const ERROR_STORAGE_KEY = 'error_boundary_state';

let isHandlingTestError = false;

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private errorCardRef = createRef<HTMLDivElement>();

  public state: State = {
    error: null,
    errorInfo: null,
    hasError: false,
    retryCount: 0,
    isResetting: false,
  };

  constructor(props: Props) {
    super(props);
    this.loadPersistedError();
  }

  private loadPersistedError = () => {
    try {
      const savedError = sessionStorage.getItem(ERROR_STORAGE_KEY);
      if (savedError) {
        const { error, errorInfo } = JSON.parse(savedError);
        this.setState({ 
          error: new Error(error.message),
          errorInfo,
          hasError: true 
        });
        sessionStorage.removeItem(ERROR_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to load persisted error state:', e);
    }
  };

  private persistError = () => {
    try {
      const { error, errorInfo } = this.state;
      if (error) {
        const serializedError = {
          error: { message: error.message, stack: error.stack },
          errorInfo
        };
        sessionStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(serializedError));
      }
    } catch (e) {
      console.warn('Failed to persist error state:', e);
    }
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    if (error.name === 'SimulatedError') {
      isHandlingTestError = true;
      setTimeout(() => {
        isHandlingTestError = false;
      }, 0);
    }

    return {
      error,
      hasError: true,
      retryCount: 0,
      isResetting: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, isTestError } = this.props;

    if (!isHandlingTestError) {
      if (onError) {
        onError(error, errorInfo);
      }
      if (!isTestError) {
        this.reportError(error, errorInfo);
      }
    }

    this.setState({ errorInfo });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      datadogRum.addError(error, {
        errorInfo,
        retryCount: this.state.retryCount,
      });
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.resetKeys && prevProps.resetKeys) {
      const hasChangedResetKeys = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );

      if (hasChangedResetKeys) {
        this.resetError();
      }
    }
  }

  public componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    if (this.state.hasError) {
      this.persistError();
    }
  }

  private getErrorMessage = (error: Error): string => {
    const errorString = error.message || error.toString();
    
    const matchedError = Object.values(ERROR_MESSAGES).find(
      ({ match }) => match && match.test(errorString)
    );
    
    return matchedError?.message || ERROR_MESSAGES.DEFAULT.message;
  };

  public resetError = () => {
    const { maxRetries = MAX_ERROR_RETRIES, isTestError } = this.props;
    const { retryCount } = this.state;

    if (isTestError) {
      this.setState({
        error: null,
        errorInfo: null,
        hasError: false,
        isResetting: false,
      });

      if (this.props.onReset) {
        this.props.onReset();
      }

      return;
    }

    if (retryCount >= maxRetries) {
      this.setState({
        error: new Error(`Maximum retry attempts (${maxRetries}) exceeded`),
        hasError: true,
      });
      return;
    }

    this.setState(
      prevState => ({
        isResetting: true,
        retryCount: prevState.retryCount + 1,
      }),
      () => {
        this.retryTimeoutId = setTimeout(() => {
          this.setState({
            error: null,
            errorInfo: null,
            hasError: false,
            isResetting: false,
          });
          
          if (this.props.onReset) {
            this.props.onReset();
          }
        }, RESET_TIMEOUT);
      }
    );
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    const { 
      children, 
      fallback, 
      showReloadButton = true,
      showRetryButton = false,
      isTestError = false,
      className = '',
    } = this.props;
    
    const { 
      hasError, 
      error, 
      errorInfo, 
      isResetting,
    } = this.state;

    if (!hasError) {
      return <>{children}</>;
    }

    if (fallback) {
      if (typeof fallback === 'function' && error) {
        return <>{fallback(error)}</>;
      }
      return <>{fallback as Exclude<typeof fallback, (error: Error) => ReactNode>}</>;
    }

    return (
      <div
        ref={this.errorCardRef}
        className={`flex flex-col items-center justify-center w-full p-4 sm:p-6 ${className}`}
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
      >
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-base-100 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg overflow-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-error">
            Oops! Something went wrong.
          </h1>

          <p className="mb-4 text-sm sm:text-base md:text-lg">
            {error && this.getErrorMessage(error)}
          </p>

          {!isTestError && error?.message && (
            <pre className="whitespace-pre-wrap text-xs sm:text-sm md:text-base text-base-content bg-error bg-opacity-10 p-2 sm:p-4 rounded-lg mb-4 max-h-40 overflow-auto">
              {error.message}
              {errorInfo?.componentStack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-info">View technical details</summary>
                  <div className="mt-2 text-xs opacity-80">
                    {errorInfo.componentStack}
                  </div>
                </details>
              )}
            </pre>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {showReloadButton && (
              <button
                className="btn btn-primary btn-sm"
                onClick={this.handleReload}
                aria-label="Reload the page"
                disabled={isResetting}
              >
                Reload Page
              </button>
            )}

            {(showRetryButton || (!isTestError && !showRetryButton)) && (
              <button
                data-testid="reset-error-button"
                className="btn btn-secondary btn-sm"
                onClick={this.resetError}
                aria-label="Try again"
                disabled={isResetting}
              >
                {isResetting ? 'Retrying...' : 'Try Again'}
              </button>
            )}
          </div>

          {this.state.retryCount > 0 && (
            <p className="text-sm text-base-content/70 mt-4">
              Retry attempt {this.state.retryCount} of {this.props.maxRetries || MAX_ERROR_RETRIES}
            </p>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('error', this.handleGlobalError);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    if (this.props.isTestError || isHandlingTestError) {
      event.preventDefault();
    }
  };
}

export default ErrorBoundary;
