import React, { Suspense, memo, useEffect } from 'react';
import { RouteConfig } from '../../routes/routes';
import { useLocation } from 'react-router-dom';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  size = 'md',
  className = ''
}) => (
  <div 
    className={`flex justify-center items-center min-h-[200px] ${className}`} 
    role="status" 
    aria-live="polite"
  >
    <span className={`loading loading-spinner loading-${size} text-primary`} />
    <span className="sr-only">Loading content...</span>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

interface DelayedFallbackProps {
  children: React.ReactNode;
  delay?: number;
}

const DelayedFallback: React.FC<DelayedFallbackProps> = memo(({ 
  children, 
  delay = 200 
}) => {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show ? <>{children}</> : null;
});

DelayedFallback.displayName = 'DelayedFallback';

interface RouteWrapperProps extends RouteConfig {
  fallback?: React.ReactNode;
  loadingDelay?: number;
  preserveScroll?: boolean;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({
  element: Element,
  fallback,
  loadingDelay = 200,
  preserveScroll = false
}) => {
  const location = useLocation();

  useEffect(() => {
    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, preserveScroll]);

  const defaultFallback = (
    <DelayedFallback delay={loadingDelay}>
      <LoadingSpinner />
    </DelayedFallback>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <Element />
    </Suspense>
  );
};

RouteWrapper.displayName = 'RouteWrapper';

export default memo(RouteWrapper);