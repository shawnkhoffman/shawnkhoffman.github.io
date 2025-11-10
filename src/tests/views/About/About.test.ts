import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import About from '@/views/About/About.vue';

describe('About Component', () => {
  beforeEach(() => {
    // Setup if needed
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('Rendering', () => {
    test('renders main content sections', () => {
      const wrapper = mount(About);
      expect(wrapper.find('h1').exists()).toBe(true);
    });
  });
});

