<template>
  <div class="absolute bottom-2 right-2 bg-base-200/90 p-2 rounded-lg 
      flex items-center space-x-2 shadow-lg backdrop-blur-sm
      transition-opacity duration-200 hover:opacity-100" role="status" aria-live="polite">
    <Icon icon="fa6-solid:chevron-down" :class="`text-xl text-info ${prefersReducedMotion ? '' : 'animate-bounce'
      }`" aria-hidden="true" />
    <span class="text-sm font-medium text-info">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Props {
  prefersReducedMotion: boolean;
  message: string;
}

defineProps<Props>();
</script>
