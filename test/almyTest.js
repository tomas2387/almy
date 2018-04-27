'use strict'

/* global suite,setup,test */

const { assert } = require('chai')
const almy = require(`${__dirname}/../almy`).almy

suite('almy', () => {
  setup(() => {
    almy.newInstance()
    checkStateIsClean()
  })

  test('getStateWhenCalledShouldReturnTheState', () => {
    const state = almy.getState()
    assert.deepEqual({}, state)
  })

  const invalidKeysValues = [
    '',
    0,
    null,
    true,
    {}
  ]
  invalidKeysValues.forEach((invalidKey, index) => {
    test(`[#${index}]dispatchWhenCalledWithInvalidKeyShouldNotMutateTheState[key(${invalidKey})]`, () => {
      almy.dispatch(invalidKey, 56)
      const beforeState = almy.getState()
      assert.deepEqual({}, beforeState, 'dispatch with empty key is triggering state changes')
    })
  })

  test('dispatchWhenCalledShouldTriggerStateChanges', () => {
    almy.dispatch('VideoVolume', 56)
    const beforeState = almy.getState()
    assert.deepEqual({VideoVolume: 56}, beforeState, 'dipatch does not trigger state changes')
  })

  test('dispatchWhenCalledTwiceShouldTriggerBothStateChanges', () => {
    almy.dispatch('VideoVolume', 56)
    almy.dispatch('VideoVolume', 100)
    const beforeState = almy.getState()
    assert.deepEqual({VideoVolume: 100}, beforeState, 'dipatch does not trigger state changes')
  })

  test('subscribeWhenCalledShouldBeCalledWhenStateChanges', (done) => {
    almy.subscribe('VideoVolume', checkValueAndCall(done, 56))
    almy.dispatch('VideoVolume', 56)
  })

  test('subscribeWhenCalledWithStateSetShouldBeCalledBackInmmeditely', (done) => {
    almy.dispatch('VideoVolume', 56)
    almy.subscribe('VideoVolume', checkValueAndCall(done, 56))
  })

  test('subscribeWhenCalledMultipleTimesShouldCalledAllListeners', (done) => {
    const firstListener = new Promise((resolve) =>
            almy.subscribe('VideoVolume', checkValueAndCall(resolve, 56)))
    const secondListener = new Promise((resolve) =>
            almy.subscribe('VideoVolume', checkValueAndCall(resolve, 56)))
    const thirdListener = new Promise((resolve) =>
            almy.subscribe('VideoVolume', checkValueAndCall(resolve, 56)))

    almy.dispatch('VideoVolume', 56)

    Promise.all([
      firstListener,
      secondListener,
      thirdListener
    ])
        .then(() => done())
        .catch((e) => done(e))
  })

  function checkStateIsClean () {
    const afterState = almy.getState()
    assert.deepEqual({}, afterState, '--guard: State was not clean after running the test')
  }

  function checkValueAndCall (done, shouldBe = 56) {
    return (newVolume) => {
      try {
        assert.equal(newVolume, shouldBe)
        done()
      } catch (e) {
        done(e)
      }
    }
  }
})
