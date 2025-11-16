<template>
  <main aria-label="About This Site Section" class="flex flex-col items-center justify-center w-full p-6">
    <!-- Heading aligned with About page styling -->
    <section aria-labelledby="about-this-site-heading" class="w-full max-w-3xl text-center mb-10 pt-4">
      <h1 id="about-this-site-heading" class="text-4xl font-bold mb-4">
        About This Site
      </h1>
    </section>

    <!-- Technologies Section -->
    <section class="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-6 text-center">Technologies Used</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <TechnologyCard title="Vue" description="Fast, component-based UI development" link="https://vuejs.org">
          <template #icon>
            <Icon icon="fa6-solid:code" class="text-4xl text-info mb-2" aria-hidden="true" />
          </template>
        </TechnologyCard>
        <TechnologyCard title="TypeScript" description="Type-safe development environment"
          link="https://www.typescriptlang.org">
          <template #icon>
            <Icon icon="fa6-solid:code" class="text-4xl text-info mb-2" aria-hidden="true" />
          </template>
        </TechnologyCard>
        <TechnologyCard title="Tailwind CSS & DaisyUI" description="Utility-first CSS framework"
          link="https://daisyui.com">
          <template #icon>
            <Icon icon="fa6-solid:layer-group" class="text-4xl text-info mb-2" aria-hidden="true" />
          </template>
        </TechnologyCard>
        <TechnologyCard title="GitHub Pages" description="For static site deployment" link="https://pages.github.com">
          <template #icon>
            <Icon icon="fa6-brands:github" class="text-4xl text-info mb-2" aria-hidden="true" />
          </template>
        </TechnologyCard>
        <TechnologyCard title="Vite" description="Fast development builds" link="https://vitejs.dev">
          <template #icon>
            <Icon icon="fa6-solid:bolt" class="text-4xl text-info mb-2" aria-hidden="true" />
          </template>
        </TechnologyCard>
      </div>
    </section>

    <!-- Site Features Section -->
    <section class="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-6 text-center">Site Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="feature in allFeatures" :key="feature.id" class="flex flex-col items-center">
          <Icon :icon="feature.iconName" :class="`text-4xl ${feature.iconColor} mb-4`" aria-hidden="true" />
          <h3 class="font-semibold mb-2">{{ feature.category }}</h3>
          <button class="btn btn-sm mt-4" @click="() => handleFeatureClick(feature)"
            :aria-label="`Learn more about ${feature.category}`" :data-testid="`learn-more-${feature.id}`"
            :disabled="feature.id === 'coming-soon'">
            {{ feature.id === 'coming-soon' ? 'Under Construction' : 'Learn More' }}
          </button>
        </div>
      </div>
    </section>

    <Modal v-if="currentFeatureIndex !== null" :is-open="isFeatureModalOpen" :on-close="closeFeatureModal"
      :title="modalFeatures[currentFeatureIndex].category" :on-next="handleFeatureNext"
      :on-previous="handleFeaturePrevious" :total-pages="modalFeatures.length" :current-page="currentFeatureIndex"
      :is-expanded="isFeatureModalExpanded" :on-toggle-expand="toggleFeatureModalExpand"
      :trigger-overflow-check="triggerOverflowCheck">
      <component :is="modalFeatures[currentFeatureIndex].content" />
    </Modal>

    <!-- GitHub Source Code Section -->
    <section class="flex justify-center items-center mt-6 mb-12">
      <button class="btn btn-primary inline-flex items-center"
        @click="() => window.open('https://github.com/shawnkhoffman/shawnkhoffman.github.io', '_blank')"
        aria-label="View the source code on GitHub">
        <Icon icon="fa6-brands:github" class="mr-2" aria-hidden="true" />
        View Source Code
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import TechnologyCard from './TechnologyCard.vue';
import Modal from '@/components/common/Modal.vue';
import ErrorTestContent from './ErrorTestContent.vue';
import Entertaining404Content from './Entertaining404Content.vue';

interface Feature {
  id: string;
  category: string;
  iconName: string;
  iconColor: string;
  content?: unknown;
}

const currentFeatureIndex = ref<number | null>(null);
const isFeatureModalOpen = ref(false);
const isFeatureModalExpanded = ref(true);
const triggerOverflowCheck = ref(0);

const modalFeatures = [
  {
    id: 'error-handling',
    category: 'Error Handling',
    iconName: 'fa6-solid:bug',
    iconColor: 'text-error',
    content: ErrorTestContent,
  },
  {
    id: 'entertaining-404',
    category: 'Entertaining 404 Page',
    iconName: 'fa6-solid:face-laugh-beam',
    iconColor: 'text-warning',
    content: Entertaining404Content,
  },
];

const allFeatures: Feature[] = [
  ...modalFeatures,
  {
    id: 'coming-soon',
    category: 'Coming Soon',
    iconName: 'fa6-solid:wrench',
    iconColor: 'text-base-content',
  },
];

const handleFeatureClick = (feature: Feature) => {
  if (feature.id === 'coming-soon') return;
  currentFeatureIndex.value = modalFeatures.findIndex(f => f.id === feature.id);
  isFeatureModalOpen.value = true;
};

const closeFeatureModal = () => {
  isFeatureModalOpen.value = false;
};

const handleFeatureNext = () => {
  if (currentFeatureIndex.value !== null) {
    currentFeatureIndex.value = (currentFeatureIndex.value + 1) % modalFeatures.length;
  }
};

const handleFeaturePrevious = () => {
  if (currentFeatureIndex.value !== null) {
    currentFeatureIndex.value = (currentFeatureIndex.value - 1 + modalFeatures.length) % modalFeatures.length;
  }
};

const toggleFeatureModalExpand = () => {
  isFeatureModalExpanded.value = !isFeatureModalExpanded.value;
  triggerOverflowCheck.value += 1;
};
</script>
