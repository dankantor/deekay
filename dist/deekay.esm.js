import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _typeof from 'babel-runtime/helpers/typeof';

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    if (!EventEmitter.instance) {
      EventEmitter.instance = this;
      this.listeners = {};
    }
    return EventEmitter.instance;
  }

  _createClass(EventEmitter, [{
    key: 'on',
    value: function on(type, listener) {
      if (!this.listeners[type]) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(listener);
    }
  }, {
    key: 'off',
    value: function off(type, fn) {
      var _this = this;

      if (typeof this.listeners[type] !== 'undefined') {
        this.listeners[type].forEach(function (listener, i) {
          if (fn) {
            if (listener === fn) {
              _this.listeners[type].splice(i, 1);
            }
          } else {
            _this.listeners[type] = [];
          }
        });
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, obj) {
      var _this2 = this;

      if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
        var array = this.listeners[type].slice();
        array.forEach(function (fn) {
          var e = _this2._createEvent(type);
          fn.apply(_this2.context, [e, obj]);
        });
      }
    }
  }, {
    key: '_createEvent',
    value: function _createEvent(type) {
      return {
        'type': type,
        'timestamp': new Date().getTime()
      };
    }
  }]);

  return EventEmitter;
}();

var Query = function () {
  function Query(selector) {
    _classCallCheck(this, Query);

    this.selector = selector;
    return this;
  }

  _createClass(Query, [{
    key: '_clearCachedNodeList',
    value: function _clearCachedNodeList() {
      var _this = this;

      setTimeout(function () {
        _this.cachedNodeList = undefined;
      }, 20);
    }
  }, {
    key: 'addClass',
    value: function addClass(className) {
      this.nodeList.forEach(function (node) {
        node.classList.add(className);
      });
      return this;
    }
  }, {
    key: 'removeClass',
    value: function removeClass(className) {
      this.nodeList.forEach(function (node) {
        node.classList.remove(className);
      });
      return this;
    }
  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      var _hasClass = false;
      this.nodeList.forEach(function (node) {
        if (node.classList.contains(className) === true) {
          _hasClass = true;
        }
      });
      return _hasClass;
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(className) {
      this.nodeList.forEach(function (node) {
        if (node.classList.contains(className) === true) {
          node.classList.remove(className);
        } else {
          node.classList.add(className);
        }
      });
      return this;
    }
  }, {
    key: 'stringToElement',
    value: function stringToElement(content) {
      var template = document.createElement('template');
      content = content.trim();
      template.innerHTML = content;
      return template.content;
    }
  }, {
    key: 'prepend',
    value: function prepend(content) {
      var html = this.stringToElement(content);
      this.nodeList.forEach(function (node) {
        node.prepend(html);
      });
      return this;
    }
  }, {
    key: 'append',
    value: function append(content) {
      var html = this.stringToElement(content);
      this.nodeList.forEach(function (node) {
        node.append(html);
      });
      return this;
    }
  }, {
    key: 'empty',
    value: function empty() {
      this.nodeList.forEach(function (node) {
        node.innerHTML = '';
      });
      return this;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.nodeList.forEach(function (node) {
        node.parentNode.removeChild(node);
      });
      return this;
    }
  }, {
    key: 'getAttr',
    value: function getAttr(name) {
      if (this.firstNode) {
        return this.firstNode.getAttribute(name);
      }
      return undefined;
    }
  }, {
    key: 'setAttr',
    value: function setAttr(name, value) {
      this.nodeList.forEach(function (node) {
        node.setAttribute(name, value);
      });
      return this;
    }
  }, {
    key: 'removeAttr',
    value: function removeAttr(name) {
      this.nodeList.forEach(function (node) {
        node.removeAttribute(name);
      });
      return this;
    }
  }, {
    key: 'on',
    value: function on(type, listener) {
      this.nodeList.forEach(function (node) {
        node.addEventListener(type, listener, false);
      });
      return this;
    }
  }, {
    key: 'off',
    value: function off(type, listener) {
      this.nodeList.forEach(function (node) {
        node.removeEventListener(type, listener);
      });
      return this;
    }
  }, {
    key: 'css',
    value: function css(name, value) {
      this.nodeList.forEach(function (node) {
        node.style[name] = value;
      });
      return this;
    }
  }, {
    key: 'nodeList',
    get: function get() {
      if (this.cachedNodeList) {
        return this.cachedNodeList;
      }
      if (typeof this.selector === 'string') {
        this.cachedNodeList = document.querySelectorAll(this.selector);
        this._clearCachedNodeList();
        return this.cachedNodeList;
      } else if (_typeof(this.selector) === 'object') {
        if (this.selector instanceof NodeList) {
          this.cachedNodeList = this.selector;
          this._clearCachedNodeList();
          return this.cachedNodeList;
        } else if (this.selector instanceof Node) {
          this.cachedNodeList = [this.selector];
          this._clearCachedNodeList();
          return this.cachedNodeList;
        }
      }
      return undefined;
    }
  }, {
    key: 'firstNode',
    get: function get() {
      if (this.nodeList) {
        if (this.nodeList instanceof NodeList) {
          return this.nodeList.item(0);
        } else if (this.nodeList instanceof Node) {
          return this.nodeList;
        } else if (this.nodeList instanceof Array) {
          return this.nodeList[0];
        }
      }
      return undefined;
    }
  }, {
    key: 'length',
    get: function get() {
      return this.nodeList.length;
    }
  }, {
    key: 'html',
    get: function get() {
      if (this.firstNode) {
        return this.firstNode.innerHTML;
      }
      return undefined;
    },
    set: function set(content) {
      this.nodeList.forEach(function (node) {
        node.innerHTML = content;
      });
      return this;
    }
  }, {
    key: 'text',
    get: function get() {
      if (this.firstNode) {
        return this.firstNode.innerText;
      }
      return undefined;
    },
    set: function set(content) {
      this.nodeList.forEach(function (node) {
        node.innerText = content;
      });
      return this;
    }
  }, {
    key: 'val',
    get: function get() {
      if (this.firstNode) {
        return this.firstNode.value.trim();
      }
      return undefined;
    },
    set: function set(content) {
      this.nodeList.forEach(function (node) {
        node.value = content;
      });
      return this;
    }
  }, {
    key: 'data',
    get: function get() {
      var _this2 = this;

      if (this.firstNode) {
        var dataset = null;
        var keys = Object.keys(this.firstNode.dataset);
        if (keys.length === 0) {
          return null;
        }
        dataset = {};
        keys.forEach(function (key) {
          var value = _this2.firstNode.dataset[key];
          dataset[key] = !isNaN(value) ? parseInt(value) : value;
        });
        return dataset;
      }
      return undefined;
    }
  }, {
    key: 'checked',
    get: function get() {
      if (this.firstNode) {
        return this.firstNode.checked;
      }
      return undefined;
    },
    set: function set(bool) {
      this.nodeList.forEach(function (node) {
        try {
          node.checked = bool;
        } catch (err) {}
      });
      return this;
    }
  }]);

  return Query;
}();

