<template>
  <div class="flex flex-col justify-center items-center text-center drop-shadow-2xl">
    <div
      class="w-96 h-96 mb-0 flex items-center justify-center"
      :style="{ transform: `rotate(${astronautRotation}deg)` }"
    >
      <img src="/src/assets/images/shawn-astronaut.svg" class="w-full h-full dark:shadow-none" alt="Astronaut" />
    </div>
    <h1 class="text-3xl font-bold mb-2 text-base-content">Welcome to My Universe</h1>
    <p class="text-lg mb-6 text-base-content">Website built with Vue.js</p>

    <a href="https://github.com/shawnkhoffman/shawnkhoffman.github.io" target="_blank" rel="noopener noreferrer"
      class="btn btn-sm btn-ghost mt-4" @click="handleLinkClick"
      aria-label="View the source code of this portfolio on GitHub">
      <Icon icon="fa6-brands:github" aria-hidden="true" />
      View Source Code
      <span class="sr-only">View Source Code</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { useStarfieldVelocity } from '@/composables/useStarfieldVelocity';

const route = useRoute();
const { velocityX, velocityY } = useStarfieldVelocity();

const isLandingPage = computed(() => route.name === 'Index');

// TEMPORARY: Light mode disabled - always show starfield
// TODO: Re-enable theme detection:
//   - Add back: useTheme, useMediaQuery imports
//   - Add back: appliedTheme computed property
//   - Change to: shouldShowStarfield = isLandingPage.value && appliedTheme.value === 'dark'
const shouldShowStarfield = computed(() => isLandingPage.value);

const astronautRotation = ref(0);
let lastFrameTime = Date.now();
let animationFrameId: number | null = null;

const updateAstronautPosition = () => {
  const now = Date.now();
  const deltaTime = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if (shouldShowStarfield.value && velocityX && velocityY) {
    const vx = velocityX.value;
    const vy = velocityY.value;
    const speed = Math.sqrt(vx * vx + vy * vy);
    
    const astronautZ = 0.5;
    const speedMultiplier = (1 - astronautZ) * 0.6;
    const baselineSpeed = 50;
    const baselineDirectionX = -0.707;

    let rotationSpeed: number;
    let rotationDirection: number;

    if (speed > 0.5) {
      rotationSpeed = speed * speedMultiplier * 2.5;
      rotationDirection = vx / speed;
    } else {
      rotationSpeed = baselineSpeed * speedMultiplier * 2.5;
      rotationDirection = baselineDirectionX;
    }

    const maxRotationSpeed = 120;
    rotationSpeed = Math.min(rotationSpeed, maxRotationSpeed);

    const rotationDelta = rotationDirection * rotationSpeed * deltaTime;
    astronautRotation.value += rotationDelta;
    
    while (astronautRotation.value >= 360) {
      astronautRotation.value -= 360;
    }
    while (astronautRotation.value < 0) {
      astronautRotation.value += 360;
    }
  } else {
    astronautRotation.value = 0;
  }

  animationFrameId = requestAnimationFrame(updateAstronautPosition);
};

onMounted(() => {
  lastFrameTime = Date.now();
  updateAstronautPosition();
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});

const handleLinkClick = () => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Outbound Link',
      event_label: 'GitHub Source Code',
    });
  }
};
</script>
