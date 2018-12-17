const $ = require('jquery');
const EventEmitter = require('./event-emitter');

class View {
  
  constructor(opts) {
    this.eventEmitter = new EventEmitter(this); 
    this.$el = document.querySelector(opts.el);
    this.template = opts.template;
    this.events = opts.events;
    this.listeners = opts.listeners;
    this.uri = opts.uri;
    this.boundFunctions = {};
    this.attachEvents();
    this.attachListeners();
  }
  
  render(data = null, el = null, template = null, append = false) {
    let $el = this.$el;
    if (el !== null) {
      $el = $(el);
    }
    let html;
    if (template === null) {
      html = this.template(data);
    } else {
      html = template(data);
    }
    if (append === true) {
      const existingHtml = $el.innerHTML;
      $el.innerHTML = existingHtml + html;
    } else {
      $el.innerHTML = html;
    }
  }
  
  attachEvents() {
    if (this.events) {
      this.events.forEach(item => {
        // document.addEventListener(item.e, )
        let selector = item.selector;
        if (item.selector === undefined) {
          selector = window;
        }
        $(document).on(item.type, selector, this[item.listener].bind(this));
      });
    }
  }
  
  attachListeners() {
    if (this.listeners) {
      this.listeners.forEach(item => {
        this.on(item.e, this[item.fn]);
      });
    }
  }
  
  static getData(e, attr, isInt = false) {
    const target = e.currentTarget;
    let data = target.dataset[attr];
    if (isInt === true) {
      data = parseInt(data);
    }
    return data;
  }
  
  async getRemote(authorization, uri = null) {
    if (uri !== null) {
      this.uri = uri;
    }
    const result = {'error': true};
    try {
      const response = await fetch(this.uri, {
        'headers': {
          'Authorization': authorization
        }
      });
      result.status = response.status;
      result.data = await response.json();
      if (result.status <= 400) {
        result.error = false;
      }
    } catch (err) {
      result.data = err;
    }
    return result;
  }
  
  on(type, listener, context = null) {
    if (context === null) {
      context = this;
    }
    let boundFunction = listener.bind(context);
    this.boundFunctions[listener] = boundFunction;
    this.eventEmitter.on(type, boundFunction);
  }
  
  off(type, fn) {
    if (this.boundFunctions[fn]) {
      this.eventEmitter.off(type, this.boundFunctions[fn]);
    } else {
      this.eventEmitter.off(type, fn);
    }
    
  }
  
  trigger(type, obj) {
    this.eventEmitter.trigger(type, obj);
  }
   
}

module.exports = View;