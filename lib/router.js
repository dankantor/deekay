const EventEmitter = require('./event-emitter');

class Router {
  
  constructor() {
    if (!Router.instance) {
      Router.instance = this;
      this.pathname = null;
      this.eventEmitter = new EventEmitter();
      this.listeners = {};
      window.addEventListener('popstate', this.onPopstate.bind(this));
      document.addEventListener('click', this.onClick.bind(this));
    }
    return Router.instance;
  }
  
  add(params) {
    this.listeners[params.pathname] = {
      'name': params.name,
      'listener': params.listener
    };
  } 
  
  onPopstate(e) {
    this.execute();
  }
  
  onClick(e) {
    if (e.target.tagName === 'A') {
      return this.executeAnchorClick(e);
    }
  }
  
  executeAnchorClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const target = e.target.getAttribute('target');
    if (target !== '_blank' && target !== '_self') {
      this.navigate({
        'href': href
      });
      return false;
    }
    if (target === '_self') {
      location.href = href;
    }
  }
  
  navigate(params) {
    if (params.href !== this.pathname) {
      if (params.replace && params.replace === true) {
        history.replaceState(null, null, params.href);
        this.execute();
      } else {
        history.pushState(null, null, params.href);
        this.execute();
      }
    }
  }
  
  execute() {
    if (location.pathname !== this.pathname) {
      const keys = Object.keys(this.listeners);
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
        }
      });
    }
    this.pathname = location.pathname;
  }
  
  split(path) {
    return path.split('/').slice(1);
  }
  
  match(template, path) {
    var templateParts = this.split(template);
    var pathParts = this.split(path);
    if (templateParts.length !== pathParts.length) {
      return undefined;
    }
    var matches = {};
    for (var i = 0; i < templateParts.length; i++) {
      if (templateParts[i].length > 1 && templateParts[i][0] === ':') {
        var key = templateParts[i].substring(1);
        matches[key] = pathParts[i];
      } else if (templateParts[i] !== pathParts[i]) {
        return undefined;
      }
    }
    return matches;
  }
  
  
}

module.exports = Router;