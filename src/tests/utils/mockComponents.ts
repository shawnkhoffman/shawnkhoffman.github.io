import { defineComponent, h } from 'vue';
import { TEST_IDS } from './test-constants';
import { vi } from 'vitest';

export const MockModal = vi.fn(
  defineComponent({
    name: 'MockModal',
    props: {
      isOpen: Boolean,
      onClose: Function,
      title: String,
      content: [String, Object],
      onNext: Function,
      onPrevious: Function,
      onToggleExpand: Function,
      isExpanded: Boolean,
    },
    setup(props) {
      return () =>
        props.isOpen
          ? h('div', {
              'data-testid': TEST_IDS.MODAL,
              class: props.isExpanded ? 'expanded' : '',
            }, [
              h('h2', props.title),
              h('div', props.content),
              props.onPrevious && h('button', { onClick: props.onPrevious }, 'Previous'),
              props.onNext && h('button', { onClick: props.onNext }, 'Next'),
              h('button', { onClick: props.onClose }, 'Close'),
              h('button', { onClick: props.onToggleExpand }, props.isExpanded ? 'Compress Modal' : 'Expand Modal'),
            ])
          : null;
    },
  })
);

export const MockTechnologyCard = vi.fn(
  defineComponent({
    name: 'MockTechnologyCard',
    props: {
      icon: [String, Object],
      title: String,
      description: String,
      link: String,
    },
    setup(props) {
      return () =>
        h('a', {
          href: props.link,
          target: '_blank',
          rel: 'noopener noreferrer',
          'data-testid': TEST_IDS.TECHNOLOGY_CARD,
          class: 'flex flex-col items-center text-center hover:bg-base-200 p-4 rounded-lg transition duration-300',
          'aria-label': `Learn more about ${props.title}`,
        }, [
          h('span', { 'aria-hidden': 'true' }, props.icon),
          h('h3', { class: 'font-semibold' }, props.title),
          h('p', { class: 'text-sm' }, props.description),
        ]);
    },
  })
);

