import {Router} from './router';
import {DocumentListener} from './document-listener';
import {EventEmitter} from './event-emitter';
import {Query} from './query';

export class View {
  
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
    this.router = new Router(); 
    if (params.el) {
      this.el = params.el;
      this.$el = new Query(this.el);
    }
    this.template = params.template;
    this.uri = params.uri;
    this.boundFunctions = {};
    this.attachEvents(params.events);
    this.attachRoute(params.route);
  }
  
  render(params) {
    let $el = null;
    let html = null;
    let data = {};
    if (params) {
      if (params.data) {
        data = params.data;
      }
      if (params.el) {
        $el = new Query(params.el);
      }
      if (params.template) {
        html = params.template(data);
      }
    }
    if ($el === null) {
      if (this.el) {
        $el = new Query(this.el);
      }
    }
    if (html === null) {
      if (this.template) {
        html = this.template(data);
      }
    }
    if (html !== null) {
      if (params && params.append === true) {
        $el.append(html);
      } else if (params && params.prepend === true) {
        $el.prepend(html);
      } else {
        $el.html = html;
      }
    }
  }
  
  attachEvents(events) {
    if (events) {
      events.forEach(item => {
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
  
  attachRoute(route) {
    if (route) {
      let listener;
      if (route.listener) {
        listener = this[route.listener].bind(this);
      } else if (this.show) {
        listener = this.show.bind(this);
      } else {
        throw new Error('a route requires either a listener property or show method on View');
      }
      this.router.add({
        'pathname': route.pathname,
        'name': route.name,
        'listener': listener
      });
    }
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
  
  static getDataAttr(e, attr, isInt = false) {
    const target = e.target;
    let data = target.dataset[attr];
    if (isInt === true) {
      data = parseInt(data);
    }
    return data;
  }
   
}

// export default class View;