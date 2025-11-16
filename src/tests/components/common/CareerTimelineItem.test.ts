import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CareerTimelineItem from '@/views/About/CareerTimelineItem.vue';

describe('CareerTimelineItem', () => {
  beforeEach(() => {
    // Setup if needed
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      const wrapper = mount(CareerTimelineItem, {
        props: {
          date: '2024',
          title: 'Test Title',
          description: 'Test Description',
          position: 'start',
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Structure', () => {
    test('contains all required elements', () => {
      const wrapper = mount(CareerTimelineItem, {
        props: {
          date: '2024',
          title: 'Test Title',
          description: 'Test Description',
          position: 'start',
        },
      });

      expect(wrapper.find('li').exists()).toBe(true);
      expect(wrapper.find('time').exists()).toBe(true);
      expect(wrapper.find('h3').exists()).toBe(true);
    });
  });
});
