<template>
  <main 
    class="flex flex-col items-center justify-center w-full p-6" 
    role="main" 
    aria-label="About Me Section"
  >
    <Introduction />
    <Skills />
    <Timeline />
  </main>
</template>

<script setup lang="ts">
import Introduction from './Introduction.vue';
import Timeline from './CareerTimeline.vue';
import Skills from './Skills.vue';
</script>

