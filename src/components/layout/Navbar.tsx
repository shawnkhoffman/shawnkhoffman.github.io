import React, { useState, useEffect, useRef } from 'react';
import ThemeController from '../common/ThemeController';
import { FaBars } from 'react-icons/fa';

const links = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    submenu: [
      { href: '/about-me', label: 'About Me' },
      { href: '/about-this-site', label: 'About This Site' },
    ],
  },
  // { href: '#projects', label: 'Projects' },
];

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDetailsElement | null>(null);

  const handleLinkClick = (label: string) => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Navigation',
        event_label: label,
      });
    }
    setIsDrawerOpen(false);
    setIsAboutOpen(false);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance > 50) {
        setIsDrawerOpen(false);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(target)) {
        setIsDrawerOpen(false);
      }
      if (isAboutOpen && aboutRef.current && !aboutRef.current.contains(target)) {
        setIsAboutOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen, isAboutOpen]);

  const toggleAboutMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a
          href="/"
          className="btn btn-ghost normal-case text-xl bg-transparent hover:bg-transparent focus:outline-none"
          onClick={() => handleLinkClick('Home')}
        >
          My Portfolio
        </a>
      </div>

      <div className="hidden lg:flex flex-none items-center">
        <ul className="menu menu-horizontal px-1" role="navigation">
          {links.map((link, index) => (
            <li key={index}>
              {link.submenu ? (
                <details
                  ref={aboutRef}
                  className="relative"
                  open={isAboutOpen}
                  onClick={(e) => e.stopPropagation()}
                >
                  <summary
                    className="flex items-center cursor-pointer"
                    onClick={toggleAboutMenu}
                  >
                    {link.label}
                  </summary>
                  <ul className="bg-base-100 rounded-lg p-2 shadow-lg mt-1">
                    {link.submenu.map((submenuItem, subIndex) => (
                      <li key={`${index}-${subIndex}`}>
                        <a
                          href={submenuItem.href}
                          className="text-sm text-base-content hover:text-primary whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLinkClick(submenuItem.label);
                          }}
                        >
                          {submenuItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a
                  href={link.href}
                  className="text-sm text-base-content hover:text-primary"
                  onClick={() => handleLinkClick(link.label)}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <ThemeController />
      </div>

      <div className="flex-none lg:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setIsDrawerOpen(true)}
        >
          <FaBars className="text-xl" />
        </button>

        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-base-200 bg-opacity-90 transition-opacity"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={drawerRef}
              className="absolute top-0 right-0 w-64 h-full bg-base-100 shadow-lg flex flex-col"
            >
              <button
                className="btn btn-ghost absolute top-2 right-2"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close
              </button>
              <ul className="menu bg-base-200 text-base-content p-4 flex-grow">
                {links.map((link, index) => (
                  <li key={`drawer-${index}`}>
                    {link.submenu ? (
                      <details className="relative">
                        <summary className="flex items-center cursor-pointer">
                          {link.label}
                        </summary>
                        <ul className="p-2">
                          {link.submenu.map((submenuItem, subIndex) => (
                            <li key={`drawer-${index}-${subIndex}`}>
                              <a
                                href={submenuItem.href}
                                className="text-sm text-base-content hover:text-primary"
                                onClick={() => handleLinkClick(submenuItem.label)}
                              >
                                {submenuItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-base-content hover:text-primary"
                        onClick={() => handleLinkClick(link.label)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t border-base-300 flex items-center">
                <ThemeController showLabel={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;