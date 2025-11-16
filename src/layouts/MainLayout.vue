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
      class="flex-grow flex flex-col justify-center items-center bg-base-200 text-base-content pt-16"
      :style="{ scrollMarginTop: '4rem' }"
    >
      <ErrorBoundary
        :on-error="handleError"
      >
        <slot />
      </ErrorBoundary>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';

const handleError = (error: Error, errorInfo: unknown) => {
  console.error('Global ErrorBoundary caught an error:', error, errorInfo);
};
</script>

