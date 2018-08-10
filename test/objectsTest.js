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

  test('WhenBeforeListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', (done) => {
    almy.subscribe('video->volume', (volume) => {
      assert.deepEqual(45, volume)
      done()
    })

    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45
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
      // done call will fail if called twice
      done()
    })
    almy.dispatch('video->src', 'https://video.com/vid_1.mp4')
    almy.dispatch('video->src', 'https://video.com/vid_1.mp4')
  })

  test('WhenDispatchedPropertyWithObjectSetShouldReceiveProperty', (done) => {
    let times = 0
    almy.subscribe('image', (image) => {
      switch (times) {
        case 0:
          assert.deepEqual(image, {href: 'https://video.com/1.mp4'})
          break
        case 1:
          assert.deepEqual(image, {href: 'https://image.com/2.jpg'})
          done()
          break
      }
      times++
    })
    almy.dispatch('image', {href: 'https://video.com/1.mp4'})
    almy.dispatch('image->href', 'https://image.com/2.jpg')
  })

  test('WhenReverseDispatchedPropertyWithObjectSetShouldReceiveProperty', (done) => {
    let times = 0
    almy.subscribe('video', (video) => {
      switch (times) {
        case 0:
          assert.deepEqual({src: 'https://video.com/vid_2.mp4'}, video)
          break
        case 1:
          assert.deepEqual({src: 'https://video.com/vid_1.mp4'}, video)
          done()
          break
      }
      times++
    })
    almy.dispatch('video->src', 'https://video.com/vid_2.mp4')
    almy.dispatch('video', {src: 'https://video.com/vid_1.mp4'})
  })

  test('WhenDispatchedAnObjectWithNotOwnedPropertiesShouldNotDispatchThoseProperties', (done) => {
    almy.subscribe('list->addToList', function () {
      done(new Error('Not expected to be called'))
    })
    almy.subscribe('list->ownedProperty', function (value) {
      setTimeout(() => {
        assert.equal(value, 'mine')
        done()
      }, 0)
    })

    const List = function () {}
    List.prototype.addToList = function (elem, value) { this[elem] = value }

    const instance = new List()
    instance.addToList('hi', 'hello')
    instance.ownedProperty = 'mine'

    almy.dispatch('list', instance)
  })
})
