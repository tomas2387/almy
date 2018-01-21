# staty
The simpliest store for managing the simpliest state in your application, created with TDD.    
Works in all environments and all browsers.

## Methods
- getState():Object    
_Returns the state of your application_
- dispatch(key: string, value: Mixed)    
_Dispatches some event that happened in a key value fashion_
- subscribe(key: string, callback: Function)   
_Subscribes to dispatched events. If someone has dispatched an event before, it calls the callback right away_

## Usage

Including it as a script tag    
```html
<script src="staty.js"></script>
<script>
  staty.dispatch('WindowWidth', 524)
</script>
<script>
  staty.subscribe('WindowWidth', function(newWidth) {
    //Do something with the new width
  })
</script>
```

Using in a node environment
```javascript
const staty = require('staty').Staty
staty.subscribe('CPU_Usage', function(newCpuUsage) {
    //Do something with the new cpu usage
})
```



