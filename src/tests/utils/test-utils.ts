import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { useThemeProvider } from '@/composables/useTheme';
import MainLayout from '@/layouts/MainLayout.vue';
import type { Component } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomRenderOptions extends Omit<MountingOptions<any>, 'global'> {
  withLayout?: boolean;
}

const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Test</div>' } },
      { path: '/about-me', component: { template: '<div>About</div>' } },
      { path: '/about-this-site', component: { template: '<div>About This Site</div>' } },
    ],
  });
};

const customRender = (
  component: Component,
  options: CustomRenderOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): VueWrapper<any> => {
  const { withLayout = false, ...mountOptions } = options;

  const router = createTestRouter();

  const TestWrapper = {
    components: {
      MainLayout,
      TestComponent: component,
    },
    setup() {
      useThemeProvider();
      return {};
    },
    template: withLayout
      ? '<MainLayout><TestComponent /></MainLayout>'
      : '<TestComponent />',
  };

  return mount(TestWrapper, {
    global: {
      plugins: [router],
    },
    ...mountOptions,
  });
};

export { customRender as render };
export { mount };
export type { VueWrapper };
