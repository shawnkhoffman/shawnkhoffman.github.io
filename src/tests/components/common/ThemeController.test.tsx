import React, { useState, useEffect } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeController from '../../../components/common/ThemeController';
import '@testing-library/jest-dom';
import { ThemeContext } from '../../../hooks/useTheme';
import userEvent from '@testing-library/user-event';

describe('ThemeController', () => {
  type Theme = 'light' | 'dark' | 'system';

  interface ThemeWrapperProps {
    initialTheme?: Theme;
    children: React.ReactNode;
  }

  const mockSetTheme = vi.fn();

  const ThemeWrapper = ({ children, initialTheme = 'light' }: ThemeWrapperProps) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
      setTheme(initialTheme);
    }, [initialTheme]);

    return (
      <ThemeContext.Provider value={{ theme, setTheme: mockSetTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };

  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders the light theme icon and label if showLabel is true', () => {
    render(
      <ThemeWrapper>
        <ThemeController showLabel={true} />
      </ThemeWrapper>
    );
    expect(screen.getByLabelText('Switch theme to dark mode')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('toggles the theme correctly on button click', () => {
    render(
      <ThemeWrapper>
        <ThemeController />
      </ThemeWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Switch theme to dark mode' }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    mockSetTheme.mockClear();
    render(
      <ThemeWrapper initialTheme="dark">
        <ThemeController />
      </ThemeWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Switch theme to system mode' }));
    expect(mockSetTheme).toHaveBeenCalledWith('system');

    mockSetTheme.mockClear();
    render(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Switch theme to light mode' }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders the correct system icon based on device type', () => {
    const { container, rerender } = render(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );

    act(() => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));
    });
    expect(container).toMatchSnapshot('DesktopIcon');

    act(() => {
      global.innerWidth = 800;
      global.dispatchEvent(new Event('resize'));
    });
    rerender(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot('TabletIcon');

    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));
    });
    rerender(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot('MobileIcon');
  });

  it('renders different icons for each theme', () => {
    const { container, rerender } = render(
      <ThemeWrapper initialTheme="light">
        <ThemeController />
      </ThemeWrapper>
    );

    expect(container).toMatchSnapshot('LightThemeIcon');

    rerender(
      <ThemeWrapper initialTheme="dark">
        <ThemeController />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot('DarkThemeIcon');

    rerender(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );
    expect(container).toMatchSnapshot('SystemThemeIcon');
  });

  it('applies and removes animation class correctly when theme is changed', () => {
    vi.useFakeTimers();

    render(
      <ThemeWrapper initialTheme="light">
        <ThemeController />
      </ThemeWrapper>
    );

    const button = screen.getByRole('button', { name: 'Switch theme to dark mode' });
    const icon = button.querySelector('svg');

    fireEvent.click(button);

    expect(icon).toHaveClass('animate-rotate-sun');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(icon).not.toHaveClass('animate-rotate-sun');

    vi.useRealTimers();
  });

  it('is accessible via keyboard navigation', async () => {
    render(
      <ThemeWrapper>
        <ThemeController />
      </ThemeWrapper>
    );

    const button = screen.getByRole('button', { name: 'Switch theme to dark mode' });

    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('handles invalid theme values gracefully', () => {
    render(
      <ThemeWrapper initialTheme={'invalid' as unknown as Theme}>
        <ThemeController />
      </ThemeWrapper>
    );

    const button = screen.getByRole('button', { name: 'Switch theme to light mode' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('matches snapshot for light theme', () => {
    const { container } = render(
      <ThemeWrapper initialTheme="light">
        <ThemeController />
      </ThemeWrapper>
    );

    expect(container).toMatchSnapshot('LightTheme');
  });

  it('matches snapshot for dark theme', () => {
    const { container } = render(
      <ThemeWrapper initialTheme="dark">
        <ThemeController />
      </ThemeWrapper>
    );

    expect(container).toMatchSnapshot('DarkTheme');
  });

  it('matches snapshot for system theme', () => {
    const { container } = render(
      <ThemeWrapper initialTheme="system">
        <ThemeController />
      </ThemeWrapper>
    );

    expect(container).toMatchSnapshot('SystemTheme');
  });
});