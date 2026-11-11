# 🗄️ almy

[![Version](https://badgen.net/npm/v/almy)](https://www.npmjs.com/package/almy)
[![CI](https://github.com/tomas2387/almy/actions/workflows/test.yml/badge.svg)](https://github.com/tomas2387/almy/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/tomas2387/almy/branch/master/graph/badge.svg)](https://codecov.io/gh/tomas2387/almy)
[![Mutation testing](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Ftomas2387%2Falmy%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/tomas2387/almy/master)
[![Types](https://badgen.net/npm/types/almy)](https://www.npmjs.com/package/almy)
[![Bundle size](https://deno.bundlejs.com/badge?q=almy)](https://bundlejs.com/?q=almy)
[![License](https://badgen.net/npm/license/almy)](LICENSE)

The simplest store for managing the state in your application.  
Works in all environments and all browsers.

## Installation

```bash
npm install --save almy
```

## Methods

- **create()** – resets the store
- **dispatch(key: string, value: any)**
  _Dispatches some event that happened in a key value fashion._
  _Keys `__proto__`, `constructor`, and `prototype` are ignored to prevent_
  _prototype pollution._
- **subscribe(key: string, callback: Function): Function**
  _Subscribes to dispatched events. If someone has dispatched an event_
  _before, it calls the callback right away. Returns a function to_
  _unsubscribe the listener_
- **state(key:?string):any**
  _Returns the state of your application_

## Usage

Including it as a script tag

```html
<script src="./node_modules/almy/dist/almy.umd.js"></script>
<script>
  almy.dispatch('window_width', 524);
</script>
<script>
  almy.subscribe('window_width', function (newWidth) {
    //Do something with the new width
  });
</script>
```

Including it as a module

```html
<div id="content"></div>
<script type="module">
  import almy from './node_modules/almy/dist/almy.esm.js';

  almy.subscribe('user->name', (username) => {
    document.getElementById('content').textContent = username;
  });

  almy.dispatch('user', { id: 1, name: 'nick' });
</script>
```

Using in a node environment

```js
const almy = require('almy');
almy.subscribe('cpu_usage', function (newCpuUsage) {
  //Do something with the new cpu usage
});

//In some other place in your code
almy.dispatch('cpu_usage', 9000);
```

You can also dispatch objects:

```js
const almy = require('almy');
almy.subscribe('cpu', function (cpu) {
  console.log(cpu.temperature);
});

almy.dispatch('cpu->temperature', 65);
```

Or subscribe to objects properties and receive every change:

```js
almy.subscribe('cpu->ips', function (ips) {
  console.log('Intructions per second are ' + ips);
});

// ...

almy.dispatch('cpu', { ips: 1 });

// ...

almy.dispatch('cpu', { ips: 5 });

// This would ouput.
// "Intructions per second are 1"
// "Intructions per second are 5"
```

Resetting the store:

```js
const almy = require('almy');

almy.dispatch('count', 1);
almy.create();
almy.state('count'); // undefined
```

## TypeScript

Types are included. `state` and `subscribe` accept the type of the value:

```ts
import almy from 'almy';

almy.subscribe<number>('count', (count) => console.log(count + 1));

const count = almy.state<number>('count'); // number | undefined
```

## Notes

A flatten state is easier to reason and understand. However, Almy supports
subscribing to arbitrarily deep object paths:

```js
almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

almy.subscribe('user->favorites->televisions->4k', (value) => {
  console.log(value); // true
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
