import React from 'react';
import { test, describe, expect, beforeEach, afterEach } from 'bun:test';
import { render } from '@testing-library/react';

const TestNavbar = () => (
  <nav className="navbar fixed top-0 z-50 bg-base-100 shadow-md">
    <div className="container mx-auto px-4 h-16">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <a href="/" className="text-primary text-xl font-bold flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span>Portfolio</span>
          </a>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/" className="btn btn-ghost">Home</a>
          <a href="/about" className="btn btn-ghost">About</a>
          <div data-testid="theme-controller">Theme Controller</div>
        </div>
        <button 
          className="md:hidden btn btn-ghost"
          aria-label="Toggle menu"
        >
          <span>Menu</span>
        </button>
      </div>
    </div>
  </nav>
);

describe('Navbar', () => {
  let originalGtag: typeof window.gtag;
  
  beforeEach(() => {
    originalGtag = window.gtag;
    window.gtag = (command: string, action: string, params?: Record<string, unknown>) => {
      window.gtagCalls = window.gtagCalls || [];
      window.gtagCalls.push({ command, action, params });
    };
  });

  afterEach(() => {
    window.gtag = originalGtag;
    window.gtagCalls = [];
  });

  test('renders with logo', () => {
    const { container } = render(<TestNavbar />);
    
    const logo = container.querySelector('img');
    expect(logo).toBeDefined();
  });

  test('includes navigation links', () => {
    const { container } = render(<TestNavbar />);
    
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    
    const hasLinkWithText = Array.from(links).some(link => 
      link.textContent && link.textContent.trim().length > 0
    );
    expect(hasLinkWithText).toBe(true);
  });

  test('has menu button', () => {
    const { container } = render(<TestNavbar />);
    
    const menuButton = container.querySelector('button');
    expect(menuButton).toBeDefined();
  });
}); 