var DocumentListener = function () {

  /**
   * Create a DocumentListener. Only one DocumentListener instance will be created in 
   * an application (singleton)
   * @returns DocumentListener
   */
  function DocumentListener() {
    _classCallCheck(this, DocumentListener);

    if (!DocumentListener.instance) {
      DocumentListener.instance = this;
      this.events = {};
    }
    return DocumentListener.instance;
  }

  _createClass(DocumentListener, [{
    key: 'on',
    value: function on(type, selector, listener, context) {
      if (!this.events[type]) {
        this.events[type] = [];
        document.addEventListener(type, this.listener.bind(this));
      }
      var event = {
        'selector': selector,
        'listener': listener,
        'context': context
      };
      this.events[type].push(event);
    }
  }, {
    key: 'listener',
    value: function listener(e) {
      var _this = this;

      var triggered = false;
      this.events[e.type].forEach(function (event) {
        if (triggered === false) {
          var query = document.querySelectorAll(event.selector);
          query.forEach(function (item) {
            if (triggered === false) {
              triggered = _this._trigger(e, event, item, e.target, event.listener);
            }
          });
        }
      });
    }
  }, {
    key: '_trigger',
    value: function _trigger(e, event, target, node, listener) {
      if (target === node) {
        listener.apply(event.context, [e, new Query(target)]);
        return true;
      }
      if (node.parentNode) {
        return this._trigger(e, event, target, node.parentNode, listener);
      }
      return false;
    }
  }]);

  return DocumentListener;
}();

