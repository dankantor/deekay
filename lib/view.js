import {Router} from './router.js';
import {DocumentListener} from './document-listener.js';
import {EventBus} from './event-bus.js';
import {Query} from './query.js';

class View {
  
  /**
   * Create a View
   * @param {Object} params
   * @param {string} params.selector - Parent element of view. Also the default element when a selector 
   *  is not passed in to methods. Must be a valid CSS selector string.
   * @param {function} params.template - A template function used for rendering.
   * @param {View~Event[]} params.events - Events will be passed to [addEvents]{@link View#addEvents}.
   * @param {Router~Route} params.route - Route will be passed to [addRoute]{@link View#addRoute}.
   * @param {string} params.uri - The default uri to use when [fetch]{@link View.fetch} is called.
   * @param {string[]} params.binded - Strings will be passed to [addBinded]{@link View#addBinded}.
   */
  constructor(params) {
    this.cParams = params;  
    this.binded = {};
    this.addEvents(params.events);
    this.addRoute(params.route);
    this.addBinded(params.binded);
  }
  
  /**
   * Get [EventBus]{@link EventBus} singleton.
   * @member
   */
  get eventBus() {
    if (!this._eventBus) {
      this._eventBus = new EventBus(); 
    }
    return this._eventBus;
  }
  
  /**
   * Get [DocumentListener]{@link DocumentListener} singleton.
   * @member
   */
  get documentListener() {
    if (!this._documentListener) {
      this._documentListener = new DocumentListener(); 
    }
    return this._documentListener;
  }
  
  /**
   * Get [Router]{@link Router} singleton.
   * @member
   */
  get router() {
    if (!this._router) {
      this._router = new Router(); 
    }
    return this._router;
  }
  
  /**
   * Get a [Query]{@link Query} instance of the selector passed in to the view constructor.
   * @member
   */
  get $selector() {
    return new Query(this.cParams.selector);
  }
  
  getValue(key, list) {
    let value = null;
    let found = list.find(item => {
      if (item && item[key]) {
        return true;
      }
    });
    if (found !== undefined) {
      value = found[key];
    }
    return value;
  }
  
  /**
   * @method
   * @description Takes the passed in data object, runs it through the template function and inserts it 
   * into the selector element. Passing params is optional and will default to the params passed to the 
   * view instance constructor. 
   * @param {Object=} params
   * @param {string} params.selector - The selector that the resulting HTML will be inserted in to.
   *  If none is passed in, will default to the selector passed to the Class constructor.
   * @param {function} params.template - A template function. If none is passed in, will default to the
   *  template passed to the Class constructor.
   * @param {Object} params.data - An object that will be passed to the template function.
   * @param {boolean} params.append [false] - If true, will append the HTML to the selector element as 
   *  opposed to replacing the entire innerHTML.
   * @param {boolean} params.prepend [false] - If true, will prepend the HTML to the selector element as 
   *  opposed to replacing the entire innerHTML. 
   */
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
  
  /**
   * @method
   * @description Events will be passed to [DocumentListener.on]{@link DocumentListener#on} for DOM events
   *  and [View.on]{@link View#on} for custom events. If [Event.context]{@link Event#context} is 
   *  not set, it will default to the View instance.
   * @param {View~Event[]} events
   */
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
  
  /**
   * @method
   * @description Route will be passed to [Router.add]{@link Router#add}. Route.listener should be
   * passed in as a string and will be changed to a method on the View instance. 
   * (eg. 'show' -> this.show).
   * @param {Router~Route} route
   */
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
  
  /**
   * @method
   * @description Convenience method to help bind view methods to this (eg. 'foo' -> this.foo.bind(this)).
   * Binded methods can be accessed using this.binded.foo.  
   * @param {string[]} binded
   */
  addBinded(binded) {
    if (binded) {
      binded.forEach(item => {
        let listener = this[item].bind(this);
        this.binded[item] = listener;
      });
    }
  }
  
  /**
   * @method
   * @description Wrapper for native fetch. The response is automatically parsed as JSON.
   * @async
   * @param {Object} params - All params passed in will be passed to native fetch.
   * @param {string} params.uri - the remote URI.
   * @return {View~FetchResult}
   */
  async fetch(params) {
    const uri = this.getValue('uri', [params, this.cParams]);
    const result = {'error': true};
    try {
      const response = await fetch(uri, params);
      result.status = response.status;
      try {
        result.data = await response.json();
      } catch (err) {
        try {
          result.data = await response.text();
        } catch (err) {}
      }
      if (result.status <= 400) {
        result.error = false;
      }
    } catch (err) {
      result.data = err;
    }
    return result;
  }
  
  /**
   * @method
   * @description convenience method passed to [EventBus.on]{@link EventBus#on}. 
   * @param {string} type - the name of the event to listen on.
   * @param {function} listener - The callback function for when this event is triggered.
   * @param {object} [context=this] - The value of 'this' provided to the listener. 
   */
  on(type, listener, context = null) {
    if (context === null) {
      context = this;
    }
    let boundFunction = listener.bind(context);
    this.binded[listener] = boundFunction;
    this.eventBus.on(type, boundFunction);
  }
  
  /**
   * @method
   * @description convenience method passed to [EventBus.off]{@link EventBus#off}. 
   * @param {string} type - the name of the event to stop listening to.
   * @param {function} listener - The callback function for this event.
   */
  off(type, listener) {
    if (this.binded[listener]) {
      this.eventBus.off(type, this.binded[listener]);
    } else {
      this.eventBus.off(type, listener);
    }
    
  }
  
  /**
   * @method
   * @description convenience method passed to [EventBus.trigger]{@link EventBus#trigger}. 
   * @param {string} type - the name of the event to trigger.
   * @param {object} data - Arbitrary data to pass with the event.
   */
  trigger(type, data) {
    this.eventBus.trigger(type, data);
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

export {View}

/**
 * @typedef View~Event
 * @type {object}
 * @property {string} type - DOM event (eg. 'click') or custom event ('myevent').
 * @property {string} selector - If it's a DOM event, the selector to listen on.
 * @property {string} listener - The callback function for when this event is triggered. Param is passed in 
 *  as a string and turned in to a method on the View instance (eg. 'show' -> this.show).
 * @property {Object} context - The value of 'this' provided to the listener.
 */
 
 /**
 * @typedef View~FetchResult
 * @type {object}
 * @property {object} data - The JSON data returned from the remote call.
 * @property {boolean} error -  If the response status > 400, this is set to true.
 * @property {number} status -  The http response code
 */