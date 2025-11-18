<template>
  <div class="flex flex-col min-h-screen text-base-content">
    <a href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-content focus:rounded-md">
      Skip to content
    </a>
    <Navbar />
    <main id="main-content"
      class="flex-grow flex flex-col justify-center items-center text-base-content pt-16 relative bg-base-200"
      :style="{ scrollMarginTop: '4rem' }">
      <StarfieldBackground v-if="shouldShowStarfield" />
      <CloudBackground v-if="shouldShowClouds" />
      <div class="relative z-10 w-full flex-grow flex flex-col justify-center items-center">
        <ErrorBoundary :on-error="handleError">
          <slot />
        </ErrorBoundary>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import { STARFIELD_VELOCITY_KEY } from '@/composables/useStarfieldVelocity';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import StarfieldBackground from '@/components/common/StarfieldBackground.vue';
import CloudBackground from '@/components/common/CloudBackground.vue';

const starfieldVelocityX = ref(0);
const starfieldVelocityY = ref(0);

provide(STARFIELD_VELOCITY_KEY, {
  velocityX: starfieldVelocityX,
  velocityY: starfieldVelocityY,
});

const route = useRoute();

const isLandingPage = computed(() => route.name === 'Index');

// TEMPORARY: Light mode disabled - always show starfield, never show clouds
// TODO: Re-enable theme detection:
//   - Add back: useTheme, useMediaQuery, watch, onMounted, onUnmounted imports
//   - Add back: appliedTheme, isDarkMode computed properties
//   - Change to: shouldShowStarfield = isLandingPage.value && isDarkMode.value
//   - Change to: shouldShowClouds = isLandingPage.value && !isDarkMode.value
const shouldShowStarfield = computed(() => isLandingPage.value);
const shouldShowClouds = computed(() => false);

const handleError = (error: Error, errorInfo: unknown) => {
  console.error('Global ErrorBoundary caught an error:', error, errorInfo);
};
</script>
