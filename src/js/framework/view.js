const $ = require('jquery');
const EventEmitter = require('./event-emitter');

class View {
  
  constructor(opts) {
    this.eventEmitter = new EventEmitter(); 
    this.$el = $(opts.el);
    this.template = opts.template;
    this.events = opts.events;
    this.listeners = opts.listeners;
    this.uri = opts.uri;
    this.attachEvents();
    this.attachListeners();
  }
  
  render(el = null, template = null, append = false) {
    let $el = this.$el;
    if (el !== null) {
      $el = $(el);
    }
    let html;
    if (template === null) {
      html = this.template();
    } else {
      html = template();
    }
    if (append === true) {
      $el.append(html);
    } else {
      $el.html(html);
    }
  }
  
  attachEvents() {
    if (this.events) {
      this.events.forEach(item => {
        $(document).on(item.e, item.el, this[item.fn].bind(this));
      });
    }
  }
  
  attachListeners() {
    if (this.listeners) {
      this.listeners.forEach(item => {
        this.eventEmitter.on(item.e, this[item.fn].bind(this));
      });
    }
  }
  
  static getData(e, attr, isInt = false) {
    const target = $(e.currentTarget);
    let data = target.attr(`data-${attr}`);
    if (isInt === true) {
      data = parseInt(data);
    }
    return data;
  }
  
  async getRemote(authorization, uri = null) {
    if (uri !== null) {
      this.uri = uri;
    }
    const result = {'error': true};
    try {
      const response = await fetch(this.uri, {
        'headers': {
          'Authorization': authorization
        }
      });
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
}

module.exports = View;