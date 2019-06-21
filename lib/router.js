import {EventBus} from './event-bus.js';
import {DocumentListener} from './document-listener.js';

class Router {
  
  /**
   * @summary Create a Router. Only one Router instance will be created in 
   * an application.
   * @param {Object} params
   * @param {string} params.pushState - if set to false, router will not listen for popstate event and
   *  will not override anchor clicks. Default is true.
   * @description Listens to browser location changes and fires when a known route is matched.
   * @returns {Router} singleton
   * @fires Router#router:nomatch
   * @fires Router#router:execute
   */
  constructor(params) {
    if (!Router.instance) {
      Router.instance = this;
      this.pathname = null;
      this.eventBus = new EventBus();
      this.listeners = {};
      
      if (params !== undefined) {
        if (params.pushState !== undefined) {
          this.pushState = params.pushState;
        }
      }
      if (this.pushState === true) {
        window.addEventListener('popstate', this.onPopstate.bind(this));
        this.documentListener = new DocumentListener();
        this.documentListener.on('click', 'a', this.onClick.bind(this), this);
      }
    }
    return Router.instance;
  }
  
  /**
   * @method
   * @param {Router~Route} - A Route object
   */
  add(params) {
    this.listeners[params.pathname] = {
      'name': params.name,
      'listener': params.listener
    };
  } 
  
  onPopstate(e) {
    this.execute();
  }
  
  onClick(e, target) {
    return this.executeAnchorClick(e, target);
  }
  
  executeAnchorClick(e, target) {
    const href = target.getAttr('href');
    const targetAttr = target.getAttr('target');
    if (targetAttr !== '_blank' && targetAttr !== '_self') {
      e.preventDefault();
      if (href !== this.pathname) {
        this.navigate({
          'href': href
        });
      }
      return false;
    }
    return true;
  }
  
  /**
   * @method
   * @param {Object} params
   * @param {string} params.href - The url to navigate to.
   * @param {boolean} params.replace [false] - If true will use history.replaceState instead of 
   *  history.pushState.
   */
  navigate(params) {
    if (params.replace && params.replace === true) {
      history.replaceState(null, null, params.href);
      this.execute();
    } else {
      history.pushState(null, null, params.href);
      this.execute();
    }
  }
  
  execute() {
    const keys = Object.keys(this.listeners);
    let foundMatch = false;
    keys.forEach(key => {
      const matches = this.match(key, location.pathname);
      if (matches) {
        const route = this.listeners[key];
        route.listener.apply(null, [matches]);
        this.eventBus.trigger('router:execute', {
          'pathname': location.pathname,
          'name': route.name,
          'matches': matches
        });
        foundMatch = true;
      }
    });
    if (foundMatch === false) {
      this.eventBus.trigger('router:nomatch', {
        'pathname': location.pathname
      });
    }
    this.pathname = location.pathname;
  }
  
  split(path) {
    return path.split('/').slice(1);
  }
  
  match(template, path) {
    let templateParts = this.split(template);
    let pathParts = this.split(path);
    if (templateParts.length !== pathParts.length) {
      return undefined;
    }
    let matches = {};
    for (let i = 0; i < templateParts.length; i++) {
      if (templateParts[i].length > 1 && templateParts[i][0] === ':') {
        let key = templateParts[i].substring(1);
        matches[key] = pathParts[i];
      } else if (templateParts[i] !== pathParts[i]) {
        return undefined;
      }
    }
    return matches;
  }
  
  get pushState() {
    if (this._pushState === undefined) {
      return true;
    } else {
      return this._pushState;
    }
  }
  
  set pushState(bool) {
    this._pushState = bool;
  }
  
}

export {Router}

/**
 * @typedef Router~Route
 * @type {object}
 * @property {string} pathname - The url pathname that will trigger this route (eg. /search/:query).
 * @property {string} name -  A name for this route.
 * @property {function} listener - The callback function for when this route is triggered.
 */
 
 /**
 * @event Router#router:execute
 * @description Fired when a matching route is found.
 * @type {object}
 * @property {string} pathname - The matched pathname.
 * @property {string} name -  A matched name.
 * @property {function[]} - Array of matched listeners.
 */
 
 /**
 * @event Router#router:nomatch
 * @description Fired when no matching route is found.
 * @type {object}
 * @property {string} pathname - The pathname that did not have a match.
 */
 