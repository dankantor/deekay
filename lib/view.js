import {Router} from './router';
import {DocumentListener} from './document-listener';
import {EventEmitter} from './event-emitter';
import {Query} from './query';

export class View {
  
  /**
   * Create a new view
   *
   * Params:
   *   selector: the element that a template will be inserted in to
   *   template: The handlebars template used for rendering
   *   events: Any listeners to attach in the format 
   *     {'type': 'click', 'selector': '#hello', 'listener': 'onClick'}. If a 'selector' is not included, the 
   *     listener is considered global and can be subscribed to using 'on' below
   *   uri: the remote uri that is used with fetch
   *   route: the browser url that will show this view
   *   
   */
  constructor(params) {
    this.cParams = params;  
    this.boundFunctions = {};
    this.addEvents(params.events);
    this.addRoute(params.route);
  }
  
  get eventEmitter() {
    if (!this._eventEmitter) {
      this._eventEmitter = new EventEmitter(); 
    }
    return this._eventEmitter;
  }
  
  get documentListener() {
    if (!this._documentListener) {
      this._documentListener = new DocumentListener(); 
    }
    return this._documentListener;
  }
  
  get router() {
    if (!this._router) {
      this._router = new Router(); 
    }
    return this._router;
  }
  
  get $selector() {
    return new Query(this.cParams.selector);
  }
  
  getValue(key, list) {
    let value = null;
    let found = list.find(item => {
      if (item[key]) {
        return true;
      }
    });
    if (found !== undefined) {
      value = found[key];
    }
    return value;
  }
  
  render(params) {
    const selector = this.getValue('selector', [params, this.cParams]);
    const template = this.getValue('template', [params, this.cParams]);
    let data = {};
    if (params && params.data) {
      data = params.data;
    }
    if (selector !== null && template !== null) {
      const html = template(data);
      const $selector = new Query(selector);
      if (params && params.append === true) {
        $selector.append(html);
      } else if (params && params.prepend === true) {
        $selector.prepend(html);
      } else {
        $selector.html = html;
      }
    }
  }
  
  addEvents(events) {
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
  
  addRoute(route) {
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
  
  async fetch(params) {
    const uri = this.getValue('uri', [params, this.cParams]);
    const result = {'error': true};
    try {
      const response = await fetch(uri, params);
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
  
  show(params) {
    const selector = this.getValue('selector', [params, this.cParams]);
    if (selector !== null) {
      const showClass = this.getValue('showClass', [params, {'showClass': 'show'}]);
      const hideClass = this.getValue('hideClass', [params, {'hideClass': 'hide'}]);
      new Query(selector).removeClass(hideClass).addClass(showClass);
    }
    return this;
  }
  
  hide(params) {
    const selector = this.getValue('selector', [params, this.cParams]);
    if (selector !== null) {
      const showClass = this.getValue('showClass', [params, {'showClass': 'show'}]);
      const hideClass = this.getValue('hideClass', [params, {'hideClass': 'hide'}]);
      new Query(selector).removeClass(showClass).addClass(hideClass);
    }
    return this;
  }
  
  conditionalShowHide(conditional, params) {
    if (conditional === true) {
      return this.show(params);
    } else {
      return this.hide(params);
    }
    return this;
  }
  
   
}