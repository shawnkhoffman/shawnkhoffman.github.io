<template>
  <div class="h-full flex flex-col p-4 sm:p-6 w-full max-w-3xl mx-auto" role="region" aria-label="404 Content">
    <div class="mb-6">
      <p class="mb-4 text-sm sm:text-base" data-testid="404-description">
        The 404 page was designed to add a touch of humor and personality to an otherwise frustrating experience.
        Instead of a generic error message, the page randomly displays amusing messages and gifs, making it more
        enjoyable for users who may have navigated to a non-existent page. This approach aims to reduce user frustration
        and create a more engaging experience.
      </p>
    </div>
    <div class="flex-grow flex flex-col items-center justify-center space-y-6">
      <div class="w-full max-w-full sm:max-w-md lg:max-w-lg bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
        <NotFound />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NotFound from '@/views/NotFound.vue';
</script>
