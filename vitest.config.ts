import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'e2e/lib/**/*.test.ts'],
    exclude: ['e2e/specs/**', 'e2e/fixtures/**', 'e2e/scripts/**', 'node_modules/**', 'dist/**'],
    css: false,
  },
});
