<template>
  <button v-if="showPrevious" class="absolute top-1/2 transform -translate-y-1/2 -translate-x-16 left-0 p-2 
      text-neutral-content hover:text-info focus:text-info focus:outline-none 
      focus:ring-2 focus:ring-info rounded-lg hidden md:block
      transition-colors duration-200" @click="onPrevious" aria-label="Previous page" title="Previous page">
    <Icon icon="fa6-solid:chevron-left" :class="`text-5xl ${animationClass}`" aria-hidden="true" />
  </button>
  <button v-if="showNext" class="absolute top-1/2 transform -translate-y-1/2 translate-x-16 right-0 p-2 
      text-neutral-content hover:text-info focus:text-info focus:outline-none 
      focus:ring-2 focus:ring-info rounded-lg hidden md:block
      transition-colors duration-200" @click="onNext" aria-label="Next page" title="Next page">
    <Icon icon="fa6-solid:chevron-right" :class="`text-5xl ${animationClass}`" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  prefersReducedMotion?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPrevious: true,
  showNext: true,
  prefersReducedMotion: false,
});

const animationClass = computed(() =>
  props.prefersReducedMotion ? '' : 'hover:scale-110 transition-transform'
);
</script>
