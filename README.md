# 🗄️ almy

[![Version](https://badgen.net/npm/v/almy)](https://www.npmjs.com/package/almy)
[![CI](https://github.com/tomas2387/almy/actions/workflows/test.yml/badge.svg)](https://github.com/tomas2387/almy/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/tomas2387/almy/branch/master/graph/badge.svg)](https://codecov.io/gh/tomas2387/almy)
![install size](https://packagephobia.com/badge?p=almy@3.0.3)

The simplest store for managing the state in your application.  
Works in all environments and all browsers.

## Why do I need a centralized state management

Managing the information rendered is difficult, mostly when our apps grow large
and the state is scattered across many components and the interactions between
them without control.

To solve this, the current state-of-the-art solution is to use a globalized state
where we can centralize and have more control over the information we have to render.
Almy is a simple library that uses a pub/sub façade along with a centralized
state management which makes the side effects of changing information easy
to control and eliminates the risk of getting race conditions in our applications.

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

## Notes

A flatten state is easier to reason and understand. However, Almy supports
subscribing to arbitrarily deep object paths:

```js
almy.dispatch('user', { favorites: { televisions: { '4k': true } } });

almy.subscribe('user->favorites->televisions->4k', (value) => {
  console.log(value); // true
});
```

# Codebase overview

## General structure

```
almy/
├── almy.js              # core source module
├── dist/                # minified builds for different module systems
├── __test__/unit/       # Vitest unit tests
├── rollup.config.js     # build configuration
├── package.json         # npm metadata and scripts
└── .github/workflows/   # CI workflows (CodeQL, npm publish, etc.)
```

## Core module (almy.js)

Holds a singleton‑style store with two private objects: state (current values)
and listeners (arrays of callbacks per key).

Exports a single almy object with four methods:

- create() – resets state and listeners to start fresh.
- state(key?) – returns the entire state or the value of a specific key.
- dispatch(key, value, doNotOptimize, doNotChainDispatch) – updates state and
  notifies listeners.
- Handles nested keys using -> and dispatches individual properties when an
  object is supplied, skipping inherited properties and repeated values.
- subscribe(key, callback) – registers a listener and immediately invokes it
  if the key already exists.

## Build and tooling

Built with Rollup (rollup.config.js) using the terser plugin to produce UMD, CJS,
and ESM bundles in dist/.

package.json scripts include npm run build (Rollup), npm test (Vitest with coverage),
and Prettier formatting hooks.

## Testing

Unit tests in **test**/unit/ cover primitive values and object/array dispatch behavior,
including immediate callbacks for existing state and one‑level nested subscriptions.

## Important things to know

Keys use a `key->property` convention for nested paths.

dispatch avoids redundant notifications by comparing against the current state.

subscribe returns an unsubscribe function so listeners can be removed without
resetting the store.

The repository exposes the built files (dist/\*), README.md, and LICENSE
when published to npm (files field in package.json).

## Other state management libraries

- Vuex: https://github.com/vuejs/vuex
- Redux: https://github.com/reduxjs/redux
- Flux: https://github.com/facebook/flux

## References

Worlds: Controlling the Scope of Side Effects
http://www.vpri.org/pdf/tr2011001_final_worlds.pdf
