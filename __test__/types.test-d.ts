import { describe, test, expectTypeOf } from 'vitest';
import almy from '../almy';

describe('almy types', () => {
  test('state returns the whole state or the value of a key', () => {
    expectTypeOf(almy.state()).toEqualTypeOf<Record<string, unknown>>();
    expectTypeOf(almy.state('a')).toEqualTypeOf<unknown>();
    expectTypeOf(almy.state<number>('a')).toEqualTypeOf<number | undefined>();
  });

  test('dispatch accepts any value and returns nothing', () => {
    expectTypeOf(almy.dispatch('a', { b: 1 })).toEqualTypeOf<void>();
    // @ts-expect-error keys must be strings
    almy.dispatch(1, 2);
  });

  test('subscribe returns an unsubscribe function', () => {
    const unsubscribe = almy.subscribe<number>('a', (value) => {
      expectTypeOf(value).toEqualTypeOf<number>();
    });
    expectTypeOf(unsubscribe).toEqualTypeOf<() => void>();
    // @ts-expect-error the callback is required
    almy.subscribe('a');
  });

  test('create returns nothing', () => {
    expectTypeOf(almy.create()).toEqualTypeOf<void>();
  });
});
