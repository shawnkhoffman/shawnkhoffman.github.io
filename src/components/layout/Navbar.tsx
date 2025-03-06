import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { FaBars, FaCaretDown } from 'react-icons/fa';
import ThemeController from '../common/ThemeController';
import logo from '../../assets/images/react.svg';

interface SubmenuItem {
  href: string;
  label: string;
}

interface LinkItem {
  href?: string;
  label: string;
  submenu?: SubmenuItem[];
}

interface GestureState {
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  velocity: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.5;
const DRAWER_WIDTH = 300;

const links: LinkItem[] = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    submenu: [
      { href: '/about-me', label: 'About Me' },
      { href: '/about-this-site', label: 'About This Site' },
    ],
  },
];

const calculateVelocity = (distance: number, time: number): number => {
  return Math.abs(distance) / (time || 1);
};

const determineDirection = (dx: number, dy: number): 'left' | 'right' | 'up' | 'down' => {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
};

const NavLink = memo(({ href, label, onClick }: {
  href: string;
  label: string;
  onClick: (label: string) => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick(label);
    window.location.href = href;
  };

  return (
    <a
      href={href}
      className="px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
      onClick={handleClick}
      aria-label={label}
      role="menuitem"
    >
      {label}
    </a>
  );
});

NavLink.displayName = 'NavLink';

