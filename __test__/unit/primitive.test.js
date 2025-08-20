import { describe, test, expect, beforeEach, vi } from 'vitest';
import almy from '../../almy';

describe('almy with primitives', () => {
  beforeEach(() => {
    almy.create();
  });

  test('getStateWhenCalledShouldReturnTheState', () => {
    const state = almy.state();
    expect({}).toEqual(state);
  });

  const invalidKeysValues = ['', 0, null, true, {}];
  invalidKeysValues.forEach((invalidKey, index) => {
    test(`[#${index}]dispatchWhenCalledWithInvalidKeyShouldNotMutateTheState[key(${invalidKey})]`, () => {
      almy.dispatch(invalidKey, 56);
      const beforeState = almy.state();
      expect({}).toEqual(beforeState);
    });
  });

  invalidKeysValues.forEach((invalidKey, index) => {
    test(`[#${index}]subscribeWhenCalledWithInvalidKeyShouldReturnUndefined[key(${invalidKey})]`, () => {
      const result = almy.subscribe(invalidKey, vi.fn());
      expect(result).toBeUndefined();
    });
  });

  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  dangerousKeys.forEach((unsafe) => {
    test(`dispatchWhenCalledWithUnsafeKeyShouldNotMutateTheState[key(${unsafe})]`, () => {
      almy.dispatch(unsafe, { polluted: true });
      expect(Object.prototype.hasOwnProperty.call(almy.state(), unsafe)).toBe(
        false,
      );
      expect({}.polluted).toBeUndefined();
    });

    test(`dispatchWhenCalledWithNestedUnsafeKeyShouldNotMutateTheState[key(${unsafe})]`, () => {
      almy.dispatch('safe->' + unsafe, { polluted: true });
      expect(almy.state('safe')).toBeUndefined();
      expect({}.polluted).toBeUndefined();
    });
  });

  test('dispatchWhenCalledShouldTriggerStateChanges', () => {
    almy.dispatch('VideoVolume', 56);
    const beforeState = almy.state();
    expect({ VideoVolume: 56 }).toEqual(beforeState);
  });

  test('dispatchWhenCalledTwiceShouldTriggerBothStateChanges', () => {
    almy.dispatch('VideoVolume', 56);
    almy.dispatch('VideoVolume', 100);
    const beforeState = almy.state();
    expect({ VideoVolume: 100 }).toEqual(beforeState);
  });

  test('dispatchWhenCalledWithUndefinedShouldTriggerStateChanges', () => {
    almy.dispatch('VideoVolume', undefined);
    const beforeState = almy.state();
    expect({ VideoVolume: undefined }).toEqual(beforeState);
  });

  test('subscribeWhenCalledShouldBeCalledWhenStateChangesToUndefined', async () => {
    await new Promise((resolve, reject) => {
      almy.subscribe('VideoVolume', (value) => {
        try {
          expect(value).toBeUndefined();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      almy.dispatch('VideoVolume', undefined);
    });
  });

  test('subscribeWhenCalledShouldBeCalledWhenStateChanges', async () => {
    await new Promise((resolve, reject) => {
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 56));
      almy.dispatch('VideoVolume', 56);
    });
  });

  test('subscribeWhenCalledWithStateSetShouldBeCalledBackImmediately', async () => {
    await new Promise((resolve, reject) => {
      almy.dispatch('VideoVolume', 56);
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 56));
    });
  });

  test('subscribeWhenCalledWithStateSetToZeroShouldBeCalledBackImmediately', async () => {
    await new Promise((resolve, reject) => {
      almy.dispatch('VideoVolume', 0);
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 0));
    });
  });

  test('subscribeWhenCalledMultipleTimesShouldCallAllListeners', async () => {
    const firstListener = new Promise((resolve, reject) =>
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 56)),
    );
    const secondListener = new Promise((resolve, reject) =>
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 56)),
    );
    const thirdListener = new Promise((resolve, reject) =>
      almy.subscribe('VideoVolume', checkValueAndCall(resolve, reject, 56)),
    );

    almy.dispatch('VideoVolume', 56);

    await Promise.all([firstListener, secondListener, thirdListener]);
  });

  test('unsubscribeShouldRemoveListener', () => {
    const callback = vi.fn();
    const unsubscribe = almy.subscribe('VideoVolume', callback);
    almy.dispatch('VideoVolume', 56);
    expect(callback).toHaveBeenCalledTimes(1);
    unsubscribe();
    // calling again should be a no-op
    unsubscribe();
    almy.dispatch('VideoVolume', 100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  function checkValueAndCall(resolve, reject, shouldBe = 56) {
    return (newVolume) => {
      try {
        expect(newVolume).toEqual(shouldBe);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
  }
});
