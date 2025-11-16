<template>
  <button ref="buttonRef" @click="onClick" class="text-xl p-2 hover:text-info focus:text-info focus:outline-none 
      focus:ring-2 focus:ring-info rounded-lg transition-colors duration-200"
    :aria-label="isExpanded ? 'Compress modal' : 'Expand modal'"
    :title="isExpanded ? 'Compress modal' : 'Expand modal'">
    <Icon :icon="isExpanded ? 'fa6-solid:compress' : 'fa6-solid:expand'" class="transition-all duration-200"
      aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

interface Props {
  isExpanded: boolean;
  onClick: () => void;
}

defineProps<Props>();

const buttonRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  buttonRef,
});
</script>
