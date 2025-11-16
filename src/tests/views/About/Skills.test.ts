import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Skills from '@/views/About/Skills.vue';

describe('Skills Component', () => {
  test('renders without crashing', () => {
    const wrapper = mount(Skills);
    expect(wrapper.exists()).toBe(true);
  });
});

