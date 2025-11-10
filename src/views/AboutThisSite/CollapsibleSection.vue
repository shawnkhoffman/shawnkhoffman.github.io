<template>
  <div
    :data-testid="testId"
    :class="`collapse collapse-arrow bg-base-200 ${isOpen ? 'collapse-open' : 'collapse-close'}`"
  >
    <button
      type="button"
      class="collapse-title text-xl font-medium"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      @click="handleToggle"
      @keydown="handleKeyDown"
      @touchend="handleTouchEnd"
      tabindex="0"
    >
      {{ title }}
    </button>
    <div
      :id="contentId"
      class="collapse-content"
      role="region"
      :aria-hidden="!isOpen"
    >
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  content: string;
  testId?: string;
}

const { testId = 'collapsible-section' } = defineProps<Props>();

const isOpen = ref(false);
const uniqueId = `collapsible-${Math.random().toString(36).substr(2, 9)}`;
const contentId = `collapsible-content-${uniqueId}`;

const handleToggle = (event: Event) => {
  event.preventDefault();
  isOpen.value = !isOpen.value;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleToggle(event);
  }
};

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault();
  handleToggle(event);
};
</script>

