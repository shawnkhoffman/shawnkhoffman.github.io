import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import Footer from '@components/layout/Footer';
import { render, mockGtag, fireEvent } from '@tests/utils';

describe('Footer', () => {
  let gtagMock: ReturnType<typeof mockGtag>;

  beforeEach(() => {
    gtagMock = mockGtag();
  });

  afterEach(() => {
    gtagMock.restore();
  });

  test('renders with copyright text', async () => {
    const { getByText } = await render(<Footer />);
    const currentYear = new Date().getFullYear();
    
    expect(getByText(`© ${currentYear} Shawn Hoffman. All rights reserved.`)).toBeTruthy();
  });
  
  test('includes social links', async () => {
    const { container } = await render(<Footer />);
    
    const githubLink = container.querySelector('a[href="https://github.com/shawnkhoffman"]');
    expect(githubLink).toBeTruthy();
    
    const linkedinLink = container.querySelector('a[href="https://www.linkedin.com/in/shawnkhoffman"]');
    expect(linkedinLink).toBeTruthy();
  });
  
  test('tracks analytics when links are clicked', async () => {
    const { container } = await render(<Footer />);
    
    const githubLink = container.querySelector('a[href="https://github.com/shawnkhoffman"]') as HTMLElement;
    expect(githubLink).toBeTruthy();
    
    gtagMock.clearCalls();
    
    fireEvent.click(githubLink);
    
    expect(gtagMock.mock.mock.calls.length).toBeGreaterThan(0);
    
    const hasExpectedCall = gtagMock.mock.mock.calls.some((call: unknown[]) => {
      if (call.length < 3) return false;
      
      const command = String(call[0]);
      const action = String(call[1]);
      const params = call[2] as Record<string, unknown> | undefined;
      
      return command === 'event' && 
        action !== undefined &&
        params !== undefined;
    });
    
    expect(hasExpectedCall).toBe(true);
  });
}); 