'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));

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
          dataset[key] = parseInt(value) ? parseInt(value) : value;
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
        }
      });
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

var View = function () {

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
  function View(params) {
    _classCallCheck(this, View);

    this.cParams = params;
    this.boundFunctions = {};
    this.addEvents(params.events);
    this.addRoute(params.route);
  }

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
  }, {
    key: 'on',
    value: function on(type, listener) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (context === null) {
        context = this;
      }
      var boundFunction = listener.bind(context);
      this.boundFunctions[listener] = boundFunction;
      this.eventEmitter.on(type, boundFunction);
    }
  }, {
    key: 'off',
    value: function off(type, listener) {
      if (this.boundFunctions[listener]) {
        this.eventEmitter.off(type, this.boundFunctions[listener]);
      } else {
        this.eventEmitter.off(type, listener);
      }
    }
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
  }, {
    key: 'documentListener',
    get: function get() {
      if (!this._documentListener) {
        this._documentListener = new DocumentListener();
      }
      return this._documentListener;
    }
  }, {
    key: 'router',
    get: function get() {
      if (!this._router) {
        this._router = new Router();
      }
      return this._router;
    }
  }, {
    key: '$selector',
    get: function get() {
      return new Query(this.cParams.selector);
    }
  }]);

  return View;
}();

exports.View = View;
exports.Router = Router;
exports.DocumentListener = DocumentListener;
exports.EventEmitter = EventEmitter;
exports.Query = Query;
