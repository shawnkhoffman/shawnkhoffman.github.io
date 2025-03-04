/**
 * General testing utilities for DOM operations and rendering
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TestThemeProvider } from './test-components';
import type { RenderOptions } from '@testing-library/react';
import type { Theme } from '@/types/theme';

const mountedContainers = new Set<HTMLElement>();

/**
 * Cleanup function to unmount all rendered components
 */
export function cleanup() {
  mountedContainers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
  mountedContainers.clear();
}

interface CustomRenderOptions extends RenderOptions {
  withRouter?: boolean;
  withTheme?: boolean;
  theme?: Theme;
}

/**
 * Renders a React component in a JSDOM environment
 */
export async function render(
  element: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  mountedContainers.add(container);
  
  const root = createRoot(container);
  
  const { 
    wrapper: CustomWrapper, 
    withRouter = false,
    withTheme = true,
    theme = 'light'
  } = options;
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let wrappedContent = children;
    
    if (withTheme) {
      wrappedContent = (
        <TestThemeProvider initialTheme={theme}>
          {wrappedContent}
        </TestThemeProvider>
      );
    }
    
    if (withRouter) {
      wrappedContent = (
        <BrowserRouter>
          {wrappedContent}
        </BrowserRouter>
      );
    }
    
    if (CustomWrapper) {
      wrappedContent = (
        <CustomWrapper>
          {wrappedContent}
        </CustomWrapper>
      );
    }
    
    return <>{wrappedContent}</>;
  };
  
  const containerCleanup = () => {
    root.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
      mountedContainers.delete(container);
    }
  };
  
  await new Promise<void>((resolve) => {
    root.render(<Wrapper>{element}</Wrapper>);
    setTimeout(resolve, 0);
  });
  
  const queries = {
    getByText: (text: string | RegExp): HTMLElement => {
      const elements = Array.from(container.querySelectorAll('*'))
        .filter(el => {
          const content = el.textContent || '';
          return typeof text === 'string' 
            ? content.includes(text) 
            : text.test(content);
        });
      
      if (elements.length === 0) {
        throw new Error(`Could not find element with text: ${text}`);
      }
      
      return elements[0] as HTMLElement;
    },
    queryByText: (text: string | RegExp): HTMLElement | null => {
      try {
        return queries.getByText(text);
      } catch {
        return null;
      }
    },
    getByTestId: (testId: string): HTMLElement => {
      const element = container.querySelector(`[data-testid="${testId}"]`);
      if (!element) {
        throw new Error(`Could not find element with data-testid: ${testId}`);
      }
      return element as HTMLElement;
    },
    queryByTestId: (testId: string): HTMLElement | null => {
      const element = container.querySelector(`[data-testid="${testId}"]`);
      return element as HTMLElement || null;
    },
    getByRole: (role: string): HTMLElement => {
      const element = container.querySelector(`[role="${role}"]`);
      if (!element) {
        throw new Error(`Could not find element with role: ${role}`);
      }
      return element as HTMLElement;
    },
    getAllByRole: (role: string): HTMLElement[] => {
      const elements = Array.from(container.querySelectorAll(`[role="${role}"]`));
      if (elements.length === 0) {
        throw new Error(`Could not find elements with role: ${role}`);
      }
      return elements as HTMLElement[];
    }
  };
  
  return {
    container,
    root,
    cleanup: containerCleanup,
    ...queries
  };
}

/**
 * Waits for a condition to be true
 */
export function waitFor(
  callback: () => boolean | Promise<boolean>,
  { timeout = 1000, interval = 50 } = {}
): Promise<void> {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        if (await callback()) {
          resolve();
          return;
        }
      } catch (error) {
        console.error('Error in waitFor callback:', error);
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timed out after ${timeout}ms`));
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
}

/**
 * Helper to simulate events - simplified for JSDOM compatibility
 */
export const fireEvent = {
  click: (element: HTMLElement) => {
    if (element && typeof element.click === 'function') {
      element.click();
    } else {
      const onClickAttr = element.getAttribute('onclick');
      if (onClickAttr) {
        eval(onClickAttr);
      }
      
      if ((element as HTMLElement & { onclick?: (event: MouseEvent) => void }).onclick) {
        (element as HTMLElement & { onclick?: (event: MouseEvent) => void }).onclick?.({
          currentTarget: element,
          target: element,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as unknown as MouseEvent);
      }
    }
  },
  change: (element: HTMLInputElement, value: string) => {
    element.value = value;
    
    if ((element as HTMLInputElement & { onchange?: (event: Event) => void }).onchange) {
      (element as HTMLInputElement & { onchange?: (event: Event) => void }).onchange?.({
        currentTarget: element,
        target: element,
        preventDefault: () => {},
        stopPropagation: () => {}
      } as unknown as Event);
    }
  },
  focus: (element: HTMLElement) => {
    element.focus();
  },
  blur: (element: HTMLElement) => {
    element.blur();
  }
}; 