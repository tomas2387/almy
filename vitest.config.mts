import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['almy.js'],
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});
