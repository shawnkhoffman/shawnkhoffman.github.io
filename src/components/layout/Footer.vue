<template>
  <footer class="bg-base-100 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div class="text-center sm:text-left">
          <p class="text-sm text-base-content">
            © {{ currentYear }} Shawn Hoffman. All rights reserved.
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <a href="https://shawnkhoffman.medium.com" target="_blank" rel="noopener noreferrer"
            class="text-base-content hover:text-primary transition-colors duration-200"
            @click="handleLinkClick('Medium')" aria-label="Visit my Medium profile">
            <Icon icon="fa6-brands:medium" class="w-5 h-5" aria-hidden="true" />
          </a>
          <a href="https://github.com/shawnkhoffman" target="_blank" rel="noopener noreferrer"
            class="text-base-content hover:text-primary transition-colors duration-200"
            @click="handleLinkClick('GitHub')" aria-label="Visit my GitHub profile">
            <Icon icon="fa6-brands:github" class="w-5 h-5" aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/in/shawnkhoffman" target="_blank" rel="noopener noreferrer"
            class="text-base-content hover:text-primary transition-colors duration-200"
            @click="handleLinkClick('LinkedIn')" aria-label="Visit my LinkedIn profile">
            <Icon icon="fa6-brands:linkedin" class="w-5 h-5" aria-hidden="true" />
          </a>
          <a href="https://x.com/shawnkhoffman" target="_blank" rel="noopener noreferrer"
            class="text-base-content hover:text-primary transition-colors duration-200" @click="handleLinkClick('X')"
            aria-label="Visit my X (formerly Twitter) profile">
            <Icon icon="fa6-brands:x-twitter" class="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const currentYear = computed(() => new Date().getFullYear());

const handleLinkClick = (platform: string) => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Outbound Link',
      event_label: platform,
    });
  }
};
</script>