var Router = function () {

  /**
   * Create a Router
   * @returns a singleton router
   */
  function Router() {
    _classCallCheck(this, Router);

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
   * @param {Router~Route} - A Route object
   */


  _createClass(Router, [{
    key: 'add',
    value: function add(params) {
      this.listeners[params.pathname] = {
        'name': params.name,
        'listener': params.listener
      };
    }
  }, {
    key: 'onPopstate',
    value: function onPopstate(e) {
      this.execute();
    }
  }, {
    key: 'onClick',
    value: function onClick(e, target) {
      e.preventDefault();
      return this.executeAnchorClick(target);
    }
  }, {
    key: 'executeAnchorClick',
    value: function executeAnchorClick(target) {
      var href = target.getAttr('href');
      var targetAttr = target.getAttr('target');
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

  }, {
    key: 'navigate',
    value: function navigate(params) {
      if (params.replace && params.replace === true) {
        history.replaceState(null, null, params.href);
        this.execute();
      } else {
        history.pushState(null, null, params.href);
        this.execute();
      }
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this = this;

      var keys = Object.keys(this.listeners);
      var foundMatch = false;
      keys.forEach(function (key) {
        var matches = _this.match(key, location.pathname);
        if (matches) {
          var route = _this.listeners[key];
          route.listener.apply(null, [matches]);
          _this.eventEmitter.trigger('router:execute', {
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
  }, {
    key: 'split',
    value: function split(path) {
      return path.split('/').slice(1);
    }
  }, {
    key: 'match',
    value: function match(template, path) {
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
  }]);

  return Router;
}();



/**
 * @typedef Router~Route
 * @type {object}
 * @property {string} pathname - The url pathname that will trigger this route (eg. /search/:query).
 * @property {string} name -  A name for this route.
 * @property {function} listener - The callback function for when this route is triggered.
 */

var View = function () {

  /**
   * Create a View
   * @param {Object} params
   * @param {string} params.selector - The element that a template will be inserted in to (eg. #some-id).
   * @param {string} params.template - A Handlebars template used for rendering.
   * @param {Event[]} params.events - Events will be passed to [addEvents]{@link View#addEvents}.
   * @param {Router~Route} params.route - Route will be passed to [addRoute]{@link View#addRoute}.
   * @param {string} params.uri - The default uri to use when [fetch]{@link View.fetch} is called.
   * @param {string[]} params.binded - Strings will be passed to [addBinded]{@link View#addBinded}.
   */
  function View(params) {
    _classCallCheck(this, View);

    this.cParams = params;
    this.binded = {};
    this.addEvents(params.events);
    this.addRoute(params.route);
    this.addBinded(params.binded);
  }

  /**
   * Get eventEmitter
   * @method
   * @return {EventEmitter} singleton EventEmitter.
   */


  _createClass(View, [{
    key: 'getValue',
    value: function getValue(key, list) {
      var value = null;
      var found = list.find(function (item) {
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
     * @description Takes the passed in data object, runs it through the Handlebars template and inserts it 
     * into the selector element. Passing params is optional and will default to the params passed to the 
     * view instance constructor. 
     * @param {Object=} params
     * @param {string} params.selector - The selector that the template will be inserted in to. If none is
     *  passed in, will default to the selector passed to the Class constructor.
     * @param {string} params.template - A Handlebars template. If none is passed in, will default to the
     *  template passed to the Class constructor.
     * @param {Object} params.data - An object that will be passed to the Handlebars template.
     * @param {boolean} params.append [false] - If true, will append the template to the selector element as 
     *  opposed to replacing the entire innerHTML.
     * @param {boolean} params.prepend [false] - If true, will prepend the template to the selector element as 
     *  opposed to replacing the entire innerHTML. 
     */

  }, {
    key: 'render',
    value: function render(params) {
      var selector = this.getValue('selector', [params, this.cParams]);
      var template = this.getValue('template', [params, this.cParams]);
      var data = {};
      if (params && params.data) {
        data = params.data;
      }
      if (selector !== null && template !== null) {
        var html = template(data);
        var $selector = new Query(selector);
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
     * @param {Event[]} events
     */

  }, {
    key: 'addEvents',
    value: function addEvents(events) {
      var _this = this;

      if (events) {
        events.forEach(function (item) {
          if (item.selector) {
            var context = _this;
            if (item.context) {
              context = item.context;
            }
            _this.documentListener.on(item.type, item.selector, _this[item.listener], context);
          } else {
            _this.on(item.type, _this[item.listener], item.context);
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

  }, {
    key: 'addRoute',
    value: function addRoute(route) {
      if (route) {
        var listener = void 0;
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

  }, {
    key: 'addBinded',
    value: function addBinded(binded) {
      var _this2 = this;

      if (binded) {
        binded.forEach(function (item) {
          var listener = _this2[item].bind(_this2);
          _this2.binded[item] = listener;
        });
      }
    }

    /**
     * @method
     * @description Wrapper for native fetch. The response is automatically parsed as JSON.
     * @async
     * @param {Object} params - All params passed in will be passed to native fetch.
     * @param {string} params.uri - the remote URI.
     * @return {FetchResult}
     */

  }, {
    key: 'fetch',
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(params) {
        var uri, result, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                uri = this.getValue('uri', [params, this.cParams]);
                result = { 'error': true };
                _context.prev = 2;
                _context.next = 5;
                return fetch(uri, params);

              case 5:
                response = _context.sent;

                result.status = response.status;
                _context.next = 9;
                return response.json();

              case 9:
                result.data = _context.sent;

                if (result.status <= 400) {
                  result.error = false;
                }
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](2);

                result.data = _context.t0;

              case 16:
                return _context.abrupt('return', result);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 13]]);
      }));

      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }())

    /**
     * @method
     * @description convenience method passed to [EventEmitter.on]{@link EventEmitter#on}. 
     * @param {string} type - the name of the event to listen on.
     * @param {function} listener - The callback function for when this event is triggered.
     * @param {object} [context=this] - The value of 'this' provided to the listener. 
     */

  }, {
    key: 'on',
    value: function on(type, listener) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (context === null) {
        context = this;
      }
      var boundFunction = listener.bind(context);
      this.binded[listener] = boundFunction;
      this.eventEmitter.on(type, boundFunction);
    }

    /**
     * @method
     * @description convenience method passed to [EventEmitter.off]{@link EventEmitter#off}. 
     * @param {string} type - the name of the event to stop listening to.
     * @param {function} listener - The callback function for this event.
     */

  }, {
    key: 'off',
    value: function off(type, listener) {
      if (this.binded[listener]) {
        this.eventEmitter.off(type, this.binded[listener]);
      } else {
        this.eventEmitter.off(type, listener);
      }
    }

    /**
     * @method
     * @description convenience method passed to [EventEmitter.trigger]{@link EventEmitter#trigger}. 
     * @param {string} type - the name of the event to trigger.
     * @param {object} data - Arbitrary data to pass with the event.
     */

  }, {
    key: 'trigger',
    value: function trigger(type, data) {
      this.eventEmitter.trigger(type, data);
    }
  }, {
    key: 'show',
    value: function show(params) {
      var selector = this.getValue('selector', [params, this.cParams]);
      if (selector !== null) {
        var showClass = this.getValue('showClass', [params, { 'showClass': 'show' }]);
        var hideClass = this.getValue('hideClass', [params, { 'hideClass': 'hide' }]);
        new Query(selector).removeClass(hideClass).addClass(showClass);
      }
      return this;
    }
  }, {
    key: 'hide',
    value: function hide(params) {
      var selector = this.getValue('selector', [params, this.cParams]);
      if (selector !== null) {
        var showClass = this.getValue('showClass', [params, { 'showClass': 'show' }]);
        var hideClass = this.getValue('hideClass', [params, { 'hideClass': 'hide' }]);
        new Query(selector).removeClass(showClass).addClass(hideClass);
      }
      return this;
    }
  }, {
    key: 'conditionalShowHide',
    value: function conditionalShowHide(conditional, params) {
      if (conditional === true) {
        return this.show(params);
      } else {
        return this.hide(params);
      }
      return this;
    }
  }, {
    key: 'eventEmitter',
    get: function get() {
      if (!this._eventEmitter) {
        this._eventEmitter = new EventEmitter();
      }
      return this._eventEmitter;
    }

    /**
     * Get documentListener
     * @method
     * @return {DocumentListener} singleton DocumentListener.
     */

  }, {
    key: 'documentListener',
    get: function get() {
      if (!this._documentListener) {
        this._documentListener = new DocumentListener();
      }
      return this._documentListener;
    }

    /**
     * Get router
     * @method
     * @return {Router} singleton Router.
     */

  }, {
    key: 'router',
    get: function get() {
      if (!this._router) {
        this._router = new Router();
      }
      return this._router;
    }

    /**
     * Get $selector
     * @method
     * @return {Query} Returns a Query instance of the selector passed in to the view constructor.
     */

  }, {
    key: '$selector',
    get: function get() {
      return new Query(this.cParams.selector);
    }
  }]);

  return View;
}();



/**
 * @typedef Event
 * @type {object}
 * @property {string} type - DOM event (eg. 'click') or custom event ('myevent').
 * @property {string} selector - If it's a DOM event, the selector to listen on.
 * @property {string} listener - The callback function for when this event is triggered. Param is passed in 
 *  as a string and turned in to a method on the View instance (eg. 'show' -> this.show).
 * @property {Object} context - The value of 'this' provided to the listener.
 */

/**
* @typedef FetchResult
* @type {object}
* @property {object} data - The JSON data returned from the remote call.
* @property {boolean} error -  If the response status > 400, this is set to true.
* @property {number} status -  The http response code
*/

export { View, Router, DocumentListener, EventEmitter, Query };
