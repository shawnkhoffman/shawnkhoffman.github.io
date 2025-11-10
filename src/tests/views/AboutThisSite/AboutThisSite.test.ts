import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AboutThisSite from '@/views/AboutThisSite/AboutThisSite.vue';

describe('AboutThisSite Component', () => {
  test('renders without crashing', () => {
    const wrapper = mount(AboutThisSite);
    expect(wrapper.exists()).toBe(true);
  });

  test('renders technologies section', () => {
    const wrapper = mount(AboutThisSite);
    expect(wrapper.text()).toContain('Technologies');
  });
});

