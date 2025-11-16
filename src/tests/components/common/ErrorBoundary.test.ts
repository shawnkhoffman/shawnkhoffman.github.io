import { describe, test, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';

const ErrorComponent = {
  props: {
    shouldThrow: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: { shouldThrow: boolean }) {
    if (props.shouldThrow) {
      throw new Error('Test error');
    }
    return { shouldThrow: props.shouldThrow };
  },
  template: '<div>No Error</div>',
};

describe('ErrorBoundary', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    errorSpy = vi.spyOn(console, 'error');
    errorSpy.mockImplementation(() => { });
  });

  afterEach(() => {
    errorSpy.mockClear();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  describe('Rendering', () => {
    test('renders children when there is no error', () => {
      const wrapper = mount(ErrorBoundary, {
        slots: {
          default: 'Test Content',
        },
      });

      expect(wrapper.text()).toContain('Test Content');
    });

    test('renders fallback UI when child throws an error', async () => {
      const wrapper = mount(ErrorBoundary, {
        props: {
          isTestError: true,
        },
        slots: {
          default: ErrorComponent,
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.text()).toMatch(/something went wrong|unexpected error occurred/i);
    });
  });

  describe('Error handling', () => {
    test('calls onError when an error occurs', () => {
      const onErrorMock = vi.fn();

      mount(ErrorBoundary, {
        props: {
          isTestError: true,
          onError: onErrorMock,
        },
        slots: {
          default: ErrorComponent,
        },
      });

      expect(onErrorMock).toHaveBeenCalled();
    });

    test('shows reload button by default', async () => {
      const wrapper = mount(ErrorBoundary, {
        props: {
          isTestError: true,
        },
        slots: {
          default: ErrorComponent,
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.text()).toMatch(/reload page/i);
    });

    test('shows retry button when showRetryButton is true', async () => {
      const wrapper = mount(ErrorBoundary, {
        props: {
          isTestError: true,
          showRetryButton: true,
          showReloadButton: true,
        },
        slots: {
          default: ErrorComponent,
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.text()).toMatch(/reload page/i);
      const retryButton = wrapper.find('[data-testid="reset-error-button"]');
      expect(retryButton.exists()).toBe(true);
      expect(retryButton.text()).toMatch(/try again/i);
    });
  });
});
