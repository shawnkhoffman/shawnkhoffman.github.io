import React, { memo, useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon, FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

type Theme = 'light' | 'dark' | 'system';
type DeviceType = 'desktop' | 'mobile' | 'tablet';

interface ThemeControllerProps {
  showLabel?: boolean;
  className?: string;
}

const ThemeController: React.FC<ThemeControllerProps> = ({ showLabel = false, className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const updateDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setDeviceType('mobile');
    } else if (width >= 768 && width < 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  };

  useEffect(() => {
    updateDeviceType();

    window.addEventListener('resize', updateDeviceType);

    return () => {
      window.removeEventListener('resize', updateDeviceType);
    };
  }, []);

  const toggleTheme = () => {
    setShouldAnimate(true);
    const nextTheme = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }[theme as Theme] as Theme;
    setTheme(nextTheme);

    setTimeout(() => {
      setShouldAnimate(false);
    }, 200);
  };

  const renderIcon = () => {
    const baseClasses = "w-5 h-5 transition-transform";
    const animationClass = shouldAnimate ? getAnimationClass(theme as Theme) : "";
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
  };

  const renderSystemIcon = (combinedClasses: string) => {
    switch (deviceType) {
      case 'mobile':
        return <FaMobileAlt className={`text-info ${combinedClasses}`} aria-hidden="true" />;
      case 'tablet':
        return <FaTabletAlt className={`text-info ${combinedClasses}`} aria-hidden="true" />;
      default:
        return <FaDesktop className={`text-info ${combinedClasses}`} aria-hidden="true" />;
    }
  };

  const getAnimationClass = (iconTheme: Theme) => {
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
  };

  return (
    <button 
      className={`flex items-center justify-center p-2 rounded-full hover:bg-base-200 ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch theme to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
    >
      <div className="flex items-center justify-center space-x-1">
        {renderIcon()}
        {showLabel && <span className="text-md">Theme</span>}
      </div>
    </button>
  );
};

export default memo(ThemeController);