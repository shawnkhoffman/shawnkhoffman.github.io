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
    title: 'Media Systems and Streaming Services',
    subtitle: 'Sony Pictures, Disney Studios, HPE Services, and Rackspace',
    description: 'Developed state-of-the-art video streaming experiences for millions of concurrent users and built AI/ML-driven film production systems using cloud services and MLOps across Fortune 500 entertainment companies.',
    position: 'start',
  },
  {
    date: '2011 - 2014',
    title: 'Web Development',
    subtitle: 'RWI Studios',
    description: 'Built and maintained client web apps, introducing early CI/CD and hosting automation practices that laid groundwork for future DevOps work.',
    position: 'end',
  },
  {
    date: '2009 - 2011',
    title: 'Internet Network Engineering',
    subtitle: 'Frontier Internet',
    description: 'Built and supported ISP infrastructure, improving uptime and helping modernize network configuration processes.',
    position: 'start',
  },
  {
    date: '2004 - 2007',
    title: 'Linux Server Administration',
    subtitle: 'TigerDirect',
    description: 'Managed servers and internal systems, hardening security and introducing early automation tools.',
    position: 'end',
  },
];

const dataToRender = props.timelineData || defaultTimelineData;
</script>
