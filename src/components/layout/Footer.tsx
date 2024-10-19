import React from 'react';
import { FaMedium, FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer: React.FC = () => {
  const handleLinkClick = (platform: string) => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Outbound Link',
        event_label: platform,
      });
    }
  };

  return (
    <footer className="bg-base-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <p className="text-sm text-base-content">
              © {new Date().getFullYear()} Shawn Hoffman. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://shawnkhoffman.medium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary transition-colors duration-200"
              onClick={() => handleLinkClick('Medium')}
              aria-label="Visit my Medium profile"
            >
              <FaMedium className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/shawnkhoffman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary transition-colors duration-200"
              onClick={() => handleLinkClick('GitHub')}
              aria-label="Visit my GitHub profile"
            >
              <FaGithub className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/shawnkhoffman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary transition-colors duration-200"
              onClick={() => handleLinkClick('LinkedIn')}
              aria-label="Visit my LinkedIn profile"
            >
              <FaLinkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/shawnkhoffman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary transition-colors duration-200"
              onClick={() => handleLinkClick('X')}
              aria-label="Visit my X (formerly Twitter) profile"
            >
              <FaXTwitter className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;