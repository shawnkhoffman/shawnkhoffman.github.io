<template>
  <div class="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold mb-6 text-center">Skills & Interests</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      <div 
        v-for="(modal, index) in modals" 
        :key="modal.id" 
        class="flex flex-col items-center text-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-base-200 hover:shadow-md group"
        @click="() => showModal(index)"
        role="button"
        tabindex="0"
        @keydown.enter="() => showModal(index)"
        @keydown.space.prevent="() => showModal(index)"
      >
        <Icon 
          :icon="modal.iconName" 
          class="text-4xl text-info mb-4 transition-all duration-200 group-hover:scale-110" 
          aria-hidden="true"
        />
        <h3 class="font-semibold mb-2 transition-all duration-200 group-hover:text-info">
          {{ modal.category }}
        </h3>
        <button class="btn btn-sm mt-4 transition-all duration-200 group-hover:btn-primary" @click.stop="() => showModal(index)">
          Learn More
        </button>
      </div>
    </div>

    <Modal v-if="currentModalIndex !== null" :is-open="isModalOpen" :on-close="closeModal"
      :title="modals[currentModalIndex].category" :on-next="handleNext" :on-previous="handlePrevious"
      :total-pages="modals.length" :current-page="currentModalIndex" :is-expanded="isModalExpanded"
      :on-toggle-expand="toggleModalExpand" :trigger-overflow-check="triggerOverflowCheck">
      <template #default>
        <div v-if="currentModalIndex !== null" class="flex flex-col">
          <div class="flex justify-center mb-6">
            <img :src="modals[currentModalIndex].imageUrl" :alt="modals[currentModalIndex].category" class="max-w-full h-auto max-h-[500px]" />
          </div>
          <div v-html="modals[currentModalIndex].content"></div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Modal from '@/components/common/Modal.vue';
import productEngineeringImg from '@/assets/images/shawn-product-engineering.png';
import cloudNativeSystemsImg from '@/assets/images/shawn-cloud-native-systems.png';
import videoStreamingPlatformsImg from '@/assets/images/shawn-video-streaming-platforms.png';
import aiMediaSystemsImg from '@/assets/images/shawn-ai-media-systems.png';
import embeddedSystemsImg from '@/assets/images/shawn-embedded-systems.png';
import gamingImg from '@/assets/images/shawn-gaming.png';

interface ModalData {
  id: string;
  category: string;
  iconName: string;
  imageUrl: string;
  content: string;
}

const currentModalIndex = ref<number | null>(null);
const isModalOpen = ref(false);
const isModalExpanded = ref(true);
const triggerOverflowCheck = ref(0);

