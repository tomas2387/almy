import { describe, test, expect } from 'vitest';
import { createRequire } from 'node:module';
import esm from '../../dist/almy.esm.js';

const require = createRequire(import.meta.url);

describe('published bundles', () => {
  test.each([
    ['require (package main, UMD)', () => require('../..')],
    ['ESM', () => esm],
  ])('%s exposes a working store', (_, load) => {
    const almy = load();
    almy.create();
    let received;
    almy.subscribe('user->name', (name) => (received = name));
    almy.dispatch('user', { name: 'nick' });
    expect(received).toBe('nick');
    expect(almy.state('user')).toEqual({ name: 'nick' });
  });
});
