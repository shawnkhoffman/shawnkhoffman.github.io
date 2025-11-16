<template>
  <div class="flex flex-col min-h-screen text-base-content">
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-content focus:rounded-md"
    >
      Skip to content
    </a>
    <Navbar />
    <main 
      id="main-content" 
      class="flex-grow flex flex-col justify-center items-center text-base-content pt-16 relative bg-base-200"
      :style="{ scrollMarginTop: '4rem' }"
    >
      <StarfieldBackground v-if="shouldShowStarfield" />
      <div class="relative z-10 w-full flex-grow flex flex-col justify-center items-center">
        <ErrorBoundary
          :on-error="handleError"
        >
          <slot />
        </ErrorBoundary>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { useMediaQuery } from '@/composables/useMediaQuery';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import StarfieldBackground from '@/components/common/StarfieldBackground.vue';

const route = useRoute();
const { theme } = useTheme();
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
const appliedTheme = ref<string>('light');

const updateAppliedTheme = () => {
  if (theme.value === 'dark') {
    appliedTheme.value = 'dark';
  } else if (theme.value === 'light') {
    appliedTheme.value = 'light';
  } else {
    appliedTheme.value = prefersDark.value ? 'dark' : 'light';
  }
};

watch([theme, prefersDark], () => {
  updateAppliedTheme();
});

let observer: MutationObserver | null = null;

onMounted(() => {
  updateAppliedTheme();
  observer = new MutationObserver(() => {
    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme && theme.value === 'system') {
      appliedTheme.value = dataTheme;
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const isLandingPage = computed(() => route.name === 'Index');

const isDarkMode = computed(() => appliedTheme.value === 'dark');

const shouldShowStarfield = computed(() => isLandingPage.value && isDarkMode.value);

const handleError = (error: Error, errorInfo: unknown) => {
  console.error('Global ErrorBoundary caught an error:', error, errorInfo);
};
</script>

