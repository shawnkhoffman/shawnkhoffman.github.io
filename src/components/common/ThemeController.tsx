import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import {
  FaSun,
  FaMoon,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
} from "react-icons/fa";
import { Theme } from "@/types/theme";

const useMediaQuery = (query: string): boolean => {
  const getMatches = (mediaQuery: string): boolean => {
    if (typeof window !== "undefined") {
      return window.matchMedia(mediaQuery).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export type DeviceType = "desktop" | "mobile" | "tablet";

export interface ThemeControllerProps {
  showLabel?: boolean;
  className?: string;
  labelPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  animated?: boolean;
}

const THEME_ORDER: Theme[] = ["light", "dark", "system"];

const DEVICE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const;

const BUTTON_SIZES = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
} as const;

const ANIMATION_CLASSES = {
  light: "animate-rotate-sun",
  dark: "animate-rotate-moon",
  system: "animate-rotate-system",
} as const;

const THEME_LABELS = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
} as const;

const DEVICE_ICONS = {
  mobile: FaMobileAlt,
  tablet: FaTabletAlt,
  desktop: FaDesktop,
} as const;

const ThemeController = memo<ThemeControllerProps>(
  ({
    showLabel = false,
    className = "",
    labelPosition = "right",
    size = "md",
    showTooltip = true,
    animated = true,
  }) => {
    const { theme, setTheme } = useTheme();
    const prefersReducedMotion = useMediaQuery(
      "(prefers-reduced-motion: reduce)"
    );
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const isMobile = useMediaQuery(
      `(max-width: ${DEVICE_BREAKPOINTS.mobile}px)`
    );
    const isTablet = useMediaQuery(
      `(max-width: ${DEVICE_BREAKPOINTS.tablet}px)`
    );

    const deviceType = useMemo((): DeviceType => {
      if (isMobile) return "mobile";
      if (isTablet) return "tablet";
      return "desktop";
    }, [isMobile, isTablet]);

    const iconSize = useMemo(() => ICON_SIZES[size], [size]);
    const buttonSize = useMemo(() => BUTTON_SIZES[size], [size]);

    const shouldAnimate = useMemo(
      () => animated && !prefersReducedMotion,
      [animated, prefersReducedMotion]
    );

    const getNextTheme = useCallback((currentTheme: Theme): Theme => {
      const currentIndex = THEME_ORDER.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
      return THEME_ORDER[nextIndex];
    }, []);

    const handleThemeChange = useCallback(() => {
      setTheme(getNextTheme(theme as Theme));
    }, [theme, setTheme, getNextTheme]);

    useEffect(() => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          prefersDark ? "dark" : "light"
        );
      }
    }, [theme, prefersDark]);

    const renderIcon = useCallback(() => {
      const animationClass = shouldAnimate
        ? ANIMATION_CLASSES[theme as Theme] || ""
        : "";
      const baseClasses = `${iconSize} transition-transform duration-200`;
      const combinedClasses = `${baseClasses} ${animationClass}`;

      switch (theme) {
        case "light":
          return (
            <FaSun
              className={`text-content ${combinedClasses}`}
              aria-hidden="true"
            />
          );
        case "dark":
          return (
            <FaMoon
              className={`text-content ${combinedClasses}`}
              aria-hidden="true"
            />
          );
        case "system": {
          const DeviceIcon = DEVICE_ICONS[deviceType];
          return (
            <DeviceIcon
              className={`text-info ${combinedClasses}`}
              aria-hidden="true"
            />
          );
        }
        default:
          return null;
      }
    }, [theme, deviceType, shouldAnimate, iconSize]);

    const buttonContent = useMemo(
      () => (
        <>
          {renderIcon()}
          {showLabel && (
            <span
              className={`text-sm font-medium ${
                labelPosition === "left" ? "ml-2" : "mr-2"
              }`}
            >
              Theme
            </span>
          )}
        </>
      ),
      [showLabel, labelPosition, renderIcon]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleThemeChange();
        }
      },
      [handleThemeChange]
    );

    return (
      <button
        className={`
        inline-flex items-center justify-center rounded-full
        hover:bg-base-200 focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-info
        ${buttonSize}
        ${className}
      `}
        onClick={handleThemeChange}
        onKeyDown={handleKeyDown}
        aria-label={`Switch theme to ${getNextTheme(theme as Theme)} mode`}
        title={showTooltip ? THEME_LABELS[theme as Theme] : undefined}
        data-theme-controller
        role="switch"
        aria-checked={theme === "dark"}
        data-testid={`theme-switch-${theme}`}
      >
        <div className="flex items-center justify-center relative">
          {buttonContent}
        </div>
      </button>
    );
  }
);

ThemeController.displayName = "ThemeController";

export default ThemeController;
