import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';

describe('NotFound Component', () => {
  let originalRandom: typeof Math.random;

  beforeEach(() => {
    originalRandom = Math.random;
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('Rendering', () => {
    test('renders the 404 page with correct elements', () => {
      Math.random = vi.fn(() => 0);

      const router = createRouter({
        history: createWebHistory(),
        routes: [{ path: '/:pathMatch(.*)*', component: NotFound }],
      });

      const wrapper = mount(NotFound, {
        global: {
          plugins: [router],
        },
      });

      const notFoundContainer = wrapper.find('[data-testid="404-container"]');
      expect(notFoundContainer.exists()).toBe(true);

      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe('404 - Page Not Found');
    });
  });
});
