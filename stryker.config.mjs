/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  mutate: ['almy.js'],
  reporters: ['clear-text', 'progress', 'html'],
  coverageAnalysis: 'perTest',
  thresholds: { high: 100, low: 100, break: 100 },
};
