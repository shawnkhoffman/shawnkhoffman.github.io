<template>
  <div id="app">
    <MainLayout>
      <PageTransition>
        <router-view />
      </PageTransition>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeProvider } from '@/composables/useTheme';
import MainLayout from '@/layouts/MainLayout.vue';
import PageTransition from '@/components/common/PageTransition.vue';

// Initialize theme provider
useThemeProvider();

// Google Analytics tracker
const route = useRoute();

watch(
  () => route.path,
  (path) => {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
      });
    }
  },
  { immediate: true }
);
</script>

