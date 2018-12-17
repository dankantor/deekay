class EventEmitter {
  
  constructor(context) {
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
    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type].forEach((listener, i) => {
        if (fn) {
          if (listener === fn) {
            this.listeners[type].splice(i, 1);
          } 
        } else {
          this.listeners[type] = [];
        }    
      });
    }
  }
  
  trigger(type, obj) {
    if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
  		const array = this.listeners[type].slice();
  		array.forEach(fn => {
    		const e = this._createEvent(type);
    		fn.apply(this.context, [e, obj]);
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