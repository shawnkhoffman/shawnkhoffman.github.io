import { useEffect, useCallback, useRef } from 'react';

interface OriginalStyle {
  overflow: string;
  paddingRight: string;
  position: string;
  top: string;
  left: string;
  right: string;
  bottom: string;
}

const useLockedBody = (locked: boolean = true): void => {
  const originalStyleRef = useRef<OriginalStyle>({
    overflow: '',
    paddingRight: '',
    position: '',
    top: '',
    left: '',
    right: '',
    bottom: '',
  });

  const getScrollbarWidth = useCallback(() => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = `
      width: 99px;
      height: 99px;
      overflow: scroll;
      position: absolute;
      top: -9999px;
    `;
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }, []);

  useEffect(() => {
    const bodyStyle = document.body.style;
    originalStyleRef.current = {
      overflow: bodyStyle.overflow,
      paddingRight: bodyStyle.paddingRight,
      position: bodyStyle.position,
      top: bodyStyle.top,
      left: bodyStyle.left,
      right: bodyStyle.right,
      bottom: bodyStyle.bottom,
    };
  }, []);

  useEffect(() => {
    const bodyStyle = document.body.style;

    if (locked) {
      const scrollbarWidth = getScrollbarWidth();
      const hasVerticalScroll = window.innerWidth > document.documentElement.clientWidth;

      const scrollY = window.scrollY;

      Object.assign(bodyStyle, {
        overflow: 'hidden',
        position: 'fixed',
        top: `-${scrollY}px`,
        left: '0',
        right: '0',
        bottom: '0',
        paddingRight: hasVerticalScroll ? `${scrollbarWidth}px` : '0',
      });

      return () => {
        Object.assign(bodyStyle, originalStyleRef.current);
        window.scrollTo(0, scrollY);
      };
    } else {
      Object.assign(bodyStyle, originalStyleRef.current);
      return undefined;
    }
  }, [locked, getScrollbarWidth]);
};

export default useLockedBody;