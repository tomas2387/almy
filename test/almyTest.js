'use strict'

const { assert } = require('chai')
const almy = require(`${__dirname}/../almy`).almy

suite('almy', () => {
    setup(() => almy.newInstance())

    test('getStateWhenCalledShouldReturnTheState', () => {
        const state = almy.getState()
        assert.deepEqual({}, state)
    })

    test('dispatchWhenCalledShouldTriggerStateChanges', () => {
        checkStateIsClean()
        almy.dispatch('VideoVolume', 56)
        const beforeState = almy.getState()
        assert.deepEqual({VideoVolume:56}, beforeState, 'dipatch does not trigger state changes')
    })

    test('dispatchWhenCalledTwiceShouldTriggerBothStateChanges', () => {
        checkStateIsClean()
        almy.dispatch('VideoVolume', 56)
        almy.dispatch('VideoVolume', 100)
        const beforeState = almy.getState()
        assert.deepEqual({VideoVolume:100}, beforeState, 'dipatch does not trigger state changes')
    })
    
    test('subscribeWhenCalledShouldBeCalledWhenStateChanges', (done) => {
        checkStateIsClean()
        almy.subscribe('VideoVolume', checkValueAndCall(done, 56))
        almy.dispatch('VideoVolume', 56)
    })

    test('subscribeWhenCalledWithStateSetShouldBeCalledBackInmmeditely', (done) => {
        checkStateIsClean()
        almy.dispatch('VideoVolume', 56)
        almy.subscribe('VideoVolume', checkValueAndCall(done, 56))
    })

    test('subscribeWhenCalledMultipleTimesShouldCalledAllListeners', (done) => {
        checkStateIsClean()
        const firstListener = new Promise((ok, ko) => 
            almy.subscribe('VideoVolume', checkValueAndCall(ok, 56)))
        const secondListener = new Promise((ok, ko) => 
            almy.subscribe('VideoVolume', checkValueAndCall(ok, 56)))
        const thirdListener = new Promise((ok, ko) => 
            almy.subscribe('VideoVolume', checkValueAndCall(ok, 56)))

        almy.dispatch('VideoVolume', 56)

        Promise.all([
            firstListener,
            secondListener,
            thirdListener
        ])
        .then(() => done())
        .catch((e) => done(e))
    })


    function checkStateIsClean() {
        const afterState = almy.getState()
        assert.deepEqual({}, afterState, '--guard: State was not clean after running the test')
    }

    function checkValueAndCall(done, shouldBe = 56) {
        return (newVolume) => {
            try {
                assert.equal(newVolume, shouldBe)
                done()
            } catch(e) {
                done(e)
            }
        }
    }
})