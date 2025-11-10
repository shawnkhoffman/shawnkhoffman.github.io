/**
 * DOM test utilities to safely handle element operations
 */

/**
 * Safely clicks on an element, checking if it exists first
 * @param element The element to click
 * @returns void
 */
export const safeClick = (element: Element | null): void => {
  if (element) {
    element.click();
  } else {
    console.warn('Attempted to click on a null element');
  }
};

/**
 * Safely gets an attribute from an element, checking if it exists first
 * @param element The element to get the attribute from
 * @param attribute The attribute to get
 * @returns The attribute value or null
 */
export const safeGetAttribute = (element: Element | null, attribute: string): string | null => {
  if (element) {
    return element.getAttribute(attribute);
  }
  console.warn(`Attempted to get attribute ${attribute} from a null element`);
  return null;
};

/**
 * Safely checks if an element contains text
 * @param element The element to check
 * @param text The text to check for
 * @returns true if the element contains the text, false otherwise
 */
export const containsText = (element: Element | null, text: string): boolean => {
  if (element && element.textContent) {
    return element.textContent.includes(text);
  }
  return false;
};

/**
 * Type guard to check if an element is an HTMLElement
 * @param element The element to check
 * @returns true if the element is an HTMLElement, false otherwise
 */
export const isHTMLElement = (element: Element | null): element is HTMLElement => {
  return element !== null && element instanceof HTMLElement;
};
