import { onUnmounted, watch, type Ref } from 'vue';

export default function useLockedBody(locked: Ref<boolean> | boolean = true): void {
  const getScrollbarWidth = (): number => {
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
  };

  watch(
    () => (typeof locked === 'boolean' ? locked : locked.value),
    (isLocked) => {
      const bodyStyle = document.body.style;

      if (isLocked) {
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
      } else {
        const scrollY = bodyStyle.top ? parseInt(bodyStyle.top) * -1 : 0;
        bodyStyle.overflow = '';
        bodyStyle.position = '';
        bodyStyle.top = '';
        bodyStyle.left = '';
        bodyStyle.right = '';
        bodyStyle.bottom = '';
        bodyStyle.paddingRight = '';
        window.scrollTo(0, scrollY);
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflow = '';
    bodyStyle.position = '';
    bodyStyle.top = '';
    bodyStyle.left = '';
    bodyStyle.right = '';
    bodyStyle.bottom = '';
    bodyStyle.paddingRight = '';
  });
}
