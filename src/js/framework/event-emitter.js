class EventEmitter {
  
  constructor() {
    if (!EventEmitter.instance) {
      EventEmitter.instance = this;
      this.listeners = {};
    }
    return EventEmitter.instance;
  }
  
  on(type, listener) {
    if(!this.listeners[type]){
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }
  
  off(type, fn) {
    console.log(type, fn);
    if (typeof this.listeners[type] !== 'undefined') {
      console.log(0);
      this.listeners[type].forEach((listener, i) => {
        console.log('listener', listener);
        if (listener === fn) {
          console.log(1);
          this.listeners[type].splice(i, 1);
        }    
      });
    }
  }
  
  emit(type, obj) {
    if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
  		const array = this.listeners[type].slice();
  		array.forEach(fn => {
    		const e = this._createEvent(type);
    		fn.apply(e, [e, obj]);
  		});
    }
  }
  
  _createEvent(type) {
    return {
      'type': type,
      'timestamp': new Date().getTime()
    };
  }
  
}

module.exports = EventEmitter;