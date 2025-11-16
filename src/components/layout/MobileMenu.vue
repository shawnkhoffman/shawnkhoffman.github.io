<template>
  <div>
    <div :class="`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-25' : 'opacity-0'
      } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`" @click="onClose" aria-hidden="true" />
    <div class="lg:hidden fixed inset-y-0 right-0 w-full max-w-xs bg-base-100 shadow-xl transform" ref="drawerRef"
      :style="drawerStyle" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd" role="dialog" aria-modal="true" aria-label="Mobile navigation menu"
      :data-testid="dataTestId">
      <div ref="focusTrapRef" class="h-full flex flex-col">
        <div class="px-4 pt-5 pb-4 flex items-center justify-between border-b border-base-300">
          <div class="flex items-center">
            <span class="text-xl font-bold">shawnkhoffman.dev</span>
            <img src="/src/assets/images/react.svg" class="animate-spinSlow w-6 h-6 ml-2" alt="React Logo"
              loading="lazy" />
          </div>
          <div>
            <button @click="onClose"
              class="ml-1 p-2 rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close menu">
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav class="flex-grow px-4 pt-5 pb-4 space-y-4 overflow-y-auto">
          <div v-for="(link, index) in links" :key="`mobile-${index}`">
            <div v-if="link.submenu" class="list-none">
              <button
                class="flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                @click="() => toggleSubmenu(index)" :aria-expanded="openSubmenuIndexes.includes(index)"
                :aria-controls="`submenu-${index}`">
                <span>{{ link.label }}</span>
                <Icon icon="fa6-solid:caret-down" :class="`transition-transform duration-300 ${openSubmenuIndexes.includes(index) ? 'rotate-180' : ''
                  }`" aria-hidden="true" />
              </button>
              <div :id="`submenu-${index}`" :class="`pl-4 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${openSubmenuIndexes.includes(index) ? 'max-h-48' : 'max-h-0'
                }`">
                <a v-for="(item, subIndex) in link.submenu" :key="`mobile-${index}-${subIndex}`" :href="item.href"
                  class="block px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  @click.prevent="() => handleMobileLink(item.href, item.label)" role="menuitem">
                  {{ item.label }}
                </a>
              </div>
            </div>
            <a v-else :href="link.href"
              class="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
              @click.prevent="() => handleMobileLink(link.href!, link.label)" role="menuitem">
              {{ link.label }}
            </a>
          </div>
        </nav>
        <div class="mt-auto px-4 py-4 border-t border-base-300">
          <ThemeController :show-label="true"
            class="block px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 w-full focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ThemeController from '@/components/common/ThemeController.vue';

interface SubmenuItem {
  href: string;
  label: string;
}

interface LinkItem {
  href?: string;
  label: string;
  submenu?: SubmenuItem[];
}

interface Props {
  isOpen: boolean;
  links: LinkItem[];
  onLinkClick: (label: string) => void;
  onClose: () => void;
  dataTestId: string;
}

const props = defineProps<Props>();
const router = useRouter();

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.5;
const DRAWER_WIDTH = 300;

const gestureState = ref({
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  velocity: 0,
  direction: null as 'left' | 'right' | 'up' | 'down' | null,
});

const openSubmenuIndexes = ref<number[]>([]);
const touchStartTimeRef = ref<number>(0);
const drawerRef = ref<HTMLDivElement | null>(null);
const isDrawing = ref(false);
const focusTrapRef = ref<HTMLDivElement | null>(null);

const calculateVelocity = (distance: number, time: number): number => {
  return Math.abs(distance) / (time || 1);
};

const determineDirection = (dx: number, dy: number): 'left' | 'right' | 'up' | 'down' => {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
};

const toggleSubmenu = (index: number) => {
  if (openSubmenuIndexes.value.includes(index)) {
    openSubmenuIndexes.value = openSubmenuIndexes.value.filter(i => i !== index);
  } else {
    openSubmenuIndexes.value = [...openSubmenuIndexes.value, index];
  }
};

const currentDrawerPosition = computed(() => {
  if (!isDrawing.value) return 0;
  const dx = gestureState.value.moveX - gestureState.value.startX;
  return Math.max(0, Math.min(dx, DRAWER_WIDTH));
});

const drawerStyle = computed(() => {
  const position = currentDrawerPosition.value;
  if (position > 0) {
    return {
      transform: `translateX(${position}px)`,
      transition: 'none',
    };
  }
  return {
    transform: props.isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
});

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  touchStartTimeRef.value = Date.now();
  gestureState.value = {
    startX: touch.clientX,
    startY: touch.clientY,
    moveX: touch.clientX,
    moveY: touch.clientY,
    velocity: 0,
    direction: null,
  };
  isDrawing.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDrawing.value) return;

  const touch = e.touches[0];
  const dx = touch.clientX - gestureState.value.startX;
  const dy = touch.clientY - gestureState.value.startY;
  const timeDelta = Date.now() - touchStartTimeRef.value;
  const velocity = calculateVelocity(dx, timeDelta);
  const direction = determineDirection(dx, dy);

  if (Math.abs(dx) > Math.abs(dy)) {
    e.preventDefault();
  }

  gestureState.value = {
    ...gestureState.value,
    moveX: touch.clientX,
    moveY: touch.clientY,
    velocity,
    direction,
  };
};

const handleTouchEnd = () => {
  if (!isDrawing.value) return;

  const dx = gestureState.value.moveX - gestureState.value.startX;
  const timeDelta = Date.now() - touchStartTimeRef.value;
  const velocity = calculateVelocity(dx, timeDelta);

  const shouldClose =
    (dx > SWIPE_THRESHOLD && gestureState.value.direction === 'right') ||
    (velocity > VELOCITY_THRESHOLD && gestureState.value.direction === 'right') ||
    (dx > DRAWER_WIDTH / 2);

  if (shouldClose) {
    props.onClose();
  }

  isDrawing.value = false;
  gestureState.value = {
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    velocity: 0,
    direction: null,
  };
};

const handleMobileLink = (href: string, label: string) => {
  props.onLinkClick(label);
  router.push(href);
};

onMounted(() => {
  const handleTabKey = (e: KeyboardEvent) => {
    if (!props.isOpen || !focusTrapRef.value) return;

    const focusableElements = focusTrapRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  document.addEventListener('keydown', handleTabKey);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleTabKey);
  });
});
</script>
