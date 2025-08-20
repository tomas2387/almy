import { describe, test, expect, beforeEach } from 'vitest';
import almy from '../../almy';

describe('almy with objects', () => {
  beforeEach(() => {
    almy.create();
  });

  test('WhenDispatchedWithAnObjectShouldSaveThatObjectInTheState', () => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45,
    });

    expect({
      src: 'https://video.com/vid.mp4',
      volume: 45,
    }).toEqual(almy.state('video'));
  });

  test('WhenListenOverObjectShouldReceiveThatObjectFromTheState', async () => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45,
    });

    await new Promise((resolve) => {
      almy.subscribe('video', (state) => {
        expect({
          src: 'https://video.com/vid.mp4',
          volume: 45,
        }).toEqual(state);
        resolve();
      });
    });
  });

  test('WhenListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', async () => {
    almy.dispatch('video', {
      src: 'https://video.com/vid.mp4',
      volume: 45,
    });

    await new Promise((resolve) => {
      almy.subscribe('video->volume', (volume) => {
        expect(45).toEqual(volume);
        resolve();
      });
    });
  });

  test('WhenBeforeListenOnPropertyOfObjectShouldReceiveThatPropertyFromTheState', async () => {
    await new Promise((resolve) => {
      almy.subscribe('video->volume', (volume) => {
        expect(45).toEqual(volume);
        resolve();
      });

      almy.dispatch('video', {
        src: 'https://video.com/vid.mp4',
        volume: 45,
      });
    });
  });

  test('WhenDispatchedPropertyOfObjectShouldReceiveThatPropertyFromTheState', async () => {
    almy.dispatch('video->src', 'https://video.com/vid.mp4');

    await new Promise((resolve) => {
      almy.subscribe('video->src', (src) => {
        expect('https://video.com/vid.mp4').toEqual(src);
        resolve();
      });
    });
  });

  test('WhenDispatchedPropertyOfObjectShouldReceiveTheObjectFromTheState', async () => {
    almy.dispatch('video->src', 'https://video.com/vid.mp4');

    await new Promise((resolve) => {
      almy.subscribe('video', (video) => {
        expect({ src: 'https://video.com/vid.mp4' }).toEqual(video);
        resolve();
      });
    });
  });

  test('WhenDispatchedTWICETheSamePropertyValueOfObjectShouldOnlyReceiveOnce', async () => {
    await new Promise((resolve, reject) => {
      let calls = 0;
      almy.subscribe('video', (video) => {
        calls++;
        try {
          expect({ src: 'https://video.com/vid_1.mp4' }).toEqual(video);
        } catch (e) {
          reject(e);
        }
      });
      almy.dispatch('video->src', 'https://video.com/vid_1.mp4');
      almy.dispatch('video->src', 'https://video.com/vid_1.mp4');
      setTimeout(() => {
        if (calls === 1) resolve();
        else reject(new Error('listener called more than once'));
      }, 0);
    });
  });

  test('WhenDispatchedPropertyWithObjectSetShouldReceiveProperty', async () => {
    await new Promise((resolve, reject) => {
      let times = 0;
      almy.subscribe('image', (image) => {
        try {
          switch (times) {
            case 0:
              expect(image).toEqual({ href: 'https://video.com/1.mp4' });
              break;
            case 1:
              expect(image).toEqual({ href: 'https://image.com/2.jpg' });
              resolve();
              break;
            default:
              reject(new Error('listener called too many times'));
          }
        } catch (e) {
          reject(e);
        }
        times++;
      });
      almy.dispatch('image', { href: 'https://video.com/1.mp4' });
      almy.dispatch('image->href', 'https://image.com/2.jpg');
    });
  });

  test('WhenReverseDispatchedPropertyWithObjectSetShouldReceiveProperty', async () => {
    await new Promise((resolve, reject) => {
      let times = 0;
      almy.subscribe('video', (video) => {
        try {
          switch (times) {
            case 0:
              expect({ src: 'https://video.com/vid_2.mp4' }).toEqual(video);
              break;
            case 1:
              expect({ src: 'https://video.com/vid_1.mp4' }).toEqual(video);
              resolve();
              break;
            default:
              reject(new Error('listener called too many times'));
          }
        } catch (e) {
          reject(e);
        }
        times++;
      });
      almy.dispatch('video->src', 'https://video.com/vid_2.mp4');
      almy.dispatch('video', { src: 'https://video.com/vid_1.mp4' });
    });
  });

  test('WhenDispatchedAnObjectWithNotOwnedPropertiesShouldNotDispatchThoseProperties', async () => {
    await new Promise((resolve, reject) => {
      almy.subscribe('list->addToList', function () {
        reject(new Error('Not expected to be called'));
      });
      almy.subscribe('list->ownedProperty', function (value) {
        setTimeout(() => {
          try {
            expect(value).toEqual('mine');
            resolve();
          } catch (e) {
            reject(e);
          }
        }, 0);
      });

      const List = function () {};
      List.prototype.addToList = function (elem, value) {
        this[elem] = value;
      };

      const instance = new List();
      instance.addToList('hi', 'hello');
      instance.ownedProperty = 'mine';

      almy.dispatch('list', instance);
    });
  });

  test('WhenDispatchedArraysShouldReceiveThem', async () => {
    await new Promise((resolve) => {
      almy.subscribe('video', (video) => {
        expect(video.src).toEqual([
          'https://video.com/vid_1.mp4',
          'https://video.com/vid_2.mp4',
          'https://video.com/vid_3.mp4',
        ]);
        resolve();
      });
      almy.dispatch('video', {
        src: [
          'https://video.com/vid_1.mp4',
          'https://video.com/vid_2.mp4',
          'https://video.com/vid_3.mp4',
        ],
      });
    });
  });

  test('WhenSubscribedToArrayPositionShouldReceiveThatPosition', async () => {
    await new Promise((resolve) => {
      almy.subscribe('video_urls->2', (url) => {
        expect(url).toEqual('https://video.com/vid_3.mp4');
        resolve();
      });
      almy.dispatch('video_urls', [
        'https://video.com/vid_1.mp4',
        'https://video.com/vid_2.mp4',
        'https://video.com/vid_3.mp4',
      ]);
    });
  });

  test('WhenSubscribedToObjectPropertyShouldReceiveThatProperty', async () => {
    almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

    await new Promise((resolve) => {
      almy.subscribe('user->favorites', (favorites) => {
        expect(favorites.televisions['4k']).toEqual(true);
        resolve();
      });
    });
  });

  test('WhenSubscribedDeepInObjectShouldReceiveThatValue', async () => {
    almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

    await new Promise((resolve) => {
      almy.subscribe('user->favorites->televisions->4k', (value) => {
        expect(value).toEqual(true);
        resolve();
      });
    });
  });

  test('WhenSubscribedToNestedObjectShouldReceiveThatObject', async () => {
    almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

    await new Promise((resolve) => {
      almy.subscribe('user->favorites->televisions', (televisions) => {
        expect(televisions['4k']).toEqual(true);
        resolve();
      });
    });
  });
});
