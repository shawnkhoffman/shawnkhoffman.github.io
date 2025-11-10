import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CareerTimeline from '@/views/About/CareerTimeline.vue';

describe('CareerTimeline', () => {
  describe('Rendering', () => {
    test('renders timeline container with items', async () => {
      const wrapper = mount(CareerTimeline);
      await wrapper.vm.$nextTick();
      const timeline = wrapper.find('ul[aria-label="Career Timeline"]');
      expect(timeline.exists()).toBe(true);
    });
  });

  describe('Structure', () => {
    test('contains timeline items', () => {
      const wrapper = mount(CareerTimeline);
      const items = wrapper.findAll('li[role="listitem"]');
      expect(items.length).toBeGreaterThan(0);
    });
  });
});

