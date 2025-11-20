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
        <div v-html="modals[currentModalIndex].content"></div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Modal from '@/components/common/Modal.vue';

interface ModalData {
  id: string;
  category: string;
  iconName: string;
  content: string;
}

const currentModalIndex = ref<number | null>(null);
const isModalOpen = ref(false);
const isModalExpanded = ref(true);
const triggerOverflowCheck = ref(0);

const modals: ModalData[] = [
  {
    id: 'software-engineering-modal',
    category: 'Software Engineering',
    iconName: 'fa6-solid:code',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-software-engineering.png" alt="Software Engineering" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        My journey in software began in the early days of the web, building small sites on GeoCities and Tripod to see how pages were assembled. By high school, I was using Dreamweaver, which pushed me toward understanding how larger systems fit together and why some approaches hold up better as they grow. That early curiosity set the direction for the work I do today.
      </p>
      <p class="leading-relaxed mb-6">
        Most of my professional work centers on backend services and distributed workflows in media environments. These systems run continuously and respond to shifts in workload, timing, and ordering. Small changes in one area can affect several others, so I focus on how services interact within a larger workflow rather than treating them as isolated pieces. This matters when the output depends on stages completing in the proper sequence under real load, not just under test conditions.
      </p>
      <p class="leading-relaxed mb-6">
        When designing or adjusting services, I keep the workflow easy to trace. Media pipelines rely on multiple stages and require clarity at each step, making it easier to see where the system is slowing down or where assumptions no longer align with real behavior. It also helps when the system needs to evolve without introducing hidden coupling.
      </p>
      <p class="leading-relaxed mb-6">
        I occasionally work on frontend code, mainly when the interface needs to reflect the underlying workflow accurately. In those cases, I keep the UI minimal and predictable so it supports the system rather than adding another layer of complexity. It's not a significant part of my role, but it's useful when a project benefits from an end-to-end view.
      </p>
      <p class="leading-relaxed mb-6">
        My background in SRE and platform engineering influences how I handle software that runs for long periods or processes high-volume workloads. I pay attention to how behavior changes over time, how failures present themselves, and how deployment choices affect the surrounding system. This perspective helps ensure the software behaves consistently once it moves into production.
      </p>
      <p class="leading-relaxed mb-6">
        Most of my work involves understanding how software behaves when it's part of a larger, timing-sensitive workflow, especially in media systems where continuous activity exposes patterns that don't appear in simpler applications. I design with those conditions in mind so the system remains steady as the workload shifts and grows.
      </p>
    `,
  },
  {
    id: 'cloud-infrastructure-modal',
    category: 'Cloud Infrastructure',
    iconName: 'fa6-solid:cloud',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-cloud-infrastructure.png" alt="Cloud Infrastructure" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        Most of my cloud work supports the systems behind video processing and delivery. These workloads behave differently from typical web services. Transcoding causes sharp, uneven spikes in CPU and memory usage. GPU stages introduce their own patterns, including large data transfers, device-level scheduling, and performance that varies with how work is grouped. Ingest pipelines run continuously and can back up when upstream sources change pace. Quality checks and packaging steps depend on stable environmental behavior, because slowdowns or timing drift can affect the final output.
      </p>
      <p class="leading-relaxed mb-6">
        I pay close attention to how the platform reacts under real workloads. GPU nodes reveal subtle performance changes driven by queue pressure, memory availability, and how competing processes share the device. Watching where work begins to accumulate, where latency matters, and which parts of the workflow are sensitive to timing helps determine how the environment needs to be structured.
      </p>
      <p class="leading-relaxed mb-6">
        When building or adjusting the platform, I keep the layout understandable so the entire workflow can be followed without guesswork. Media systems rely on several independent components passing work from one stage to the next. Once GPU-bound stages are part of the pipeline, the order and timing of these handoffs become even more critical. A clear environment makes it easier to understand where data is slowing down, why throughput is changing, and when utilization no longer matches expectations.
      </p>
      <p class="leading-relaxed mb-6">
        The paths between services also matter. The sequence in which tasks move, and the time each stage waits for compute or device access, directly affects performance and output consistency. When something begins to drift, being able to trace the path through CPU, network, and GPU stages allows you to pinpoint the cause rather than treating the system as opaque.
      </p>
      <p class="leading-relaxed mb-6">
        The needs of these media workflows define my work in cloud infrastructure. The goal is to build a platform that remains steady as the workload shifts, maintains predictable timing, and avoids introducing instability into the pipeline. The cloud is the environment where these systems run. The workflow dictates how the environment must be designed.
      </p>
    `,
  },
  {
    id: 'media-systems-modal',
    category: 'Media Systems',
    iconName: 'fa6-solid:video',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-media-systems.png" alt="Media Systems" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        My work in media technology centers on the systems that move video from its source through the stages required for processing and delivery. These pipelines involve several steps, and each step depends on timing, order, and predictable behavior. A slight shift early in the workflow often appears much later, so I pay attention to how each stage influences the next.
      </p>
      <p class="leading-relaxed mb-6">
        A large part of this work involves understanding how video actually flows through the system. Incoming content arrives in one state and undergoes a series of transformations before it is ready for distribution. Each stage responds differently depending on volume, resource pressure, and the quality requirements of the output. Following how the work moves, where it begins to slow, and how the results change under different conditions helps keep the entire process steady.
      </p>
      <p class="leading-relaxed mb-6">
        I also work on the parts of the system that segment and package content for streaming. These stages behave differently from ordinary backend services because playback depends on correct ordering and consistent timing. The system needs to respect those constraints instead of being forced into general patterns that do not fit media workloads.
      </p>
      <p class="leading-relaxed mb-6">
        Quality analysis tools are another area I spend time on. These tools measure perceptual quality or detect issues in the source, and their results depend on consistent processing conditions. If the environment changes, the quality results can drift, so I pay attention to how the surrounding system affects these measurements.
      </p>
      <p class="leading-relaxed mb-6">
        Media pipelines run continuously and follow real patterns such as release cycles, bursty ingest behavior, and traffic spikes. I design and support them with those conditions in mind. The priority is to keep the workflow stable and predictable so the final output remains consistent even as the volume of work increases.
      </p>
    `,
  },
  {
    id: 'machine-learning-modal',
    category: 'Machine Learning',
    iconName: 'fa6-solid:brain',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-machine-learning.png" alt="Machine Learning" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        Most of my work with machine learning has been tied to media systems. I have worked with models for video analysis, content understanding, recommendation workflows, and film production tasks. These problems involve significant assets, uneven workloads, and real timing constraints, so the focus is usually on how the model fits into the larger system rather than on the model itself.
      </p>
      <p class="leading-relaxed mb-6">
        I have collaborated with research teams to bring models out of experimentation and into production environments. That process often requires adapting research code to behave consistently under sustained load, handling significant inputs, and working within the sequencing requirements of media pipelines. The intention is to make the model a stable part of the workflow rather than a fragile piece sitting on the sidelines.
      </p>
      <p class="leading-relaxed mb-6">
        I pay attention to how training data is prepared and how production data is introduced into the system. Media workloads include a mix of structured and unstructured inputs, and the quality and shape of that data influence the entire pipeline. Understanding where the data comes from, how it is produced, and how it changes over time helps guide how the model should be integrated and observed.
      </p>
      <p class="leading-relaxed mb-6">
        Deploying models in these environments involves several moving parts. The model, the services that support it, the workflow that triggers it, and the systems that depend on its output all influence one another. I focus on making these interactions predictable so that when performance shifts or drift appear, the underlying cause can be identified without guesswork.
      </p>
      <p class="leading-relaxed mb-6">
        My machine learning work sits at the intersection of research and long-running production systems. I am interested in how models behave when deployed to real workflows, especially in environments where timing, throughput, and asset size all influence outcomes.
      </p>
    `,
  },
  {
    id: 'hardware-embedded-modal',
    category: 'Hardware & Embedded Systems',
    iconName: 'fa6-solid:microchip',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-embedded-systems.png" alt="Hardware & Embedded Systems" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        I work with hardware at both the board and system levels. On the board side, I restore electronics, repair PCBs, and study how appliances and embedded devices behave internally. This often involves disassembling hardware, replacing components, tracing signal paths, and confirming that the device behaves as expected. Working at this level makes it easier to understand the limits the original software was written around and how the platform reacts under real conditions.
      </p>
      <p class="leading-relaxed mb-6">
        I also maintain a full server rack in my home lab. It's set up to run the kinds of distributed workloads I've supported professionally, with enough variability to reveal how clusters respond as services shift, fail, or compete for resources. Having direct access to the hardware helps when evaluating how changes propagate through a system or when testing behavior that's difficult to reproduce in managed environments.
      </p>
      <p class="leading-relaxed mb-6">
        In addition to repairs and system testing, I build hardware projects when they support what I'm working on or when the design itself raises interesting problems. One example is the full-sized arcade cabinet I assembled and wired myself, integrating modern components, custom software, and a complete emulation stack. Projects like this are a practical way to explore how physical layout, electronics, input hardware, and software timing interact.
      </p>
      <p class="leading-relaxed mb-6">
        Working across both board-level and server-level systems gives me a clearer view of how software interacts with the platform underneath it. That perspective shapes how I design and support the systems I work with, whether they run on small embedded devices or across larger service environments.
      </p>
    `,
  },
  {
    id: 'gaming-modal',
    category: 'Gaming',
    iconName: 'fa6-solid:gamepad',
    content: `
      <div class="flex justify-center mb-6">
        <img src="/src/assets/images/shawn-gaming.png" alt="Gaming" class="max-w-full h-auto max-h-[500px]" />
      </div>
      <p class="leading-relaxed mb-6">
        Gaming was my first real gateway into technology. I spent a lot of time with systems like the Nintendo and Super Nintendo, PlayStation, and the original Xbox, and I eventually wanted to understand more than what was happening on the screen. That curiosity pushed me to look into how games stored their data, how consoles managed resources, and why certain behaviors emerged under pressure. It was the first time I found myself digging into technical details to understand how things worked.
      </p>
      <p class="leading-relaxed mb-6">
        I still enjoy gaming the same way I did when I was growing up. Video games are familiar and nostalgic, and I look forward to them in my downtime.
      </p>
      <p class="leading-relaxed mb-6">
        My interest eventually grew into a set of side projects that I work on for my own curiosity. I use both open- and closed-source tools to study file formats, examine asset structures, and understand how earlier engines approached memory and performance. I also spend time restoring older consoles and repairing hardware when something fails. These projects give me a chance to explore the systems behind the games I enjoy without treating them as professional work.
      </p>
      <p class="leading-relaxed mb-6">
        I also like building the setups I play on. I built a full-sized arcade cabinet in my home office because I was motivated by a combination of nostalgia and a love for hands-on work. Several restored consoles and custom configurations in my lab came from the same place. They are simply extensions of a hobby that has stayed with me for years.
      </p>
      <p class="leading-relaxed mb-6">
        Gaming remains a passion, a hobby, and a technical outlet. It is also where my interest in technology first began, long before I knew it would become a career.
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
