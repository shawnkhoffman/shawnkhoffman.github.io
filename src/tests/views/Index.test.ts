import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent } from 'vue';
import Index from '@/views/Index.vue';
import { useThemeProvider } from '@/composables/useTheme';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Index', component: { template: '<div>Home</div>' } },
  ],
});

describe('Index Component', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>) = [];
    window.gtag = vi.fn((command: string, targetId: string | Date, config?: Record<string, unknown>) => {
      window.gtagCalls = window.gtagCalls || [];
      const action = typeof targetId === 'string' ? targetId : targetId.toString();
      (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>).push({ command, action, params: config });
    }) as typeof window.gtag;
  });

  afterEach(() => {
    window.gtag = originalGtag;
  });

  const TestWrapper = defineComponent({
    components: {
      Index,
    },
    setup() {
      useThemeProvider();
      return {};
    },
    template: '<Index />',
  });

  describe('Rendering', () => {
    test('renders welcome message', async () => {
      const wrapper = mount(TestWrapper, {
        global: {
          plugins: [router],
        },
      });
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(wrapper.text()).toContain('Welcome');
    });

    test('renders GitHub link', async () => {
      const wrapper = mount(TestWrapper, {
        global: {
          plugins: [router],
        },
      });
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      const githubLink = wrapper.find('a[href*="github.com"]');
      expect(githubLink.exists()).toBe(true);
    });
  });
});
