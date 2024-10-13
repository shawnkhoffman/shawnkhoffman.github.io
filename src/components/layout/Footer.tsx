import React from 'react';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

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
    <footer className="footer p-4 bg-base-100 text-base-content">
      <div className="items-center grid-flow-col">
        <p>© {new Date().getFullYear()} Shawn Hoffman. All rights reserved.</p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a
          href="https://github.com/shawnkhoffman"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent hover:bg-base-200 p-0 w-9 h-9 flex items-center justify-center rounded-full"
          onClick={() => handleLinkClick('GitHub')}
        >
          <FaGithub className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/shawnkhoffman"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent hover:bg-base-200 p-0 w-9 h-9 flex items-center justify-center rounded-full"
          onClick={() => handleLinkClick('LinkedIn')}
        >
          <FaLinkedin className="w-6 h-6" />
        </a>
        <a
          href="https://x.com/shawnkhoffman"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent hover:bg-base-200 p-0 w-9 h-9 flex items-center justify-center rounded-full"
          onClick={() => handleLinkClick('X')}
        >
          <FaXTwitter className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;