# staty
The simpliest store for managing the simpliest state in your application, created with TDD.

## Methods
- getState():Object    
_Returns the state of your application_
- dispatch(key: string, value: Mixed)    
_Dispatches some event that happened in a key value fashion_
- subscribe(key: string, callback: Function)   
_Subscribes to dispatched events. If someone has dispatched an event before, it calls the callback right away_

