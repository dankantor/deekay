const EventEmitter = require('./event-emitter');
const DocumentListener = require('./document-listener');

class View {
  
  /**
   * Create a new view
   *
   * Params:
   *   el: the parent element that a template will be inserted in to
   *   template: The handlebars template used for rendering
   *   events: Any listeners to attach in the format 
   *     {'type': 'click', 'selector': '#hello', 'listener': 'onClick'}. If a 'selector' is not included, the 
   *     listener is considered global and can be subscribed to using 'on' below
   *   uri: the remote uri that is used with fetch
   */
  constructor(params) {
    this.eventEmitter = new EventEmitter();
    this.documentListener = new DocumentListener();  
    this.el = params.el;
    this.template = params.template;
    this.events = params.events;
    this.uri = params.uri;
    this.boundFunctions = {};
    this.attachEvents();
  }
  
  render(params) {
    let $el = null;
    if (params.el) {
      $el = document.querySelector(params.el);
    } else if (this.el) {
      $el = document.querySelector(this.el);
    } else {
      throw new Error('render requires el passed param or this.el to be set');
    }
    let html;
    if (params.template) {
      html = params.template(params.data);
    } else if (this.template) {
      html = this.template(params.data);
    } else {
      throw new Error('render requires template passed param or this.template to be set');
    }
    if (params.append === true) {
      const existingHtml = $el.innerHTML;
      $el.innerHTML = existingHtml + html;
    } else {
      $el.innerHTML = html;
    }
  }
  
  attachEvents() {
    if (this.events) {
      this.events.forEach(item => {
        if (item.selector) {
          let context = this;
          if (item.context) {
            context = item.context;
          }
          this.documentListener.on(item.type, item.selector, this[item.listener], context);
        } else {
          this.on(item.type, this[item.listener], item.context);
        }
        
      });
    }
  }
  
  static getDataAttr(e, attr, isInt = false) {
    const target = e.target;
    let data = target.dataset[attr];
    if (isInt === true) {
      data = parseInt(data);
    }
    return data;
  }
  
  async fetch(options) {
    if (!options.uri) {
      options.uri = this.uri;
    }
    const result = {'error': true};
    try {
      const response = await fetch(options.uri, options);
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