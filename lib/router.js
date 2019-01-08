import {EventEmitter} from './event-emitter';
import {DocumentListener} from './document-listener';

class Router {
  
  /**
   * Create a Router
   * @returns a singleton router
   */
  constructor() {
    if (!Router.instance) {
      Router.instance = this;
      this.pathname = null;
      this.eventEmitter = new EventEmitter();
      this.listeners = {};
      window.addEventListener('popstate', this.onPopstate.bind(this));
      this.documentListener = new DocumentListener();
      this.documentListener.on('click', 'a', this.onClick.bind(this), this);
    }
    return Router.instance;
  }
  
  /**
   * @method
   * @param {Router~Route}
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
    e.preventDefault();
    return this.executeAnchorClick(target);
  }
  
  executeAnchorClick(target) {
    const href = target.getAttr('href');
    const targetAttr = target.getAttr('target');
    if (targetAttr !== '_blank' && targetAttr !== '_self') {
      if (href !== this.pathname) {
        this.navigate({
          'href': href
        });
      }
      return false;
    }
    if (targetAttr === '_self') {
      location.href = href;
    }
  }
  
  /**
   * @method
   * @param {Object} params
   * @param {string} params.href - the url to navigate to
   * @param {boolean} params.replace [false] - if true will use history.replaceState instead of 
   *  history.pushState
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
        this.eventEmitter.trigger('router:execute', {
          'pathname': location.pathname,
          'name': route.name,
          'matches': matches
        });
        foundMatch = true;
      }
    });
    if (foundMatch === false) {
      this.eventEmitter.trigger('router:nomatch', {
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
  
}

export {Router}

/**
 * @typedef Router~Route
 * @type {object}
 * @property {string} pathname - The url pathname that will trigger this route (eg. /search/:query).
 * @property {string} name -  A name for this route.
 * @property {string} listener - The callback function for when this route is triggered. Param is passed in 
 *  as a string and turned in to a method on the View instance (eg. 'show' -> this.show).
 */