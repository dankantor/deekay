class EventBus {
  
  /**
   * @summary Create an EventBus. Only one EventBus instance will be created in 
   * an application.
   * @description EventBus is used as a global event bus for custom events.
   * @returns {EventBus} singleton
   */
  constructor() {
    if (!EventBus.instance) {
      EventBus.instance = this;
      this.listeners = {};
    }
    return EventBus.instance;
  }
  
  /**
   * @method
   * @description Add an event listener. 
   * @param {string} type - The name of the event to listen on.
   * @param {function} listener - The callback function for when this event is triggered.
   */
  on(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }
  
  /**
   * @method
   * @description Remove an event listener. 
   * @param {string} type - The name of the event to remove.
   * @param {function} [listener] - The callback function for when this event is triggered. If no listener
   * is provided, all listeners of the type will be removed.
   */
  off(type, listener) {
    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type].forEach((l, i) => {
        if (listener) {
          if (l === listener) {
            this.listeners[type].splice(i, 1);
          } 
        } else {
          this.listeners[type] = [];
        }    
      });
    }
  }
  
  /**
   * @method
   * @description Trigger a custom event. 
   * @param {string} type - The name of the event to trigger.
   * @param {object} [data] - Arbitrary data to be triggered with this event.
   */
  trigger(type, data) {
    if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
  		const array = this.listeners[type].slice();
  		array.forEach(listener => {
    		const e = this._createEvent(type);
    		listener.apply(this.context, [e, data]);
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

export {EventBus}