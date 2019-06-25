describe('almy with objects', () => {
  const { almy } = require('../..');

  beforeEach(() => {
    almy.create();
  });

  test('WhenDispatchedWithAnObjectShouldSaveThatObjectInTheState', () => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45
    });

    expect({
      src: 'https://video.com/vid.mp4',
      volume: 45
    }).toEqual(almy.state('video'));
  });

  test('WhenListenOverObjectShouldReceiveThatObjectFromTheState', done => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45
    });

    almy.subscribe('video', state => {
      expect({
        src: 'https://video.com/vid.mp4',
        volume: 45
      }).toEqual(state);
      done();
    });
  });

  test('WhenListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', done => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45
    });

    almy.subscribe('video->volume', volume => {
      expect(45).toEqual(volume);
      done();
    });
  });

  test('WhenBeforeListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', done => {
    almy.subscribe('video->volume', volume => {
      expect(45).toEqual(volume);
      done();
    });

    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45
    });
  });

  test('WhenDispatchedPropertyOfObjectShouldReceiveThatPropertyFromTheState', done => {
    almy.dispatch('video->src', 'https://video.com/vid.mp4');

    almy.subscribe('video->src', src => {
      expect('https://video.com/vid.mp4').toEqual(src);
      done();
    });
  });

  test('WhenDispatchedPropertyOfObjectShouldReceiveTheObjectFromTheState', done => {
    almy.dispatch('video->src', 'https://video.com/vid.mp4');

    almy.subscribe('video', video => {
      expect({ src: 'https://video.com/vid.mp4' }).toEqual(video);
      done();
    });
  });

  test('WhenDispatchedTWICETheSamePropertyValueOfObjectShouldOnlyReceiveOnce', done => {
    almy.subscribe('video', video => {
      expect({ src: 'https://video.com/vid_1.mp4' }).toEqual(video);
      // done call will fail if called twice
      done();
    });
    almy.dispatch('video->src', 'https://video.com/vid_1.mp4');
    almy.dispatch('video->src', 'https://video.com/vid_1.mp4');
  });

  test('WhenDispatchedPropertyWithObjectSetShouldReceiveProperty', done => {
    let times = 0;
    almy.subscribe('image', image => {
      switch (times) {
        case 0:
          expect(image).toEqual({ href: 'https://video.com/1.mp4' });
          break;
        case 1:
          expect(image).toEqual({ href: 'https://image.com/2.jpg' });
          done();
          break;
      }
      times++;
    });
    almy.dispatch('image', { href: 'https://video.com/1.mp4' });
    almy.dispatch('image->href', 'https://image.com/2.jpg');
  });

  test('WhenReverseDispatchedPropertyWithObjectSetShouldReceiveProperty', done => {
    let times = 0;
    almy.subscribe('video', video => {
      switch (times) {
        case 0:
          expect({ src: 'https://video.com/vid_2.mp4' }).toEqual(video);
          break;
        case 1:
          expect({ src: 'https://video.com/vid_1.mp4' }).toEqual(video);
          done();
          break;
      }
      times++;
    });
    almy.dispatch('video->src', 'https://video.com/vid_2.mp4');
    almy.dispatch('video', { src: 'https://video.com/vid_1.mp4' });
  });

  test('WhenDispatchedAnObjectWithNotOwnedPropertiesShouldNotDispatchThoseProperties', done => {
    almy.subscribe('list->addToList', function() {
      done(new Error('Not expected to be called'));
    });
    almy.subscribe('list->ownedProperty', function(value) {
      setTimeout(() => {
        expect(value).toEqual('mine');
        done();
      }, 0);
    });

    const List = function() {};
    List.prototype.addToList = function(elem, value) {
      this[elem] = value;
    };

    const instance = new List();
    instance.addToList('hi', 'hello');
    instance.ownedProperty = 'mine';

    almy.dispatch('list', instance);
  });

  test('WhenDispatchedArraysShouldReceiveThem', done => {
    almy.subscribe('video', video => {
      expect(video.src).toEqual([
        'https://video.com/vid_1.mp4',
        'https://video.com/vid_2.mp4',
        'https://video.com/vid_3.mp4'
      ]);
      done();
    });
    almy.dispatch('video', {
      src: [
        'https://video.com/vid_1.mp4',
        'https://video.com/vid_2.mp4',
        'https://video.com/vid_3.mp4'
      ]
    });
  });

  test('WhenSubscribedToArrayPositionShouldReceiveThatPosition', done => {
    almy.subscribe('video_urls->2', url => {
      expect(url).toEqual('https://video.com/vid_3.mp4');
      done();
    });
    almy.dispatch('video_urls', [
      'https://video.com/vid_1.mp4',
      'https://video.com/vid_2.mp4',
      'https://video.com/vid_3.mp4'
    ]);
  });

  test('WhenSubscribedToArrayPositionShouldReceiveThatPosition', done => {
    almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

    almy.subscribe('user->favorites', favorites => {
      expect(favorites.televisions['4k']).toEqual(true);
      done();
    });
  });


  // TODO: fix deep subscription for objects
  // test('WhenSubscribedToArrayPositionShouldReceiveThatPosition', done => {
  //   almy.dispatch('user', { favorites: { televisions: { '4k': true } } });
  //
  //   almy.subscribe('user->favorites->televisions', televisions => {
  //     expect(televisions['4k']).toEqual(true);
  //     done();
  //   });
  // });
});
