<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      data-testid="modal-overlay"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto overflow-hidden"
      @click="handleOutsideClick"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${modalId}`"
      tabindex="-1"
    >
      <div
        ref="modalRef"
        data-testid="modal-content"
        :class="`relative w-full ${modalSize.width} ${modalSize.height} 
          flex flex-col bg-base-100 rounded-lg shadow-xl 
          ${prefersReducedMotion ? '' : 'transition-all duration-300'} 
          p-4 sm:p-6 lg:p-8 ${className}`"
        tabindex="-1"
      >
        <div class="p-4 border-b border-base-300 flex justify-between items-center">
          <h2
            :id="`modal-title-${modalId}`"
            class="text-xl sm:text-2xl font-semibold text-center flex-grow"
          >
            {{ title }}
          </h2>

          <ExpandButton
            ref="expandButtonRef"
            :is-expanded="isExpanded"
            @click="onToggleExpand"
          />
        </div>

        <NavigationButtons
          v-if="isNavigationEnabled"
          :on-previous="handlePrevious"
          :on-next="handleNext"
          :prefers-reduced-motion="prefersReducedMotion"
        />

        <div
          ref="contentRef"
          :class="`p-6 pb-10 flex-grow overflow-y-auto relative scroll-smooth
            ${contentClassName}`"
          @scroll="handleScroll"
          role="region"
          aria-label="Modal content"
          tabindex="0"
        >
          <slot />

          <ScrollIndicator
            v-if="state.isContentOverflowing && state.scrollIndicatorVisible"
            :prefers-reduced-motion="prefersReducedMotion"
            message="Scroll down to see more"
          />
        </div>

        <div class="p-4 border-t border-base-300 flex justify-end space-x-2">
          <button
            ref="closeButtonRef"
            class="btn btn-sm btn-neutral"
            @click="onClose"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        <div
          v-if="showNavigation && state.showNavigationHint && totalPages > 1"
          class="absolute bottom-2 left-2 bg-base-200 p-2 rounded-lg flex items-center space-x-2"
          role="status"
          aria-live="polite"
        >
          <span class="text-sm text-info">
            {{ isTouchDevice
              ? 'Swipe left or right to navigate'
              : 'Use ← → arrow keys to navigate' }}
          </span>
        </div>

        <div
          v-if="totalPages > 1"
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex space-x-2"
          role="navigation"
          :aria-label="`Page ${currentPage + 1} of ${totalPages}`"
        >
          <div
            v-for="(_, index) in totalPages"
            :key="index"
            :class="`w-3 h-3 rounded-full transition-colors duration-200
              ${currentPage === index ? 'bg-info' : 'bg-neutral-content'}`"
            role="tab"
            :aria-selected="currentPage === index"
            :aria-label="`Page ${index + 1}`"
            tabindex="-1"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useMediaQuery } from '@/composables/useMediaQuery';
import useLockedBody from '@/composables/useLockedBody';
import useResizeObserver from '@/composables/useResizeObserver';
import ExpandButton from './ExpandButton.vue';
import NavigationButtons from './NavigationButtons.vue';
import ScrollIndicator from './ScrollIndicator.vue';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  totalPages?: number;
  currentPage?: number;
  showNavigation?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  triggerOverflowCheck: number;
  className?: string;
  contentClassName?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  initialFocus?: 'close' | 'expand' | 'content';
}

const props = withDefaults(defineProps<ModalProps>(), {
  totalPages: 1,
  currentPage: 0,
  showNavigation: true,
  className: '',
  contentClassName: '',
  closeOnEscape: true,
  closeOnOutsideClick: true,
  initialFocus: 'close',
});

const SWIPE_CONFIG = {
  minDistance: 50,
  maxTime: 300,
  minVelocity: 0.3,
} as const;

const MODAL_SIZES = {
  expanded: {
    width: 'max-w-[95vw] md:max-w-4xl lg:max-w-5xl',
    height: 'h-[85vh]',
  },
  normal: {
    width: 'max-w-[90vw] md:max-w-2xl lg:max-w-3xl',
    height: 'h-[70vh] md:h-[60vh] lg:h-[50vh]',
  },
} as const;

const TRANSITION_DURATION = 300;
const SCROLL_THROTTLE = 100;
const RESIZE_DEBOUNCE = 100;

const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
const modalRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const expandButtonRef = ref<InstanceType<typeof ExpandButton> | null>(null);

const state = ref({
  isContentOverflowing: false,
  scrollIndicatorVisible: true,
  showNavigationHint: true,
  touchStart: { x: 0, y: 0, time: 0 },
  hasInteracted: false,
});

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const isTouchDevice = useMediaQuery('(pointer: coarse)');

useLockedBody(computed(() => props.isOpen));

const modalSize = computed(() => 
  props.isExpanded ? MODAL_SIZES.expanded : MODAL_SIZES.normal
);

const isNavigationEnabled = computed(
  () => props.showNavigation && props.totalPages > 1 && !isTouchDevice.value
);

const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };

  debouncedFn.cancel = () => clearTimeout(timeoutId);

  return debouncedFn;
};

const throttle = <T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      fn(...args);
      lastCall = now;
    }
  };
};

const handleOutsideClick = (e: MouseEvent) => {
  if (!props.closeOnOutsideClick) return;
  
  const target = e.target as HTMLElement;
  if (target.dataset.testid === 'modal-overlay') {
    props.onClose();
  }
};

const checkContentOverflow = () => {
  if (contentRef.value) {
    const isOverflowing =
      contentRef.value.scrollHeight > contentRef.value.clientHeight;
    state.value.isContentOverflowing = isOverflowing;
    if (!state.value.hasInteracted) {
      state.value.scrollIndicatorVisible = isOverflowing;
    }
  }
};

const handleScroll = throttle(() => {
  if (contentRef.value?.scrollTop && contentRef.value.scrollTop > 0) {
    state.value.scrollIndicatorVisible = false;
    state.value.hasInteracted = true;
  }
}, SCROLL_THROTTLE);

const preventScrollPropagation = (e: WheelEvent) => {
  if (!contentRef.value) return;

  const { deltaY } = e;
  const { scrollTop, scrollHeight, clientHeight } = contentRef.value;
  const isScrollingUp = deltaY < 0;
  const isScrollingDown = deltaY > 0;
  const isAtTop = scrollTop <= 0;
  const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;

  if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
    e.preventDefault();
  }
};

const handleTouchStart = (e: TouchEvent) => {
  state.value.touchStart = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
    time: Date.now(),
  };
};

const handleTouchEnd = (e: TouchEvent) => {
  const { x: startX, y: startY, time: startTime } = state.value.touchStart;
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const touchEndTime = Date.now();

  const deltaX = touchEndX - startX;
  const deltaY = touchEndY - startY;
  const deltaTime = touchEndTime - startTime;
  const velocity = Math.abs(deltaX) / deltaTime;

  if (
    Math.abs(deltaX) > Math.abs(deltaY) &&
    Math.abs(deltaX) > SWIPE_CONFIG.minDistance &&
    deltaTime < SWIPE_CONFIG.maxTime &&
    velocity > SWIPE_CONFIG.minVelocity
  ) {
    if (deltaX > 0 && props.onPrevious) {
      props.onPrevious();
      state.value.showNavigationHint = false;
      state.value.hasInteracted = true;
    } else if (deltaX < 0 && props.onNext) {
      props.onNext();
      state.value.showNavigationHint = false;
      state.value.hasInteracted = true;
    }
  }
};

const handlePrevious = () => {
  props.onPrevious?.();
  state.value.showNavigationHint = false;
  state.value.hasInteracted = true;
};

const handleNext = () => {
  props.onNext?.();
  state.value.showNavigationHint = false;
  state.value.hasInteracted = true;
};

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      if (props.onNext) {
        props.onNext();
        state.value.showNavigationHint = false;
        state.value.hasInteracted = true;
      }
      break;
    case 'ArrowLeft':
      if (props.onPrevious) {
        props.onPrevious();
        state.value.showNavigationHint = false;
        state.value.hasInteracted = true;
      }
      break;
    case 'Escape':
      if (props.closeOnEscape) {
        props.onClose();
      }
      break;
    default:
      break;
  }
};

const focusTrap = (e: KeyboardEvent) => {
  const focusableElements = modalRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements?.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

const debouncedCheckContentOverflow = debounce(checkContentOverflow, RESIZE_DEBOUNCE);

useResizeObserver(contentRef, checkContentOverflow);

watch(() => props.isOpen, (open) => {
  if (!open) return;

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', focusTrap);

  nextTick(() => {
    setTimeout(() => {
      switch (props.initialFocus) {
        case 'content': {
          contentRef.value?.focus();
          break;
        }
        case 'expand': {
          expandButtonRef.value?.$el?.focus();
          break;
        }
        case 'close':
        default: {
          const closeBtn = closeButtonRef.value;
          if (closeBtn && !closeBtn.hasAttribute('disabled')) {
            closeBtn.focus();
          } else {
            modalRef.value?.focus();
          }
          break;
        }
      }
    }, TRANSITION_DURATION);
  });
});

watch(() => props.isOpen, (open) => {
  if (!open) {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', focusTrap);
  }
});

watch(
  () => [props.isOpen, props.currentPage, props.isExpanded, props.triggerOverflowCheck],
  () => {
    if (props.isOpen) {
      debouncedCheckContentOverflow();
    }
  }
);

onMounted(() => {
  if (contentRef.value) {
    contentRef.value.addEventListener('wheel', preventScrollPropagation, { passive: false });
  }

  watch(() => props.isOpen, (open) => {
    const modalElement = modalRef.value;
    if (!open || !modalElement || !isTouchDevice.value) return;

    modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchend', handleTouchEnd);
    };
  });
});

onUnmounted(() => {
  if (contentRef.value) {
    contentRef.value.removeEventListener('wheel', preventScrollPropagation);
  }
  debouncedCheckContentOverflow.cancel();
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keydown', focusTrap);
});
</script>

