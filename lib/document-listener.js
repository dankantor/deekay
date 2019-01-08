import {Query} from './query.js';

class DocumentListener {
  
  /**
   * @summary Create a DocumentListener. Only one DocumentListener instance will be created in 
   * an application.
   * @description All DOM events are attached to the document and then filtered by selector.
   * @returns {DocumentListener} singleton
   */
  constructor() {
    if (!DocumentListener.instance) {
      DocumentListener.instance = this;
      this.events = {};
    }
    return DocumentListener.instance;
  }
  
  /**
   * @method
   * @description Add a DOM event listener. 
   * @param {string} type - The name of the event to listen on.
   * @param {string} selector - A valid CSS selector string which will be used in document.querySelectorAll.
   * @param {function} listener - The callback function for when this event is triggered.
   * @param {object} [context] - The value of 'this' provided to the listener. 
   */
  on(type, selector, listener, context) {
    if (!this.events[type]) {
      this.events[type] = [];
      document.addEventListener(type, this.listener.bind(this));
    }
    let event = {
      'selector': selector,
      'listener': listener,
      'context': context
    };
    this.events[type].push(event);
  }
  
  listener(e) {
    let triggered = false;
    this.events[e.type].forEach(event => {
      if (triggered === false) {
        const query = document.querySelectorAll(event.selector);
        query.forEach(item => {
          if (triggered === false) {
            triggered = this._trigger(e, event, item, e.target, event.listener);
          }
        });
      }
    });
  }
  
  _trigger(e, event, target, node, listener) {
    if (target === node) {
      listener.apply(event.context, [e, new Query(target)]);
      return true;
    }
    if (node.parentNode) {
      return this._trigger(e, event, target, node.parentNode, listener);
    }
    return false;
  }
  
}

export {DocumentListener}