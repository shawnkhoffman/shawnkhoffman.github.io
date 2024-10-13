import { useEffect, RefObject } from 'react';

type ObserverCallback = () => void;

const useResizeObserver = (
  ref: RefObject<Element | HTMLElement | null>,
  callback: ObserverCallback,
  options: ResizeObserverOptions = {}
) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new ResizeObserver(() => {
      callback();
    });

    observer.observe(element, options);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};

export default useResizeObserver;