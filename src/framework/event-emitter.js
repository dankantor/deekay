const $ = require('jquery');

class EventEmitter {
  
  constructor() {
    if (!EventEmitter.instance) {
      EventEmitter.instance = this;
    }
    return EventEmitter.instance;
  }
  
  trigger(name, data) {
    $(this).trigger(name, data);
  }

}

module.exports = EventEmitter;