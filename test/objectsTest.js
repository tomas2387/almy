/* global suite,setup,test */
suite('almy with objects', () => {
    const {
        assert
    } = require('chai')
    const {
        almy
    } = require(`${__dirname}/../../almy`)

    setup(() => {
        almy.newInstance()
    })

    test('WhenDispatchedWithAnObjectShouldSaveThatObjectInTheState', () => {
        almy.dispatch('video', {
            src: 'https://video.com/vid.mp4',
            volume: 45
        })

        assert.deepEqual({
                src: 'https://video.com/vid.mp4',
                volume: 45
            },
            almy.getState('video')
        )
    })

    test('WhenListenOverObjectShouldReceiveThatObjectFromTheState', (done) => {
        almy.dispatch('video', {
            src: 'https://video.com/vid.mp4',
            volume: 45
        })

        almy.subscribe('video', (state) => {
            assert.deepEqual({
                    src: 'https://video.com/vid.mp4',
                    volume: 45
                },
                state
            )
            done()
        })
    })

    test('WhenListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', (done) => {
        almy.dispatch('video', {
            src: 'https://video.com/vid.mp4',
            volume: 45
        })

        almy.subscribe('video->volume', (volume) => {
            assert.deepEqual(45, volume)
            done()
        })
    })

    test('WhenDispatchedPropertyOfObjectShouldReceiveThatPropertyFromTheState', (done) => {
        almy.dispatch('video->src', 'https://video.com/vid.mp4')

        almy.subscribe('video->src', (src) => {
            assert.deepEqual('https://video.com/vid.mp4', src)
            done()
        })
    })

    test('WhenDispatchedPropertyOfObjectShouldReceiveTheObjectFromTheState', (done) => {
        almy.dispatch('video->src', 'https://video.com/vid.mp4')

        almy.subscribe('video', (video) => {
            assert.deepEqual({src: 'https://video.com/vid.mp4'}, video)
            done()
        })
    })

    test('WhenDispatchedTWICETheSamePropertyValueOfObjectShouldOnlyReceiveOnce', (done) => {
        almy.subscribe('video', (video) => {
            assert.deepEqual({src: 'https://video.com/vid_1.mp4'}, video)
            //done call will fail if called twice
            done()
        })
        almy.dispatch('video->src', 'https://video.com/vid_1.mp4')
        almy.dispatch('video->src', 'https://video.com/vid_1.mp4')
    })
})
