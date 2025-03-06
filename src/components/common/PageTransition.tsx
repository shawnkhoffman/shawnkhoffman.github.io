import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    const transitionTimeout = setTimeout(() => {
      setDisplayContent(children);
      
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 50);
    
    return () => clearTimeout(transitionTimeout);
  }, [location.pathname, children]);

  return (
    <div
      className={`transition-opacity duration-150 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayContent}
    </div>
  );
};

export default PageTransition; 