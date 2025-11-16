<template>
  <li 
    :data-testid="testId"
    tabindex="0"
    role="listitem"
    class="group"
  >
    <div class="timeline-middle">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 mx-2">
        <svg
          data-testid="decorative-icon"
          aria-hidden="true"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div :class="`timeline-${position} mb-10 md:text-${position === 'start' ? 'end' : 'start'}`">
      <div class="bg-base-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-primary/30 group-hover:border-primary/50 ml-2 md:ml-0">
        <time class="inline-block font-mono text-sm font-semibold text-base-content/70 mb-2 px-3 py-1 bg-base-300 rounded-full">
          {{ date }}
        </time>
        <h3 class="text-xl font-bold text-base-content mb-2 mt-3">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-base font-semibold text-base-content/80 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          {{ subtitle }}
        </p>
        <p role="article" class="text-base-content/70 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
    <hr class="border-base-300" />
  </li>
</template>

<script setup lang="ts">
export interface CareerTimelineItemProps {
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  position: 'start' | 'end';
  testId?: string;
}

withDefaults(defineProps<CareerTimelineItemProps>(), {
  testId: 'timeline-item',
});
</script>
