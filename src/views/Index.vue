<template>
  <div class="flex flex-col justify-center items-center text-center drop-shadow-2xl">
    <img src="/src/assets/images/react.svg" class="animate-spinSlow w-32 h-32 mb-8 dark:shadow-none" alt="React Logo" />
    <h1 class="text-3xl font-bold mb-2 text-base-content">Welcome to My Portfolio</h1>
    <p class="text-lg mb-6 text-base-content">Built in Vue.js</p>

    <a href="https://github.com/shawnkhoffman/shawnkhoffman.github.io" target="_blank" rel="noopener noreferrer"
      class="btn btn-sm btn-ghost mt-4" @click="handleLinkClick"
      aria-label="View the source code of this portfolio on GitHub">
      <Icon icon="fa6-brands:github" aria-hidden="true" />
      View Source Code
      <span class="sr-only">View Source Code</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const handleLinkClick = () => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'GitHub Source Code',
    });
  }
};
</script>
