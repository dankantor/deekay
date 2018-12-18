class DocumentListener {
  
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
    this.events[e.type].forEach(event => {
      const query = document.querySelectorAll(event.selector);
      query.forEach(item => {
        if (item === e.target) {
          event.listener.apply(event.context, [e]);
        }
      });
    });
  }
  
}

module.exports = DocumentListener;