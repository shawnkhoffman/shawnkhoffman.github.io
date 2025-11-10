import { watch, onUnmounted, type Ref } from 'vue';

type ObserverCallback = () => void;

export default function useResizeObserver(
  ref: Ref<Element | HTMLElement | null>,
  callback: ObserverCallback,
  options: ResizeObserverOptions = {}
) {
  let observer: ResizeObserver | null = null;

  watch(
    () => ref.value,
    (element) => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (element) {
        observer = new ResizeObserver(() => {
          callback();
        });
        observer.observe(element, options);
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
}

