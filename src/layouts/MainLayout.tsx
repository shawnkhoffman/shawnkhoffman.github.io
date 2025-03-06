import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ErrorBoundary from '../components/common/ErrorBoundary';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen text-base-content">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-content focus:rounded-md"
      >
        Skip to content
      </a>
      <Navbar />
      <main 
        id="main-content" 
        className="flex-grow flex flex-col justify-center items-center bg-base-200 text-base-content pt-16"
        style={{ scrollMarginTop: '4rem' }}
      >
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Global ErrorBoundary caught an error:', error, errorInfo);
          }}
        >
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;