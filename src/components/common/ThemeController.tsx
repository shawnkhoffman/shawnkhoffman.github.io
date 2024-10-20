import React, { memo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon, FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

type Theme = 'light' | 'dark' | 'system';
type DeviceType = 'desktop' | 'mobile' | 'tablet';

interface ThemeControllerProps {
  showLabel?: boolean;
  className?: string;
}

const ThemeController: React.FC<ThemeControllerProps> = memo(({ showLabel = false, className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const updateDeviceType = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setDeviceType('mobile');
    } else if (width >= 768 && width < 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  useEffect(() => {
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => {
      window.removeEventListener('resize', updateDeviceType);
    };
  }, [updateDeviceType]);

  const getNextTheme = useCallback((currentTheme: Theme): Theme => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    return themeOrder[(currentIndex + 1) % themeOrder.length];
  }, []);

  const getAnimationClass = useCallback((iconTheme: Theme) => {
    switch (iconTheme) {
      case 'light':
        return 'animate-rotate-sun';
      case 'dark':
        return 'animate-rotate-moon';
      case 'system':
        return 'animate-rotate-system';
      default:
        return '';
    }
  }, []);

  const renderSystemIcon = useCallback(
    (combinedClasses: string) => {
      switch (deviceType) {
        case 'mobile':
          return <FaMobileAlt className={`text-info ${combinedClasses}`} aria-hidden="true" />;
        case 'tablet':
          return <FaTabletAlt className={`text-info ${combinedClasses}`} aria-hidden="true" />;
        default:
          return <FaDesktop className={`text-info ${combinedClasses}`} aria-hidden="true" />;
      }
    },
    [deviceType]
  );

  const getAriaLabel = useCallback(
    (currentTheme: Theme): string => {
      const nextTheme = getNextTheme(currentTheme);
      return `Switch theme to ${nextTheme} mode`;
    },
    [getNextTheme]
  );

  const toggleTheme = useCallback(() => {
    setShouldAnimate(true);
    const nextTheme = getNextTheme(theme as Theme);
    setTheme(nextTheme);

    setTimeout(() => {
      setShouldAnimate(false);
    }, 200);
  }, [theme, setTheme, getNextTheme]);

  const renderIcon = useCallback(() => {
    const baseClasses = 'w-5 h-5 transition-transform';
    const animationClass = shouldAnimate ? getAnimationClass(theme as Theme) : '';
    const combinedClasses = `${baseClasses} ${animationClass}`;

    switch (theme) {
      case 'light':
        return <FaSun className={`text-content ${combinedClasses}`} aria-hidden="true" />;
      case 'dark':
        return <FaMoon className={`text-content ${combinedClasses}`} aria-hidden="true" />;
      case 'system':
      default:
        return renderSystemIcon(combinedClasses);
    }
  }, [theme, shouldAnimate, getAnimationClass, renderSystemIcon]);

  return (
    <button
      className={`flex items-center justify-center p-2 rounded-full hover:bg-base-200 ${className}`}
      onClick={toggleTheme}
      aria-label={getAriaLabel(theme as Theme)}
    >
      <div className="flex items-center justify-center space-x-1">
        {renderIcon()}
        {showLabel && <span className="text-md">Theme</span>}
      </div>
    </button>
  );
});

export default ThemeController;