import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    typecheck: { enabled: true, tsconfig: './tsconfig.types.json' },
    coverage: {
      provider: 'v8',
      include: ['almy.js'],
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});
