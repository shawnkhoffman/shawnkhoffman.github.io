/**
 * React components for testing
 */

import * as React from 'react';
import { ThemeContext } from '@hooks/useTheme';
import type { Theme } from '@/types/theme';

/**
 * Theme provider wrapper for tests
 */
export const TestThemeProvider: React.FC<{ 
  children: React.ReactNode;
  initialTheme?: Theme;
}> = ({ children, initialTheme = 'light' }) => {
  const [theme, setTheme] = React.useState(initialTheme);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 