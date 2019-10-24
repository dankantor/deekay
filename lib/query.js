class Query {
  
  /**
   * @summary Create a new Query.
   * @param {(string|Node|NodeList)} selector - A valid CSS selector string or Node or NodeList.
   * @returns {Query}
   */
  constructor(selector) {
    this.selector = selector;
    this._polyfillPrepend();
    return this;
  }
  
  /**
   * @member
   * @description List of matched elements. 
   * @returns {NodeList}
   */
  get nodeList() {
    if (this.cachedNodeList) {
      return this.cachedNodeList;
    }
    if (typeof this.selector === 'string') {
      this.cachedNodeList = document.querySelectorAll(this.selector);
      this._clearCachedNodeList();
      return this.cachedNodeList;
    } else if (typeof this.selector === 'object') {
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
  
  /**
   * @member
   * @description First element in the set of matched elements. 
   * @returns {Node}
   */
  get firstNode() {
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
  
  _clearCachedNodeList() {
    setTimeout(() => {
      this.cachedNodeList = undefined;
    }, 20);
  }
  
  /**
   * @member
   * @description Length of the set of matched elements.
   * @returns {number}
   */
  get length() {
    return this.nodeList.length;
  }
  
  /**
   * @method
   * @description Add a class to the set of matched elements. 
   * @param {string} className - The value of the class to add.
   * @returns {Query}
   */
  addClass(className) {
    this.nodeList.forEach(node => {
      node.classList.add(className);
    });
    return this;
  }
  
  /**
   * @method
   * @description Remove a class from the set of matched elements. 
   * @param {string} className - The value of the class to remove.
   * @returns {Query}
   */
  removeClass(className) {
    this.nodeList.forEach(node => {
      node.classList.remove(className);
    });
    return this;
  }
  
  /**
   * @method
   * @description Checks if the specified class value exists in the set of matched elements.
   * If any element contains the class, will return true. 
   * @param {string} className - The value of the class to check.
   * @returns {boolean}
   */
  hasClass(className) {
    let _hasClass = false;
    this.nodeList.forEach(node => {
      if (node.classList.contains(className) === true) {
        _hasClass = true;
      }
    });
    return _hasClass;
  }
  
  /**
   * @method
   * @description Toggle the class value on the set of matched elements.
   * @param {string} className - The value of the class to toggle.
   * @returns {boolean}
   */
  toggleClass(className) {
    this.nodeList.forEach(node => {
      node.classList.toggle(className);
    });
    return this;
  }
  
  /**
   * @member
   * @description Get the HTML contents of the first element in the set of matched elements 
   * or set the HTML contents of every matched element.
   */
  get html() {
    if (this.firstNode) {
      return this.firstNode.innerHTML;
    }
    return undefined;
  }
  
  set html(content) {
    this.nodeList.forEach(node => {
      node.innerHTML = content;
    });
    return this;
  }
  
  /**
   * @member
   * @description Get the text contents of the first element in the set of matched elements 
   * or set the text contents of every matched element.
   */
  get text() {
    if (this.firstNode) {
      return this.firstNode.innerText;
    }
    return undefined;
  }
  
  set text(content) {
    this.nodeList.forEach(node => {
      node.innerText = content;
    });
    return this;
  }
  
  /**
   * @member
   * @description Get the value of the first element in the set of matched elements 
   * or set the value of every matched element.
   */
  get val() {
    if (this.firstNode) {
      return this.firstNode.value.trim();
    }
    return undefined;
  }
  
  set val(content) {
    this.nodeList.forEach(node => {
      node.value = content;
    });
    return this;
  }
  
  /**
   * @member
   * @description Get the data attributes of the first element in the set of matched elements. 
   * If value can be turned into a Number it will be (eg. {'position': 2, 'name': 'foo'}).
   */
  get data() {
    if (this.firstNode) {
      let dataset = null;
      const keys = Object.keys(this.firstNode.dataset);
      if (keys.length === 0) {
        return null;
      }
      dataset = {};
      keys.forEach(key => {
        const value = this.firstNode.dataset[key];
        dataset[key] = !isNaN(value) ? parseInt(value) : value;
      });
      return dataset;
    }
    return undefined;
  }
  
  /**
   * @method
   * @description Convert HTML string to a NodeList.
   * @param {string} content - HTML string.
   * @returns {NodeList}
   */
  stringToElement(content) {
    content = content.trim();
    return document.createRange().createContextualFragment(content);
  }
  
  /**
   * @method
   * @description  Insert content, specified by the parameter, to the beginning of 
   * each element in the set of matched elements.
   * @param {string} content - HTML string.
   * @returns {Query}
   */
  prepend(content) {
    const html = this.stringToElement(content);
    this.nodeList.forEach(node => {
      node.prepend(html);
    });
    return this;
  }
  
  /**
   * @method
   * @description  Insert content, specified by the parameter, to the end of 
   * each element in the set of matched elements.
   * @param {string} content - HTML string.
   * @returns {Query}
   */
  append(content) {
    const html = this.stringToElement(content);
    this.nodeList.forEach(node => {
      node.append(html);
    });
    return this;
  }
  
  /**
   * @method
   * @description Remove all child nodes of the set of matched elements from the DOM. 
   * @returns {Query}
   */
  empty() {
    this.nodeList.forEach(node => {
      node.innerHTML = '';
    });
    return this;
  }
  
   /**
   * @method
   * @description Remove the set of matched elements from the DOM.
   * @returns {Query}
   */
  remove() {
    this.nodeList.forEach(node => {
      node.parentNode.removeChild(node);
    });
    return this;
  }
  
  /**
   * @member
   * @description Get the value of the checked attribute for first element in the set of matched elements 
   * or set the value of every matched element.
   */
  get checked() {
    if (this.firstNode) {
      return this.firstNode.checked;
    }
    return undefined;
  }
  
  set checked(bool) {
    this.nodeList.forEach(node => {
      try {
        node.checked = bool;
      } catch (err) {}
    });
    return this;
  }
  
  /**
   * @method
   * @description Get the value of an attribute for the first element in the set of matched elements. 
   * @param {string} name - The name of the attribute to get.
   * @returns {string}
   */
  getAttr(name) {
    if (this.firstNode) {
      return this.firstNode.getAttribute(name);
    }
    return undefined;
  }
  
  /**
   * @method
   * @description Set an attribute for every matched element. 
   * @param {string} name - The name of the attribute to set.
   * @param {string} value - A value to set for the attribute.
   * @returns {Query}
   */
  setAttr(name, value) {
    this.nodeList.forEach(node => {
      node.setAttribute(name, value);
    });
    return this;
  }
  
  /**
   * @method
   * @description Remove an attribute from each element in the set of matched elements. 
   * @param {string} name - An attribute to remove.
   * @returns {Query}
   */
  removeAttr(name) {
    this.nodeList.forEach(node => {
      node.removeAttribute(name);
    });
    return this;
  }
  
  /**
   * @method
   * @description Attach an event handler function for one event to the selected elements. 
   * @param {string} type - The name of the event to listen on.
   * @param {function} listener - The callback function for when this event is triggered.
   * @returns {Query}
   */
  on(type, listener) {
    this.nodeList.forEach(node => {
      node.addEventListener(type, listener, false);
    });
    return this;
  }
  
  /**
   * @method
   * @description Remove an event handler function for one event to the selected elements. 
   * @param {string} type - The name of the event to listen on.
   * @param {function} listener - The callback function for when this event is triggered.
   * @returns {Query}
   */
  off(type, listener) {
    this.nodeList.forEach(node => {
      node.removeEventListener(type, listener);
    });
    return this;
  }
  
  /**
   * @method
   * @description Set a CSS property for every matched element.
   * @param {string} name - A CSS property name.
   * @param {string} value - A value to set for the property.
   * @returns {Query}
   */
  css(name, value) {
    this.nodeList.forEach(node => {
      node.style[name] = value;
    });
    return this;
  }
  
  _polyfillPrepend() {
    [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(item => {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          let argArr = Array.prototype.slice.call(arguments);
          let docFrag = document.createDocumentFragment();
          argArr.forEach(argItem => {
            let isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  }
   
}

export {Query}