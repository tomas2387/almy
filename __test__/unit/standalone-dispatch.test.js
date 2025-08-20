import { describe, test, expect } from 'vitest';
import almy from '../../almy';

describe('standalone dispatch', () => {
  test('works when destructured', () => {
    almy.create();
    const { dispatch } = almy;
    dispatch('k', 1);
    dispatch('k', { inner: 1 });
    expect(almy.state('k->inner')).toBe(1);
  });
});
