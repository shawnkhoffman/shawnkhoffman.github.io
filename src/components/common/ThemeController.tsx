import React, { memo, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

type Theme = 'light' | 'dark' | 'system';

const ThemeController: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(userAgent);
    const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent);

    if (isTablet) {
      setDeviceType('tablet');
    } else if (isMobile) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const toggleTheme = () => {
    setShouldAnimate(true);
    const currentTheme: Theme = theme as Theme;
    const nextTheme = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }[currentTheme];
    setTheme(nextTheme);

    setTimeout(() => setShouldAnimate(false), 200);
  };

  const renderIcon = () => {
    const baseClasses = "w-5 h-5";
    const animationClass = shouldAnimate ? getAnimationClass(theme as Theme) : "";

    switch (theme) {
      case 'light':
        return <FaSun className={`text-content ${baseClasses} ${animationClass}`} />;
      case 'dark':
        return <FaMoon className={`text-content ${baseClasses} ${animationClass}`} />;
      case 'system':
      default:
        return deviceType === 'mobile' ? (
          <FaMobileAlt className={`text-info ${baseClasses}`} />
        ) : deviceType === 'tablet' ? (
          <FaTabletAlt className={`text-info ${baseClasses}`} />
        ) : (
          <FaDesktop className={`text-info ${baseClasses}`} />
        );
    }
  };

  const getAnimationClass = (iconTheme: Theme) => {
    switch (iconTheme) {
      case 'light':
        return 'animate-rotate-sun';
      case 'dark':
        return 'animate-rotate-moon';
      default:
        return '';
    }
  };

  const getAriaLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to system theme';
      default:
        return 'Switch to light theme';
    }
  };

  const getTooltipLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <button
      className="bg-transparent hover:bg-base-200 p-0 w-9 h-9 flex items-center justify-center rounded-full tooltip tooltip-bottom"
      onClick={toggleTheme}
      aria-label={getAriaLabel()}
      data-tip={getTooltipLabel()}
    >
      {renderIcon()}
    </button>
  );
};

export default memo(ThemeController);