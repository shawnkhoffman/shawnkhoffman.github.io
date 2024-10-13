import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  cacheDir: '.vitest',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
        singleThread: false,
      },
    },
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    sequence: {
      concurrent: true,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    silent: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});
