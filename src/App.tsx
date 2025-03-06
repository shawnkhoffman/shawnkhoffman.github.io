import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import RouteWrapper from './components/common/RouteWrapper';
import PageTransition from './components/common/PageTransition';
import routes from './routes/routes';

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
          <PageTransition>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<RouteWrapper {...route} />}
                />
              ))}
            </Routes>
          </PageTransition>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;