<template>
  <nav
    role="navigation"
    aria-label="Main navigation"
    data-testid="main-navigation"
    class="bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex-shrink-0 flex items-center">
          <router-link
            to="/"
            :class="`text-xl font-bold transform transition-all duration-300 ${
              isDrawerOpen ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
            }`"
            @click="() => handleLinkClick('Home')"
            aria-label="Home"
          >
            My Portfolio
          </router-link>
        </div>

        <div class="hidden lg:flex items-center space-x-4" role="list" aria-label="Desktop navigation">
          <div v-for="(link, index) in links" :key="index" class="relative">
            <template v-if="link.submenu">
              <details
                ref="aboutRef"
                class="group list-none"
                :open="isAboutOpen"
                @toggle="(e) => setIsAboutOpen((e.target as HTMLDetailsElement).open)"
              >
                <summary
                  class="flex items-center w-full px-3 py-2 text-base font-medium rounded-md hover:bg-base-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                  @click.prevent="toggleAboutMenu"
                  role="button"
                  :aria-expanded="isAboutOpen"
                  aria-controls="desktop-about-submenu"
                >
                  {{ link.label }}
                  <Icon
                    icon="fa6-solid:caret-down"
                    :class="`ml-1 transition-transform duration-300 ${
                      isAboutOpen ? 'rotate-180' : ''
                    } hidden lg:inline`"
                    aria-hidden="true"
                  />
                </summary>
                <Submenu 
                  :items="link.submenu" 
                  :is-open="isAboutOpen" 
                  :on-item-click="handleLinkClick"
                />
              </details>
            </template>
            <template v-else>
              <NavLink 
                :href="link.href!" 
                :label="link.label" 
                :on-click="handleLinkClick"
              />
            </template>
          </div>
          <div class="relative">
            <ThemeController />
          </div>
        </div>

        <div class="flex items-center lg:hidden">
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            @click="() => setIsDrawerOpen(!isDrawerOpen)"
            aria-label="Toggle mobile menu"
            :aria-expanded="isDrawerOpen"
            aria-controls="mobile-menu"
          >
            <Icon icon="fa6-solid:bars" class="block h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <MobileMenu
      :is-open="isDrawerOpen"
      :links="links"
      :on-link-click="handleLinkClick"
      :on-close="handleDrawerClose"
      data-test-id="mobile-navigation-menu"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ThemeController from '@/components/common/ThemeController.vue';
import NavLink from './NavLink.vue';
import Submenu from './Submenu.vue';
import MobileMenu from './MobileMenu.vue';

interface SubmenuItem {
  href: string;
  label: string;
}

interface LinkItem {
  href?: string;
  label: string;
  submenu?: SubmenuItem[];
}

const links: LinkItem[] = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    submenu: [
      { href: '/about-me', label: 'About Me' },
      { href: '/about-this-site', label: 'About This Site' },
    ],
  },
];

const isDrawerOpen = ref(false);
const isAboutOpen = ref(false);
const aboutRef = ref<HTMLDetailsElement | null>(null);

const handleLinkClick = (label: string) => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Navigation',
      event_label: label,
    });
  }
  isDrawerOpen.value = false;
  isAboutOpen.value = false;
};

const toggleAboutMenu = (e: Event) => {
  e.preventDefault();
  isAboutOpen.value = !isAboutOpen.value;
};

const handleDrawerClose = () => {
  isDrawerOpen.value = false;
};

const setIsAboutOpen = (open: boolean) => {
  isAboutOpen.value = open;
};

const setIsDrawerOpen = (open: boolean) => {
  isDrawerOpen.value = open;
};

onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (isAboutOpen.value && aboutRef.value && !aboutRef.value.contains(target)) {
      isAboutOpen.value = false;
    }
  };

  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      isDrawerOpen.value = false;
      isAboutOpen.value = false;
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleKeyboard);
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleKeyboard);
  });
});

watch(isDrawerOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