const modals: ModalData[] = [
  {
    id: 'product-engineering-modal',
    category: 'Product Engineering',
    iconName: 'fa6-solid:code',
    imageUrl: productEngineeringImg,
    content: `
      <p class="leading-relaxed mb-6">
        My path into product engineering started with curiosity about how software is assembled. In the early web era, I began building small websites on GeoCities and Tripod, and using Macromedia Dreamweaver, then moved from pages and interfaces into backend systems, automation, and distributed platforms. That early interest in how pieces fit together still shapes how I build today.
      </p>
      <p class="leading-relaxed mb-6">
        Most of my professional work focuses on software products for media environments: backend services, internal tools, workflow automation, platform features, and systems that help teams launch, monitor, scale, and operate media products. I tend to work close to the boundary between product needs and system behavior, where a feature has to be useful to people and reliable under real production load.
      </p>
      <p class="leading-relaxed mb-6">
        In media systems, product behavior often depends on timing, ordering, and visibility across multiple stages. A video pipeline, release workflow, or operational tool is only useful if teams can understand what is happening, where work is slowing down, and how the system responds as demand changes. I design software so those workflows are easier to trace, operate, and evolve.
      </p>
      <p class="leading-relaxed mb-6">
        My SRE and platform background gives me a practical view of what happens after software ships. I care about how features behave over time, how failures appear, how deployments affect surrounding systems, and how product decisions influence reliability. That perspective helps me build software that is not only functional, but durable in production.
      </p>
      <p class="leading-relaxed mb-6">
        I occasionally work on frontend code when the interface needs to reflect the underlying workflow clearly. I keep those interfaces simple and predictable, with the goal of making complex systems easier to use rather than adding unnecessary abstraction.
      </p>
    `,
  },
  {
    id: 'ai-media-systems',
    category: 'AI Media Systems',
    iconName: 'fa6-solid:brain',
    imageUrl: aiMediaSystemsImg,
    content: `
      <p class="leading-relaxed mb-6">
        My AI media work focuses on bringing machine learning into real production workflows for video, content, and studio systems. I have worked with models for video analysis, content understanding, recommendation workflows, metadata extraction, and film production tasks, with an emphasis on making those systems reliable under real media workloads.
      </p>
      <p class="leading-relaxed mb-6">
        In these environments, the model is only one part of the product. The surrounding services, data pipelines, workflow triggers, asset handling, observability, and downstream systems all determine whether the AI is actually useful. I focus on how models fit into the larger media workflow so they can support production teams rather than create another fragile dependency.
      </p>
      <p class="leading-relaxed mb-6">
        I have collaborated with research teams to move models from experimentation into production. That often means adapting research code, handling large media inputs, supporting uneven workloads, sequencing model output within existing pipelines, and making behavior consistent under sustained load.
      </p>
      <p class="leading-relaxed mb-6">
        Data quality is also a major part of the work. Media systems involve structured and unstructured inputs, changing assets, and production data that may not look like the original training set. I pay attention to where data comes from, how it is prepared, how it changes over time, and how those changes affect model behavior.
      </p>
    `,
  },
  {
    id: 'video-streaming-platforms-modal',
    category: 'Video Streaming Platforms',
    iconName: 'fa6-solid:video',
    imageUrl: videoStreamingPlatformsImg,
    content: `
      <p class="leading-relaxed mb-6">
        My video streaming work focuses on the systems that prepare, package, deliver, and observe video for large-scale playback. I work across the stages that turn incoming content into streamable media, including processing, transcoding, segmentation, packaging, quality analysis, delivery workflows, and operational tooling.
      </p>
      <p class="leading-relaxed mb-6">
        Streaming platforms behave differently from ordinary backend systems because the product experience depends on timing, ordering, and consistency. A small issue early in the workflow can appear later as a playback problem, packaging error, quality drift, or delivery bottleneck. I pay close attention to how each stage affects the next so the system remains understandable and predictable under real production load.
      </p>
      <p class="leading-relaxed mb-6">
        I have worked on the parts of the platform that package and prepare content for HLS, DASH, and CMAF delivery. These systems need to respect the constraints of media playback rather than forcing video workflows into generic service patterns. Correct ordering, segment consistency, manifest behavior, and delivery readiness all matter because they directly influence the viewer experience.
      </p>
      <p class="leading-relaxed mb-6">
        Quality analysis is another important part of the work. Video quality tools depend on consistent processing conditions, clear inputs, and reliable measurement environments. I focus on how the surrounding system affects those results so quality signals remain useful instead of becoming another source of uncertainty.
      </p>
      <p class="leading-relaxed mb-6">
        Media platforms run through real-world patterns: release cycles, bursty ingest, high-concurrency premieres, live events, and traffic spikes. I design and support streaming workflows with those conditions in mind, with the goal of keeping playback, delivery, and operational behavior stable as demand changes.
      </p>
    `,
  },
  {
    id: 'cloud-native-systems-modal',
    category: 'Cloud-Native Systems',
    iconName: 'fa6-solid:cloud',
    imageUrl: cloudNativeSystemsImg,
    content: `
      <p class="leading-relaxed mb-6">
        My cloud-native work focuses on the platforms behind video processing, media delivery, and AI-enabled production workflows. These workloads behave differently from typical web services. Transcoding creates sharp CPU and memory spikes, GPU stages introduce device-level scheduling and large data movement, ingest pipelines can back up when upstream sources change pace, and packaging or quality-analysis steps depend on stable processing conditions.
      </p>
      <p class="leading-relaxed mb-6">
        I design cloud environments around those workload patterns rather than treating them as generic compute problems. The platform needs to make it clear where work is accumulating, where latency matters, how GPU and CPU stages interact, and when throughput or utilization no longer matches expectations.
      </p>
      <p class="leading-relaxed mb-6">
        A large part of this work is keeping the system traceable. Media workflows depend on independent services passing work through a sequence of processing, validation, packaging, and delivery stages. When performance shifts, the environment should make it possible to follow the path through compute, network, storage, and GPU resources without treating the system as a black box.
      </p>
      <p class="leading-relaxed mb-6">
        I work across Kubernetes, AWS, infrastructure as code, CI/CD, autoscaling, observability, GPU infrastructure, and high-throughput storage/networking systems to build platforms that remain steady as media workloads grow, spike, or change shape.
      </p>
      <p class="leading-relaxed mb-6">
        For me, cloud infrastructure is not separate from the product. It is the runtime environment that determines whether video, AI, and media workflow products stay reliable, observable, and predictable in production.
      </p>
    `,
  },
  {
    id: 'hardware-embedded-modal',
    category: 'Hardware & Embedded Systems',
    iconName: 'fa6-solid:microchip',
    imageUrl: embeddedSystemsImg,
    content: `
      <p class="leading-relaxed mb-6">
        I work with hardware at both the board and system levels. On the board side, I restore electronics, repair PCBs, trace signal paths, replace components, and study how appliances and embedded devices behave internally. Working at this level gives me a practical understanding of the constraints software is built around and how devices respond under real conditions.
      </p>
      <p class="leading-relaxed mb-6">
        I also maintain a full server rack in my home lab, where I run distributed workloads similar to the systems I support professionally. Direct access to the hardware makes it easier to observe how clusters behave as services shift, fail, compete for resources, or expose performance issues that are difficult to reproduce in managed environments.
      </p>
      <p class="leading-relaxed mb-6">
        Some of my hardware work is project-based. I assembled and wired a full-sized arcade cabinet that integrates modern components, custom software, input hardware, and a complete emulation stack. Projects like this are a practical way to explore how physical layout, electronics, software timing, and user interaction affect the final experience.
      </p>
      <p class="leading-relaxed mb-6">
        Working across board-level devices, embedded systems, and server hardware gives me a clearer view of how software interacts with the platform underneath it. That perspective shapes how I design larger systems, whether they run on small devices, local clusters, or global cloud platforms.
      </p>
    `,
  },
  {
    id: 'gaming-modal',
    category: 'Gaming',
    iconName: 'fa6-solid:gamepad',
    imageUrl: gamingImg,
    content: `
      <p class="leading-relaxed mb-6">
        Gaming was my first real gateway into technology. I grew up with systems like the Nintendo and Super Nintendo, PlayStation, and the original Xbox, and over time I became interested in more than what was happening on the screen. I wanted to understand how games stored data, how consoles managed limited resources, how engines handled timing and performance, and why certain behaviors appeared under pressure.
      </p>
      <p class="leading-relaxed mb-6">
        That curiosity still shapes how I approach interactive media. I spend time studying file formats, asset structures, emulation behavior, hardware constraints, and the design decisions behind older game systems. These projects give me a way to explore the relationship between software, hardware, performance, and user experience in systems that were often built under tight technical limits.
      </p>
      <p class="leading-relaxed mb-6">
        I also enjoy restoring older consoles, repairing hardware, and building the environments I play on. One of my favorite projects is a full-sized arcade cabinet that I assembled and wired myself, integrating modern components, custom software, input hardware, and a complete emulation stack.
      </p>
      <p class="leading-relaxed mb-6">
        Gaming remains both a hobby and a technical outlet. It is where my interest in technology started, and it continues to influence how I think about interactive systems, media platforms, performance, and the connection between software and the hardware beneath it.
      </p>
    `,
  },
];

const showModal = (index: number) => {
  currentModalIndex.value = index;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleNext = () => {
  if (currentModalIndex.value !== null) {
    currentModalIndex.value = (currentModalIndex.value + 1) % modals.length;
  }
};

const handlePrevious = () => {
  if (currentModalIndex.value !== null) {
    currentModalIndex.value = (currentModalIndex.value - 1 + modals.length) % modals.length;
  }
};

const toggleModalExpand = () => {
  isModalExpanded.value = !isModalExpanded.value;
  triggerOverflowCheck.value += 1;
};
</script>
