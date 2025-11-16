<template>
  <div class="h-full flex flex-col p-4 sm:p-6 w-full max-w-3xl mx-auto">
    <div class="mb-6">
      <p class="mb-4 text-sm sm:text-base">
        This website uses an <strong>ErrorBoundary</strong> to catch and gracefully handle unexpected errors.
        When an error occurs, instead of crashing the entire site, the ErrorBoundary catches it and displays a
        relevant error message. This ensures the user experience remains intact even when problems arise.
      </p>
      <p class="mb-4 text-sm sm:text-base">
        Below you can simulate different types of errors that the ErrorBoundary can catch.
        Use the dropdown menu to select an error type, then click the "Test" button to simulate that error.
        You can clear the error afterward by using the "Clear Error" button or just select a different error type.
      </p>
    </div>

    <div class="flex-grow flex flex-col items-center justify-center space-y-6">
      <div class="dropdown dropdown-bottom mb-6 w-full max-w-xs sm:max-w-xl">
        <details class="w-full" ref="detailsRef">
          <summary data-testid="error-dropdown-button" class="btn w-full flex items-center justify-between">
            {{errorTypes.find((error) => error.value === selectedError)?.label || 'Select Error'}}
            <Icon icon="fa6-solid:chevron-down" class="ml-2" />
          </summary>
          <ul id="error-type-listbox" role="listbox" aria-label="Select error type"
            class="dropdown-content menu bg-base-100 rounded-box p-2 shadow mt-2 w-full z-[1]"
            data-testid="error-dropdown-list">
            <li v-for="errorType in errorTypes" :key="errorType.value" role="option"
              :aria-selected="selectedError === errorType.value" :data-testid="`error-option-${errorType.value}`">
              <a @click.prevent="() => handleErrorSelection(errorType.value)" href="#" class="block w-full">
                {{ errorType.label }}
              </a>
            </li>
          </ul>
        </details>
      </div>

      <div class="flex justify-center gap-4 mb-6">
        <button data-testid="test-error-button"
          :class="`btn btn-sm btn-outline btn-primary ${selectedError ? '' : 'btn-disabled'}`" @click="simulateError"
          :disabled="!selectedError">
          Test
        </button>
        <button data-testid="clear-error-button"
          :class="`btn btn-sm btn-outline btn-accent ${errorType ? '' : 'btn-disabled'}`" @click="clearError"
          :disabled="!errorType">
          Clear Error
        </button>
      </div>

      <div class="w-full max-w-xs sm:max-w-xl bg-base-200 p-4 sm:p-6 rounded-lg shadow-md mx-auto">
        <ErrorBoundary ref="errorBoundaryRef" :show-reload-button="false" :is-test-error="true" @reset="handleReset">
          <div v-if="errorType" class="text-error text-center">
            <BuggyComponent :error-type="errorType" />
          </div>
          <div v-else class="text-success text-center">Please select an error to test.</div>
        </ErrorBoundary>
      </div>
    </div>
    <div class="pb-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import BuggyComponent from './BuggyComponent.vue';

interface Props {
  onClose?: () => void;
}

const props = defineProps<Props>();


const errorType = ref<string | null>(null);
const selectedError = ref<string | null>(null);
const resetSourceRef = ref<'selectingError' | 'clearingError' | null>(null);
const errorBoundaryRef = ref<InstanceType<typeof ErrorBoundary> | null>(null);
const detailsRef = ref<HTMLDetailsElement | null>(null);

const errorTypes = [
  { label: 'Network Error', value: 'network' },
  { label: 'Fetch Error', value: 'fetch' },
  { label: 'CORS Error', value: 'cors' },
  { label: 'Authentication Error', value: 'auth' },
  { label: 'Timeout Error', value: 'timeout' },
  { label: 'Validation Error', value: 'validation' },
  { label: 'Rate Limit Error', value: 'rateLimit' },
  { label: 'Generic Error', value: 'generic' },
];

const handleErrorSelection = (errorValue: string) => {
  resetSourceRef.value = 'selectingError';
  selectedError.value = errorValue;
  errorType.value = null;
  errorBoundaryRef.value?.resetError();

  if (detailsRef.value) {
    detailsRef.value.open = false;
  }
};

const simulateError = () => {
  if (selectedError.value) {
    errorType.value = selectedError.value;
  }
};

const clearError = () => {
  resetSourceRef.value = 'clearingError';
  errorType.value = null;
  errorBoundaryRef.value?.resetError();
};

const handleReset = () => {
  errorType.value = null;

  if (!resetSourceRef.value && props.onClose) {
    props.onClose();
  }

  resetSourceRef.value = null;
};

onMounted(async () => {
  await nextTick();
  const dropdownButton = document.querySelector('[data-testid="error-dropdown-button"]');
  if (dropdownButton && dropdownButton instanceof HTMLElement) {
    dropdownButton.focus();
  }
});
</script>
