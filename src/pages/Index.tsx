import React from 'react';
import logo from '../assets/images/react.svg';

const Index: React.FC = () => {
  const handleLinkClick = () => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Outbound Link',
        event_label: 'GitHub Source Code',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center">
      <img
        src={logo}
        className="animate-spinSlow w-32 h-32 mb-8 dark:shadow-none"
        alt="React Logo"
        loading="lazy"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome to My Portfolio</h1>
      <p className="text-lg mb-6">Built in React</p>

      <a
        href="https://github.com/shawnkhoffman/shawnkhoffman.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-ghost mt-4"
        onClick={handleLinkClick}
      >
        View Source Code
      </a>
    </div>
  );
};

export default Index;