import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import { Suspense, lazy } from 'react';
import AboutThisSite from './pages/AboutThisSite/AboutThisSite';

const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/404'));
const About = lazy(() => import('./pages/About/About'));

const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <GoogleAnalyticsTracker />
          <Suspense
            fallback={
              <div className="flex justify-center items-center" role="status" aria-live="polite">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="sr-only">Loading...</span>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about-me" element={<About />} />
              <Route path="/about-this-site" element={<AboutThisSite />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;