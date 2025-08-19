import { describe, test, expect } from 'vitest';

describe('standalone dispatch', () => {
  test('works when destructured', () => {
    const almy = require('../..');
    almy.create();
    const { dispatch } = almy;
    dispatch('k', 1);
    dispatch('k', { inner: 1 });
    expect(almy.state('k->inner')).toBe(1);
  });
});
