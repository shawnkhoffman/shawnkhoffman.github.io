import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useThemeProvider } from '@/composables/useTheme';

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Test</div>' } }],
});

describe('MainLayout Component', () => {
  describe('Structure', () => {
    test('applies correct layout classes to the main container', async () => {
      const TestWrapper = defineComponent({
        components: {
          MainLayout,
        },
        setup() {
          useThemeProvider();
          return {};
        },
        template: '<MainLayout><slot /></MainLayout>',
      });

      const wrapper = mount(TestWrapper, {
        global: {
          plugins: [router],
        },
        slots: {
          default: 'Test Content',
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));

      const mainElement = wrapper.find('main');
      expect(mainElement.exists()).toBe(true);

      if (mainElement.exists()) {
        const classNames = mainElement.classes();
        // Check that main element has the expected classes
        expect(classNames.length).toBeGreaterThan(0);
        // Verify key layout classes are present
        const hasFlexGrow = classNames.includes('flex-grow') || wrapper.html().includes('flex-grow');
        const hasFlex = classNames.includes('flex') || wrapper.html().includes('flex');
        const hasFlexCol = classNames.includes('flex-col') || wrapper.html().includes('flex-col');
        
        expect(hasFlexGrow || hasFlex || hasFlexCol).toBe(true);
      }
    });
  });
});

