import React, { useState, useEffect } from 'react';
import { ThemeContext } from '../hooks/useTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appliedTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;
    root.setAttribute('data-theme', appliedTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};