# almy
[![Version](https://badgen.net/npm/v/almy)](https://www.npmjs.com/package/almy) 
[![Build Status](https://travis-ci.org/tomas2387/almy.svg?branch=master)](https://travis-ci.org/tomas2387/almy) 
[![Coverage Status](https://coveralls.io/repos/github/tomas2387/almy/badge.svg?branch=master)](https://coveralls.io/github/tomas2387/almy?branch=master)
[![dependencies Status](https://david-dm.org/tomas2387/almy/status.svg)](https://david-dm.org/tomas2387/almy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)    

The simpliest store for managing the state in your application.    
Works in all environments and all browsers.

## Why do I need a centralized state management?

Managing the information rendered is difficult, mostly when our apps grow large and the state is scattered across many components and the interactions between them without control. 

To solve this, the current state of the art proposal is to use globalized state solutions where we can centralize and have more control over the information we have to render. Almy is a simple library that uses a pub/sub façade along with a centralized state management which makes the the side effects of changing information easy to control and eliminates the risk of getting race conditions in our applications.


## Installation
```
npm install --save almy
```


## Methods
- **getState([key:string]):Object**    
_Returns the state of your application_
- **dispatch(key: string, value: Mixed)**    
_Dispatches some event that happened in a key value fashion_
- **subscribe(key: string, callback: Function)**   
_Subscribes to dispatched events. If someone has dispatched an event before, it calls the callback right away_

## Usage

Including it as a script tag    
```html
<script src="almy.js"></script>
<script>
  almy.dispatch('WindowWidth', 524)
</script>
<script>
  almy.subscribe('WindowWidth', function(newWidth) {
    //Do something with the new width
  })
</script>
```

Using in a node environment
```javascript
const almy = require('almy').almy
almy.subscribe('CPU_Usage', function(newCpuUsage) {
    //Do something with the new cpu usage
})

//In some other place in your code
almy.dispatch('CPU_Usage', 9000)
```

You can dispatch objects too
```javascript
const almy = require('almy').almy
almy.subscribe('CPU', function(cpu) {
    console.log(cpu.temperature)
})

almy.dispatch('CPU->temperature', 65)
```

## Other state management libraries

  - Vuex: https://github.com/vuejs/vuex
  - Redux: https://github.com/reduxjs/redux
  - Flux: https://github.com/facebook/flux

## References

Worlds: Controlling the Scope of Side Effects
http://www.vpri.org/pdf/tr2011001_final_worlds.pdf