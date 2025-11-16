import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import { useThemeProvider } from '@/composables/useTheme';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/about-me', component: { template: '<div>About</div>' } },
    { path: '/about-this-site', component: { template: '<div>About This Site</div>' } },
  ],
});

describe('Navbar', () => {
  let originalGtag: typeof window.gtag;

  beforeEach(() => {
    originalGtag = window.gtag;
    window.gtag = vi.fn((command: string, action: string, params?: Record<string, unknown>) => {
      window.gtagCalls = window.gtagCalls || [];
      (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>).push({ command, action, params });
    });
  });

  afterEach(() => {
    window.gtag = originalGtag;
    (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>) = [];
  });

  const TestWrapper = defineComponent({
    components: {
      Navbar,
    },
    setup() {
      useThemeProvider();
      return {};
    },
    template: '<Navbar />',
  });

  test('renders with logo', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [router],
      },
    });
    const logo = wrapper.find('img');
    expect(logo.exists()).toBe(true);
  });

  test('renders navigation links', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [router],
      },
    });
    const links = wrapper.findAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});
