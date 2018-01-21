'use strict'

const { assert } = require('chai')
const Staty = require(`${__dirname}/../staty`).Staty;

suite('Staty', () => {

    let sut = Staty;

    setup(() => {
        sut.newInstance();
    })

    test('getStateWhenCalledShouldReturnTheState', () => {
        const state = sut.getState();
        assert.deepEqual({}, state);
    })

    test('dispatchWhenCalledShouldTriggerStateChanges', () => {
        checkStateIsClean();

        sut.dispatch('VideoVolume', 56);

        const beforeState = sut.getState();
        assert.deepEqual({VideoVolume:56}, beforeState, 'dipatch does not trigger state changes');
    })

    test('dispatchWhenCalledTwiceShouldTriggerBothStateChanges', () => {
        checkStateIsClean();

        sut.dispatch('VideoVolume', 56);
        sut.dispatch('VideoVolume', 100);

        const beforeState = sut.getState();
        assert.deepEqual({VideoVolume:100}, beforeState, 'dipatch does not trigger state changes');
    })
    
    test('subscribeWhenCalledShouldBeCalledWhenStateChanges', (done) => {
        checkStateIsClean();

        sut.subscribe('VideoVolume', checkValueAndCall(done, 56))
        sut.dispatch('VideoVolume', 56);
    })

    test('subscribeWhenCalledWithStateSetShouldBeCalledBackInmmeditely', (done) => {
        checkStateIsClean();

        sut.dispatch('VideoVolume', 56);

        sut.subscribe('VideoVolume', checkValueAndCall(done, 56))
    })


    test('subscribeWhenCalledMultipleTimesShouldCalledAllListeners', (done) => {
        checkStateIsClean();

        const firstListener = new Promise((ok, ko) => 
            sut.subscribe('VideoVolume', checkValueAndCall(ok, 56)))
        const secondListener = new Promise((ok, ko) => 
            sut.subscribe('VideoVolume', checkValueAndCall(ok, 56)))
        const thirdListener = new Promise((ok, ko) => 
            sut.subscribe('VideoVolume', checkValueAndCall(ok, 56)))

        sut.dispatch('VideoVolume', 56);

        Promise.all([
            firstListener,
            secondListener,
            thirdListener
        ]).then(function() {
            done();
        }).catch(function(e) {
            done(e);
        })
    })


    function checkStateIsClean() {
        const afterState = sut.getState();
        assert.deepEqual({}, afterState, '--guard: State was not clean after running the test');
    }

    function checkValueAndCall(done, shouldBe = 56) {
        return (newVolume) => {
            try {
                assert.equal(newVolume, shouldBe);
                done();
            } catch(e) {
                done(e);
            }
        }
    }
})