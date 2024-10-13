import React from 'react';
import ThemeSwitcher from '../common/ThemeController';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  // { href: '#projects', label: 'Projects' },
  // { href: '#contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const handleLinkClick = (label: string) => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Navigation',
        event_label: label,
      });
    }
  };

  return (
    <nav className="navbar bg-base-100 p-4" aria-label="Main Navigation">
      <div className="flex-1">
        <a
          href="/"
          className="btn btn-ghost normal-case text-xl bg-transparent hover:bg-transparent focus:outline-none"
          onClick={() => handleLinkClick('Home')}
        >
          My Portfolio
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0" role="navigation">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-base-content hover:text-primary"
                onClick={() => handleLinkClick(link.label)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;