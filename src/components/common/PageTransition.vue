<template>
  <div :class="`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'
    }`">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isTransitioning = ref(false);

let transitionTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => route.path,
  () => {
    isTransitioning.value = true;

    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
    }

    transitionTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = false;
      });
    }, 50);
  }
);

onUnmounted(() => {
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }
});
</script>
