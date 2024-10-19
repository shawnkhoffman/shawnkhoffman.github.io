import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sitemap from 'vite-plugin-sitemap';
import { configDefaults } from 'vitest/config';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://shawnkhoffman.dev',
      exclude: ['/404'],
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ],
  base: '/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return undefined;
        }
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    silent: true,
  },
});