import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Introduction from '@/views/About/Introduction.vue';

describe('Introduction Component', () => {
  test('renders without crashing', () => {
    const wrapper = mount(Introduction);
    expect(wrapper.exists()).toBe(true);
  });
});

