import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Entertaining404Content from '@/views/AboutThisSite/Entertaining404Content.vue';

describe('Entertaining404Content Component', () => {
  test('renders without crashing', () => {
    const wrapper = mount(Entertaining404Content);
    expect(wrapper.exists()).toBe(true);
  });
});

