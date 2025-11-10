import { describe, test, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CollapsibleSection from '@/views/AboutThisSite/CollapsibleSection.vue';

describe('CollapsibleSection', () => {
  const TEST_IDS = {
    COLLAPSIBLE_SECTION: 'collapsible-section',
  };

  const mockProps = {
    title: 'Section Title',
    content: 'This is the collapsible content.',
    testId: TEST_IDS.COLLAPSIBLE_SECTION,
  };

  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Structure', () => {
    test('contains required elements', async () => {
      wrapper = mount(CollapsibleSection, {
        props: mockProps,
      });
      await wrapper.vm.$nextTick();
      
      const button = wrapper.find('button');
      const contentElement = wrapper.find('[role="region"]');

      expect(button.exists()).toBe(true);
      expect(button.text()).toContain(mockProps.title);
      expect(contentElement.exists()).toBe(true);
    });
  });

  describe('Interactions', () => {
    test('toggles content visibility on click', async () => {
      wrapper = mount(CollapsibleSection, {
        props: mockProps,
      });
      const button = wrapper.find('button');

      expect(button.attributes('aria-expanded')).toBe('false');

      await button.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button.attributes('aria-expanded')).toBe('true');

      await button.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button.attributes('aria-expanded')).toBe('false');
    });
  });

  describe('Accessibility', () => {
    test('maintains correct ARIA states', async () => {
      wrapper = mount(CollapsibleSection, {
        props: mockProps,
      });
      const button = wrapper.find('button');
      const content = wrapper.find('[role="region"]');

      expect(button.attributes('aria-expanded')).toBe('false');
      expect(content.attributes('aria-hidden')).toBe('true');

      await button.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button.attributes('aria-expanded')).toBe('true');
      expect(content.attributes('aria-hidden')).toBe('false');
    });

    test('maintains tab order', () => {
      wrapper = mount(CollapsibleSection, {
        props: mockProps,
      });
      const button = wrapper.find('button');

      expect(button.attributes('tabindex')).toBe('0');
    });

    test('supports screen readers', () => {
      wrapper = mount(CollapsibleSection, {
        props: mockProps,
      });
      const button = wrapper.find('button');
      const content = wrapper.find('[role="region"]');

      expect(button.attributes('aria-controls')).toBeDefined();
      expect(content.attributes('role')).toBe('region');
    });
  });
});

