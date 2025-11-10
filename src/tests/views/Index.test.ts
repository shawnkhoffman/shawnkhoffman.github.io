import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Index from '@/views/Index.vue';

describe('Index Component', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>) = [];
  });

  afterEach(() => {
    window.gtag = originalGtag;
  });

  describe('Rendering', () => {
    test('renders welcome message', async () => {
      const wrapper = mount(Index);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain('Welcome');
    });

    test('renders GitHub link', async () => {
      const wrapper = mount(Index);
      await wrapper.vm.$nextTick();
      const githubLink = wrapper.find('a[href*="github.com"]');
      expect(githubLink.exists()).toBe(true);
    });
  });
});

