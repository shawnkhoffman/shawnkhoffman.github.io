<template>
  <router-link
    :to="href"
    class="px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
    @click="handleClick"
    :aria-label="label"
    role="menuitem"
  >
    {{ label }}
  </router-link>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  href: string;
  label: string;
  onClick: (label: string) => void;
}

const props = defineProps<Props>();
const router = useRouter();

const handleClick = () => {
  props.onClick(props.label);
  router.push(props.href);
};
</script>

