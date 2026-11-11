/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  mutate: ['almy.js'],
  reporters: [
    'clear-text',
    'progress',
    'html',
    // Only CI pushes to master provide the key; it feeds the README badge.
    ...(process.env.STRYKER_DASHBOARD_API_KEY ? ['dashboard'] : []),
  ],
  dashboard: { reportType: 'full' },
  coverageAnalysis: 'perTest',
  thresholds: { high: 100, low: 100, break: 100 },
};