const Submenu = memo(({ 
  items, 
  isOpen, 
  onItemClick 
}: {
  items: SubmenuItem[];
  isOpen: boolean;
  onItemClick: (label: string) => void;
}) => (
  <div
    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 origin-top-right ${
      isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
    }`}
    role="menu"
    aria-orientation="vertical"
    aria-hidden={!isOpen}
  >
    <div className="py-1">
      {items.map((item, index) => {
        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          onItemClick(item.label);
          window.location.href = item.href;
        };

        return (
          <a
            key={`${item.label}-${index}`}
            href={item.href}
            className="block px-4 py-2 text-sm text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
            onClick={handleClick}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  </div>
));

Submenu.displayName = 'Submenu';

const MobileMenu = memo(({
  isOpen,
  links,
  onLinkClick,
  onClose,
  dataTestId
}: {
  isOpen: boolean;
  links: LinkItem[];
  onLinkClick: (label: string) => void;
  onClose: () => void;
  dataTestId: string;
}) => {
  const [{ startX, moveX, direction }, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    velocity: 0,
    direction: null
  });
  
  const [openSubmenuIndexes, setOpenSubmenuIndexes] = useState<number[]>([]);
  const touchStartTimeRef = useRef<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const focusTrapRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = useCallback((index: number) => {
    setOpenSubmenuIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  const currentDrawerPosition = useCallback(() => {
    if (!isDrawing.current) return 0;
    const dx = moveX - startX;
    return Math.max(0, Math.min(dx, DRAWER_WIDTH));
  }, [moveX, startX]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartTimeRef.current = Date.now();
    setGestureState({
      startX: touch.clientX,
      startY: touch.clientY,
      moveX: touch.clientX,
      moveY: touch.clientY,
      velocity: 0,
      direction: null
    });
    isDrawing.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDrawing.current) return;

    const touch = e.touches[0];
    setGestureState(prev => {
      const dx = touch.clientX - prev.startX;
      const dy = touch.clientY - prev.startY;
      const timeDelta = Date.now() - touchStartTimeRef.current;
      const velocity = calculateVelocity(dx, timeDelta);
      const direction = determineDirection(dx, dy);

      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }

      return {
        ...prev,
        moveX: touch.clientX,
        moveY: touch.clientY,
        velocity,
        direction
      };
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDrawing.current) return;
    
    const dx = moveX - startX;
    const timeDelta = Date.now() - touchStartTimeRef.current;
    const velocity = calculateVelocity(dx, timeDelta);

    const shouldClose =
      (dx > SWIPE_THRESHOLD && direction === 'right') ||
      (velocity > VELOCITY_THRESHOLD && direction === 'right') ||
      (dx > DRAWER_WIDTH / 2);

    if (shouldClose) {
      onClose();
    }

    isDrawing.current = false;
    setGestureState({
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      velocity: 0,
      direction: null
    });
  }, [moveX, startX, direction, onClose]);

  const drawerStyle = useMemo(() => {
    const position = currentDrawerPosition();
    if (position > 0) {
      return {
        transform: `translateX(${position}px)`,
        transition: 'none'
      };
    }
    return {
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  }, [isOpen, currentDrawerPosition]);

  const handleMobileLink = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    onLinkClick(label);
    window.location.href = href;
  }, [onLinkClick]);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || !focusTrapRef.current) return;

      const focusableElements = focusTrapRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-25' : 'opacity-0'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="lg:hidden fixed inset-y-0 right-0 w-full max-w-xs bg-base-100 shadow-xl transform"
        ref={drawerRef}
        style={drawerStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        data-testid={dataTestId}
      >
        <div ref={focusTrapRef} className="h-full flex flex-col">
          <div className="px-4 pt-5 pb-4 flex items-center justify-between border-b border-base-300">
            <div className="flex items-center">
              <span className="text-xl font-bold">My Portfolio</span>
              <img
                src={logo}
                className="animate-spinSlow w-6 h-6 ml-2"
                alt="React Logo"
                loading="lazy"
              />
            </div>
            <div>
              <button
                onClick={onClose}
                className="ml-1 p-2 rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close menu"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="flex-grow px-4 pt-5 pb-4 space-y-4 overflow-y-auto">
            {links.map((link, index) => (
              <div key={`mobile-${index}`}>
                {link.submenu ? (
                  <div className="list-none">
                    <button
                      className="flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={() => toggleSubmenu(index)}
                      aria-expanded={openSubmenuIndexes.includes(index)}
                      aria-controls={`submenu-${index}`}
                    >
                      <span>{link.label}</span>
                      <FaCaretDown 
                        className={`transition-transform duration-300 ${
                          openSubmenuIndexes.includes(index) ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`submenu-${index}`}
                      className={`pl-4 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                        openSubmenuIndexes.includes(index) ? 'max-h-48' : 'max-h-0'
                      }`}
                    >
                      {link.submenu.map((item, subIndex) => (
                        <a
                          key={`mobile-${index}-${subIndex}`}
                          href={item.href}
                          className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                          onClick={(e) => handleMobileLink(e, item.href, item.label)}
                          role="menuitem"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={(e) => handleMobileLink(e, link.href!, link.label)}
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-auto px-4 py-4 border-t border-base-300">
            <ThemeController
              showLabel={true}
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
});

MobileMenu.displayName = 'MobileMenu';

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDetailsElement>(null);

  const handleLinkClick = useCallback((label: string) => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Navigation',
        event_label: label,
      });
    }
    setIsDrawerOpen(false);
    setIsAboutOpen(false);
  }, []);

  const toggleAboutMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(prev => !prev);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isAboutOpen && aboutRef.current && !aboutRef.current.contains(target)) {
        setIsAboutOpen(false);
      }
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsAboutOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyboard);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [isAboutOpen]);

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

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      data-testid="main-navigation"
      className="bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a
              href="/"
              className={`text-xl font-bold transform transition-all duration-300 ${
                isDrawerOpen ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('Home');
                window.location.href = '/';
              }}
              aria-label="Home"
            >
              My Portfolio
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-4" role="list" aria-label="Desktop navigation">
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
                      className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={toggleAboutMenu}
                      role="button"
                      aria-expanded={isAboutOpen}
                      aria-controls="desktop-about-submenu"
                    >
                      {link.label}
                      <FaCaretDown
                        className={`ml-1 transition-transform duration-300 ${
                          isAboutOpen ? 'rotate-180' : ''
                        } hidden lg:inline`}
                        aria-hidden="true"
                      />
                    </summary>
                    <Submenu 
                      items={link.submenu} 
                      isOpen={isAboutOpen} 
                      onItemClick={handleLinkClick}
                    />
                  </details>
                ) : (
                  <NavLink 
                    href={link.href!} 
                    label={link.label} 
                    onClick={handleLinkClick}
                  />
                )}
              </div>
            ))}
            <div className="relative">
              <ThemeController />
            </div>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-menu"
            >
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isDrawerOpen}
        links={links}
        onLinkClick={handleLinkClick}
        onClose={handleDrawerClose}
        dataTestId="mobile-navigation-menu"
      />
    </nav>
  );
};

export default memo(Navbar);
