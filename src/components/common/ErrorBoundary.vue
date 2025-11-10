<template>
  <div v-if="!hasError">
    <slot />
  </div>
  <div
    v-else
    ref="errorCardRef"
    :class="`flex flex-col items-center justify-center w-full p-4 sm:p-6 ${className}`"
    role="alert"
    aria-live="assertive"
    tabIndex="-1"
  >
    <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-base-100 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg overflow-auto">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-error">
        Oops! Something went wrong.
      </h1>

      <p class="mb-4 text-sm sm:text-base md:text-lg">
        {{ error ? getErrorMessage(error) : '' }}
      </p>

      <template v-if="!isTestError && error?.message">
        <pre class="whitespace-pre-wrap text-xs sm:text-sm md:text-base text-base-content bg-error bg-opacity-10 p-2 sm:p-4 rounded-lg mb-4 max-h-40 overflow-auto">
          {{ error.message }}
        </pre>
      </template>

      <div class="flex flex-wrap gap-2 mt-4">
        <button
          v-if="showReloadButton"
          class="btn btn-primary btn-sm"
          @click="handleReload"
          aria-label="Reload the page"
          :disabled="isResetting"
        >
          Reload Page
        </button>

        <button
          v-if="showRetryButton || (!isTestError && !showRetryButton)"
          data-testid="reset-error-button"
          class="btn btn-secondary btn-sm"
          @click="resetError"
          aria-label="Try again"
          :disabled="isResetting"
        >
          {{ isResetting ? 'Retrying...' : 'Try Again' }}
        </button>
      </div>

      <p v-if="retryCount > 0" class="text-sm text-base-content/70 mt-4">
        Retry attempt {{ retryCount }} of {{ maxRetries }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, onErrorCaptured } from 'vue';
import { datadogRum } from '@datadog/browser-rum';

interface Props {
  fallback?: unknown;
  onError?: (error: Error, errorInfo: unknown) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
  showReloadButton?: boolean;
  showRetryButton?: boolean;
  isTestError?: boolean;
  maxRetries?: number;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showReloadButton: true,
  showRetryButton: false,
  isTestError: false,
  maxRetries: 3,
  className: '',
});

const emit = defineEmits<{
  error: [error: Error, errorInfo: unknown];
  reset: [];
}>();

const ERROR_MESSAGES: Record<string, { match?: RegExp; message: string }> = {
  NETWORK: {
    match: /(NetworkError|net::ERR)/i,
    message: "It looks like you're offline or experiencing network issues. Please check your internet connection and try again.",
  },
  FETCH: {
    match: /Failed to fetch/i,
    message: "There was a problem fetching data from the server. Please try refreshing the page or come back later.",
  },
  CORS: {
    match: /CORS|Cross-Origin/i,
    message: "A security restriction was encountered while fetching data. Please try again later.",
  },
  AUTH: {
    match: /(Authentication|Authorization)Error/i,
    message: "You don't have permission to access this resource or your session has expired. Please try logging in again.",
  },
  VALIDATION: {
    match: /ValidationError/i,
    message: "There was an issue with the provided data. Please check your input and try again.",
  },
  RATE_LIMIT: {
    match: /RateLimitError|Too Many Requests/i,
    message: "You've made too many requests. Please wait a moment before trying again.",
  },
  TIMEOUT: {
    match: /TimeoutError|deadline exceeded/i,
    message: "The request took too long to complete. Please check your connection and try again.",
  },
  DEFAULT: {
    message: "An unexpected error occurred. Your error has been submitted and will be fixed soon.",
  },
};

const RESET_TIMEOUT = 300;
const ERROR_STORAGE_KEY = 'error_boundary_state';

const hasError = ref(false);
const error = ref<Error | null>(null);
const errorInfo = ref<unknown>(null);
const retryCount = ref(0);
const isResetting = ref(false);
const errorCardRef = ref<HTMLDivElement | null>(null);
let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isHandlingTestError = false;

const loadPersistedError = () => {
  try {
    const savedError = sessionStorage.getItem(ERROR_STORAGE_KEY);
    if (savedError) {
      const parsed = JSON.parse(savedError);
      error.value = new Error(parsed.error.message);
      errorInfo.value = parsed.errorInfo;
      hasError.value = true;
      sessionStorage.removeItem(ERROR_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to load persisted error state:', e);
  }
};

const persistError = () => {
  try {
    if (error.value) {
      const serializedError = {
        error: { message: error.value.message, stack: error.value.stack },
        errorInfo: errorInfo.value,
      };
      sessionStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(serializedError));
    }
  } catch (e) {
    console.warn('Failed to persist error state:', e);
  }
};

const getErrorMessage = (err: Error): string => {
  const errorString = err.message || err.toString();
  
  const matchedError = Object.values(ERROR_MESSAGES).find(
    ({ match }) => match && match.test(errorString)
  );
  
  return matchedError?.message || ERROR_MESSAGES.DEFAULT.message;
};

const reportError = (err: Error, info: unknown) => {
  try {
    datadogRum.addError(err, {
      errorInfo: info,
      retryCount: retryCount.value,
    });
  } catch (e) {
    console.error('Failed to report error:', e);
  }
};

const resetError = () => {
  if (props.isTestError) {
    hasError.value = false;
    error.value = null;
    errorInfo.value = null;
    isResetting.value = false;
    
    if (props.onReset) {
      props.onReset();
    }
    emit('reset');
    return;
  }

  if (retryCount.value >= props.maxRetries) {
    error.value = new Error(`Maximum retry attempts (${props.maxRetries}) exceeded`);
    hasError.value = true;
    return;
  }

  isResetting.value = true;
  retryCount.value += 1;

  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId);
  }

  retryTimeoutId = setTimeout(() => {
    hasError.value = false;
    error.value = null;
    errorInfo.value = null;
    isResetting.value = false;
    
    if (props.onReset) {
      props.onReset();
    }
    emit('reset');
  }, RESET_TIMEOUT);
};

const handleReload = () => {
  window.location.reload();
};

onErrorCaptured((err: Error, instance, info) => {
  if (err.name === 'SimulatedError') {
    isHandlingTestError = true;
    setTimeout(() => {
      isHandlingTestError = false;
    }, 0);
  }

  if (!isHandlingTestError) {
    if (props.onError) {
      props.onError(err, info);
    }
    if (!props.isTestError) {
      reportError(err, info);
    }
  }

  error.value = err;
  errorInfo.value = info;
  hasError.value = true;

  return false; // Prevent error from propagating
});

watch(() => props.resetKeys, (newKeys, oldKeys) => {
  if (newKeys && oldKeys) {
    const hasChanged = newKeys.some((key, index) => key !== oldKeys[index]);
    if (hasChanged) {
      resetError();
    }
  }
}, { deep: true });

onMounted(() => {
  loadPersistedError();
  
  const handleGlobalError = (event: ErrorEvent) => {
    if (props.isTestError || isHandlingTestError) {
      event.preventDefault();
    }
  };
  
  window.addEventListener('error', handleGlobalError);
  
  onUnmounted(() => {
    window.removeEventListener('error', handleGlobalError);
  });
});

onUnmounted(() => {
  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId);
  }

  if (hasError.value) {
    persistError();
  }
});

defineExpose({
  resetError,
});
</script>

