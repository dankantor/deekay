export class DocumentListener {
  
  constructor() {
    if (!DocumentListener.instance) {
      DocumentListener.instance = this;
      this.events = {};
    }
    return DocumentListener.instance;
  }
  
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
  
  _trigger(e, event, queryItem, node, listener) {
    if (queryItem === node) {
      // todo: this doesnt work. Cant set target on readOnly event
      // e.currentTarget = e.target;
      // e.target = queryItem;
      listener.apply(event.context, [e]);
      return true;
    }
    if (node.parentNode) {
      return this._trigger(e, event, queryItem, node.parentNode, listener);
    }
    return false;
  }
  
}