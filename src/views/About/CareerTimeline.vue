<template>
  <div class="w-full max-w-5xl mb-10 p-6 md:p-8 bg-base-100 rounded-xl shadow-xl border border-base-300">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-base-content mb-2">Career Timeline</h2>
      <p class="text-base-content/70 text-lg">Professional journey and milestones</p>
    </div>
    <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical" aria-label="Career Timeline">
      <CareerTimelineItem v-for="(item, index) in dataToRender" :key="index" :date="item.date" :title="item.title"
        :subtitle="item.subtitle" :description="item.description" :position="item.position" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import CareerTimelineItem from './CareerTimelineItem.vue';

export interface CareerTimelineData {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  position: 'start' | 'end';
}

interface Props {
  timelineData?: CareerTimelineData[];
}

const props = defineProps<Props>();

const defaultTimelineData: CareerTimelineData[] = [
  {
    date: '2015 - Present',
    title: 'Product Engineering in Media, AI, and Streaming Platforms',
    subtitle: 'Sony Pictures, Disney, DreamWorks Animation, Paramount Pictures, Electronic Arts, PlayStation, Vevo, Live Nation, and BMG Music',
    description: 'Built software products for media, gaming, AI, and video streaming platforms, helping teams process content, deliver high-quality video, automate complex workflows, monitor system health, and keep large-scale services reliable during launches, releases, and traffic spikes.',
    position: 'start',
  },
  {
    date: '2011 - 2014',
    title: 'Early Product Engineering & Web Platforms',
    subtitle: 'RWI Studios',
    description: 'Built and maintained client web applications, backend integrations, deployment workflows, and hosting automation. Introduced early CI/CD practices that improved delivery consistency and laid the foundation for later work in DevOps, cloud platforms, and production software systems.',
    position: 'end',
  },
  {
    date: '2009 - 2011',
    title: 'Network Engineering & ISP Infrastructure',
    subtitle: 'Frontier Internet',
    description: 'Built and supported ISP network infrastructure, improved uptime, maintained customer-facing connectivity systems, and helped modernize network configuration and operational processes.',
    position: 'start',
  },
  {
    date: '2004 - 2007',
    title: 'Linux Systems Administration & Automation',
    subtitle: 'TigerDirect',
    description: 'Managed Linux servers and internal systems, improved security hardening, supported production operations, and introduced early automation tools for repeatable system administration.',
    position: 'end',
  },
];

const dataToRender = props.timelineData || defaultTimelineData;
</script>
