import React, { useState, useEffect, useRef } from 'react';
import ThemeController from '../common/ThemeController';
import { FaBars, FaCaretDown } from 'react-icons/fa';
import logo from '../../assets/images/react.svg';

const links = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    submenu: [
      { href: '/about-me', label: 'About Me' },
      { href: '/about-this-site', label: 'About This Site' },
    ],
  },
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

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

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

  const toggleAboutMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <nav className="bg-base-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a
              href="/"
              className={`text-xl font-bold transform transition-all duration-300 ${
                isDrawerOpen ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
              }`}
              onClick={() => handleLinkClick('Home')}
              aria-label="My Portfolio"
            >
              My Portfolio
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {links.map((link, index) => (
              <div key={index} className="relative">
                {link.submenu ? (
                  <details
                    ref={aboutRef}
                    className="group list-none"
                    open={isAboutOpen}
                    onToggle={(e) => setIsAboutOpen((e.target as HTMLDetailsElement).open)}
                  >
                    <summary
                      className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 cursor-pointer"
                      onClick={toggleAboutMenu}
                      aria-label="About Menu"
                      aria-expanded={isAboutOpen}
                      role="button"
                    >
                      {link.label}
                      <FaCaretDown
                        className={`ml-1 transition-transform duration-300 ${
                          isAboutOpen ? 'rotate-180' : ''
                        } hidden lg:inline`}
                        aria-hidden="true"
                      />
                    </summary>
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 origin-top-right ${isAboutOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {link.submenu.map((submenuItem, subIndex) => (
                          <a
                            key={`${index}-${subIndex}`}
                            href={submenuItem.href}
                            className="block px-4 py-2 text-sm text-base-content hover:bg-base-200"
                            onClick={() => handleLinkClick(submenuItem.label)}
                            aria-label={submenuItem.label}
                          >
                            {submenuItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </details>
                ) : (
                  <a
                    href={link.href}
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-base-200"
                    onClick={() => handleLinkClick(link.label)}
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            <ThemeController />
          </div>

          <div className="flex items-center lg:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isDrawerOpen}
            >
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-hidden={!isDrawerOpen}
      >
        <div
          ref={drawerRef}
          role="menu"
          aria-label="Mobile navigation drawer"
          aria-hidden={!isDrawerOpen}
          className={`fixed inset-y-0 right-0 w-full max-w-xs bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 pt-5 pb-4 flex items-center border-b border-base-300">
              <span className="text-xl font-bold mr-3">My Portfolio</span>
              <img
                src={logo}
                className="animate-spinSlow w-6 h-6"
                alt="React Logo"
              />
            </div>
            <div className="flex-grow px-4 pt-5 pb-4 space-y-4">
              <nav className="space-y-2">
                {links.map((link, index) => (
                  <div key={`mobile-${index}`}>
                    {link.submenu ? (
                      <details className="group list-none">
                        <summary className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 cursor-pointer">
                          <span>{link.label}</span>
                        </summary>
                        <ul className="pl-4 mt-2 space-y-1">
                          {link.submenu.map((submenuItem, subIndex) => (
                            <li key={`mobile-${index}-${subIndex}`}>
                              <a
                                href={submenuItem.href}
                                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200"
                                onClick={() => handleLinkClick(submenuItem.label)}
                                aria-label={submenuItem.label}
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
                        className="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200"
                        onClick={() => handleLinkClick(link.label)}
                        aria-label={link.label}
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="mt-auto px-4 py-4 border-t border-base-300">
              <div className="w-full">
                <ThemeController
                  showLabel={true}
                  className="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;