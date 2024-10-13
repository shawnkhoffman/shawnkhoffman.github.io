import React from 'react';
import { test, describe, beforeEach, afterEach, expect } from 'bun:test';
import { render, fireEvent } from '@tests/utils/bun-test-utils';
import { expectElement, expectValue } from '@tests/utils/bun-test-utils';
import Footer from '@components/layout/Footer';

const TestFooter = () => <Footer />;

describe('Footer Component', () => {
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

  test('renders with copyright text and current year', () => {
    const { container } = render(<TestFooter />);
    
    const footer = container.querySelector('footer') as HTMLElement;
    expectElement(footer).toBeInTheDocument();
    
    const currentYear = new Date().getFullYear();
    const copyrightText = container.textContent;
    expect(copyrightText?.includes(`© ${currentYear} Shawn Hoffman`)).toBeTruthy();
  });

  test('includes social links with proper attributes', () => {
    const { container } = render(<TestFooter />);
    
    const links = container.querySelectorAll('a');
    expectValue(links.length).toBeGreaterThan(0);
    
    const githubLink = Array.from(links).find(link => 
      link.getAttribute('href')?.includes('github.com')
    ) as HTMLAnchorElement;
    expectElement(githubLink).toBeInTheDocument();
    
    if (githubLink) {
      const ariaLabel = githubLink.getAttribute('aria-label');
      expect(ariaLabel?.toLowerCase().includes('github')).toBeTruthy();
      expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
    }
    
    const linkedinLink = Array.from(links).find(link => 
      link.getAttribute('href')?.includes('linkedin.com')
    );
    expect(linkedinLink).toBeTruthy();
    
    if (linkedinLink) {
      const ariaLabel = linkedinLink.getAttribute('aria-label');
      expect(ariaLabel?.toLowerCase().includes('linkedin')).toBeTruthy();
    }
    
    const twitterLink = Array.from(links).find(link => 
      link.getAttribute('href')?.includes('x.com') || link.getAttribute('href')?.includes('twitter.com')
    );
    expect(twitterLink).toBeTruthy();
    
    if (twitterLink) {
      const ariaLabel = twitterLink.getAttribute('aria-label');
      expect(ariaLabel?.toLowerCase().match(/twitter|x/i)).toBeTruthy();
    }
  });

  test('tracks social link clicks with gtag', () => {
    const { container } = render(<TestFooter />);
    
    const socialLinks = container.querySelectorAll('a[aria-label]');
    expectValue(socialLinks.length).toBeGreaterThan(0);
    
    if (socialLinks.length > 0) {
      const firstLink = socialLinks[0] as HTMLAnchorElement;
      expectElement(firstLink).toBeInTheDocument();
      
      fireEvent.click(firstLink);
      
      expect(window.gtagCalls).toBeTruthy();
      expectValue(window.gtagCalls.length).toBeGreaterThan(0);
      expect(window.gtagCalls[0].command).toBe('event');
    }
  });

  test('has responsive design classes', () => {
    const { container } = render(<TestFooter />);
    
    const footer = container.querySelector('footer') as HTMLElement;
    expectElement(footer).toBeInTheDocument();
    
    if (footer) {
      expect(footer.classList.contains('bg-base-100')).toBeTruthy();
      
      const flexContainer = (container.querySelector('div.flex-col') || 
                            container.querySelector('div.flex-row')) as HTMLElement;
      expectElement(flexContainer).toBeInTheDocument();
    }
  });
}); 