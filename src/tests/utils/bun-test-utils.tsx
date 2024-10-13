import React from 'react';
import { render as testingLibRender, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { expect } from 'bun:test';

export { screen, fireEvent, waitFor, within };

export function render(
  ui: React.ReactElement,
  options: { 
    wrapper?: React.ComponentType<unknown>;
    route?: string;
    [key: string]: unknown;
  } = {}
) {
  const { wrapper: Wrapper = React.Fragment, ...renderOptions } = options;

  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <Wrapper>{children}</Wrapper>;
  };

  return {
    ...testingLibRender(ui, {
      wrapper: AllProviders,
      ...renderOptions,
    }),
  };
}

export async function clickAndVerify(element: HTMLElement) {
  fireEvent.click(element);
  return element;
}

export function getByTestId(testId: string) {
  return screen.getByTestId(testId);
}

export function expectElement(element: HTMLElement | null | undefined) {
  const baseExpect = expect(element);
  
  return {
    ...baseExpect,
    
    toBeInTheDocument() {
      if (!element) {
        throw new Error('Expected element to be in the document, but it was not found');
      }
      return baseExpect.toBeTruthy();
    },
    
    toHaveTextContent(expected: string | RegExp) {
      if (!element) {
        throw new Error('Cannot check text content of null element');
      }
      
      const content = element.textContent || '';
      
      if (typeof expected === 'string') {
        if (!content.includes(expected)) {
          throw new Error(`Expected element to have text content "${expected}" but got "${content}"`);
        }
      } else if (!expected.test(content)) {
        throw new Error(`Expected element to match text pattern ${expected} but got "${content}"`);
      }
    },
    
    toHaveAttribute(attr: string, value?: string) {
      if (!element) {
        throw new Error('Cannot check attributes of null element');
      }
      
      const hasAttr = element.hasAttribute(attr);
      if (!hasAttr) {
        throw new Error(`Expected element to have attribute "${attr}" but it was not found`);
      }
      
      if (value !== undefined) {
        const attrValue = element.getAttribute(attr);
        if (attrValue !== value) {
          throw new Error(`Expected attribute "${attr}" to have value "${value}" but got "${attrValue}"`);
        }
      }
    },
    
  };
}

export function expectValue<T>(value: T) {
  const baseExpect = expect(value);
  
  return {
    ...baseExpect,
    
    toBeGreaterThan(expected: number) {
      if (typeof value !== 'number') {
        throw new Error(`Expected a number but got ${typeof value}`);
      }
      
      if (!(value > expected)) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    }
  };
}
