import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorTestContent from '@/views/AboutThisSite/ErrorTestContent.vue';

describe('ErrorTestContent Component', () => {
  test('renders without crashing', () => {
    const wrapper = mount(ErrorTestContent);
    expect(wrapper.exists()).toBe(true);
  });
});

