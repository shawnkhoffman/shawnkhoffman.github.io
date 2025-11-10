<template>
  <div
    :class="`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 origin-top-right ${
      isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
    }`"
    role="menu"
    aria-orientation="vertical"
    :aria-hidden="!isOpen"
  >
    <div class="py-1">
      <a
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        :href="item.href"
        class="block px-4 py-2 text-sm text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
        @click.prevent="handleClick(item)"
        role="menuitem"
        :tabindex="isOpen ? 0 : -1"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface SubmenuItem {
  href: string;
  label: string;
}

interface Props {
  items: SubmenuItem[];
  isOpen: boolean;
  onItemClick: (label: string) => void;
}

const props = defineProps<Props>();
const router = useRouter();

const handleClick = (item: SubmenuItem) => {
  props.onItemClick(item.label);
  router.push(item.href);
};
</script>

