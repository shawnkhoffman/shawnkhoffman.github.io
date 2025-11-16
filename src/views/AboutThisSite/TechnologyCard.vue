<template>
  <a
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    class="flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300"
    :aria-label="`Learn more about ${title}`"
  >
    <span aria-hidden="true">
      <slot name="icon" />
    </span>
    <h3 class="font-semibold">{{ title }}</h3>
    <p class="text-sm">{{ description }}</p>
  </a>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  link: string;
}

defineProps<Props>();
</script>

