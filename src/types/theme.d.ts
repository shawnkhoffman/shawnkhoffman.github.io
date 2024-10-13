export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}