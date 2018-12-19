'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));

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

var Router = function () {
  function Router() {
    _classCallCheck(this, Router);

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
    value: function onClick(e) {
      if (e.target.tagName === 'A') {
        return this.executeAnchorClick(e);
      }
    }
  }, {
    key: 'executeAnchorClick',
    value: function executeAnchorClick(e) {
      e.preventDefault();
      var href = e.target.getAttribute('href');
      var target = e.target.getAttribute('target');
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
  }, {
    key: 'navigate',
    value: function navigate(params) {
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
  }, {
    key: 'execute',
    value: function execute() {
      var _this = this;

      if (location.pathname !== this.pathname) {
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
      this.events[e.type].forEach(function (event) {
        var query = document.querySelectorAll(event.selector);
        query.forEach(function (item) {
          if (item === e.target) {
            event.listener.apply(event.context, [e]);
          }
        });
      });
    }
  }]);

  return DocumentListener;
}();

var Query = function () {
  function Query(selector) {
    _classCallCheck(this, Query);

    this.nodeList = document.querySelectorAll(selector);
    return this;
  }

  _createClass(Query, [{
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
    key: 'prepend',
    value: function prepend(content) {
      this.nodeList.forEach(function (node) {
        var html = node.innerHTML;
        node.innerHTML = content + html;
      });
      return this;
    }
  }, {
    key: 'append',
    value: function append(content) {
      this.nodeList.forEach(function (node) {
        var html = node.innerHTML;
        node.innerHTML = html + content;
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
    key: 'html',
    get: function get() {
      if (this.nodeList && this.nodeList.length > 0) {
        return this.nodeList[0].innerHTML;
      } else {
        return '';
      }
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
      if (this.nodeList && this.nodeList.length > 0) {
        return this.nodeList[0].innerText;
      } else {
        return '';
      }
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
      if (this.nodeList && this.nodeList.length > 0) {
        return this.nodeList[0].value;
      } else {
        return '';
      }
    },
    set: function set(content) {
      this.nodeList.forEach(function (node) {
        node.value = content;
      });
      return this;
    }
  }]);

  return Query;
}();

var View = function () {

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
  function View(params) {
    _classCallCheck(this, View);

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

  _createClass(View, [{
    key: 'render',
    value: function render(params) {
      var $el = null;
      var html = null;
      var data = {};
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
  }, {
    key: 'attachEvents',
    value: function attachEvents(events) {
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
    key: 'attachRoute',
    value: function attachRoute(route) {
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
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(options) {
        var result, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!options.uri) {
                  options.uri = this.uri;
                }
                result = { 'error': true };
                _context.prev = 2;
                _context.next = 5;
                return fetch(options.uri, options);

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
    value: function off(type, fn) {
      if (this.boundFunctions[fn]) {
        this.eventEmitter.off(type, this.boundFunctions[fn]);
      } else {
        this.eventEmitter.off(type, fn);
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, obj) {
      this.eventEmitter.trigger(type, obj);
    }
  }], [{
    key: 'getDataAttr',
    value: function getDataAttr(e, attr) {
      var isInt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var target = e.target;
      var data = target.dataset[attr];
      if (isInt === true) {
        data = parseInt(data);
      }
      return data;
    }
  }]);

  return View;
}();

// export default class View;

exports.View = View;
exports.Router = Router;
exports.DocumentListener = DocumentListener;
exports.EventEmitter = EventEmitter;
exports.Query = Query;
