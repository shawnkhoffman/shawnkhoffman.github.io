<template>
  <div v-if="!shouldThrow" class="text-success text-center">No Errors</div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';

class SimulatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SimulatedError';
  }
}

interface Props {
  errorType: string;
}

const props = defineProps<Props>();

let shouldThrow = false;

onBeforeMount(() => {
  if (props.errorType === 'network') {
    throw new SimulatedError('NetworkError: Failed to connect');
  } else if (props.errorType === 'fetch') {
    throw new SimulatedError('Failed to fetch: Error retrieving data');
  } else if (props.errorType === 'cors') {
    throw new SimulatedError('CORS error: Blocked by CORS policy');
  } else if (props.errorType === 'auth') {
    throw new SimulatedError('AuthenticationError: Invalid credentials');
  } else if (props.errorType === 'timeout') {
    throw new SimulatedError('TimeoutError: The request timed out');
  } else if (props.errorType === 'validation') {
    throw new SimulatedError('ValidationError: Form input is invalid');
  } else if (props.errorType === 'rateLimit') {
    throw new SimulatedError('RateLimitError: Too many requests');
  } else if (props.errorType === 'generic') {
    throw new SimulatedError('Boop beep boooooop!');
  }
  shouldThrow = false;
});
</script>
