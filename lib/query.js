export class Query {
  
  constructor(selector) {
    this.selector = selector;
    return this;
  }
  
  get nodeList() {
    if (this.cachedNodeList) {
      return this.cachedNodeList;
    }
    if (typeof this.selector === 'string') {
      this.cachedNodeList = document.querySelectorAll(this.selector);
      this._clearCachedNodeList();
      return this.cachedNodeList;
    } else if (typeof this.selector === 'object') {
      this.cachedNodeList = this.selector;
      this._clearCachedNodeList();
      return this.cachedNodeList;
    }
    return undefined; 
  }
  
  get firstNode() {
    if (this.nodeList) {
      if (this.nodeList instanceof NodeList) {
        return this.nodeList.item(0);
      } else if (this.nodeList instanceof Node) {
        return this.nodeList; 
      }
    }
    return undefined;
  }
  
  get nodeListAsIterable() {
    if (this.nodeList) {
      if (this.nodeList instanceof NodeList) {
        return this.nodeList;
      } else if (this.nodeList instanceof Node) {
        return [this.nodeList]; 
      }
    }
    return undefined;
  }
  
  _clearCachedNodeList() {
    setTimeout(() => {
      this.cachedNodeList = undefined;
    }, 20);
  }
  
  get length() {
    return this.nodeList.length;
  }
  
  addClass(className) {
    this.nodeListAsIterable.forEach(node => {
      node.classList.add(className);
    });
    return this;
  }
  
  removeClass(className) {
    this.nodeListAsIterable.forEach(node => {
      node.classList.remove(className);
    });
    return this;
  }
  
  hasClass(className) {
    let _hasClass = false;
    this.nodeListAsIterable.forEach(node => {
      if (node.classList.contains(className) === true) {
        _hasClass = true;
      }
    });
    return _hasClass;
  }
  
  toggleClass(className) {
    // todo: what boolean do you return? ie. first node, all (hash), one (like hasClass)
  }
  
  get html() {
    if (this.firstNode) {
      return this.firstNode.innerHTML;
    }
    return undefined;
  }
  
  set html(content) {
    this.nodeListAsIterable.forEach(node => {
      node.innerHTML = content;
    });
    return this;
  }
  
  get text() {
    if (this.firstNode) {
      return this.firstNode.innerText;
    }
    return undefined;
  }
  
  set text(content) {
    this.nodeListAsIterable.forEach(node => {
      node.innerText = content;
    });
    return this;
  }
  
  get val() {
    if (this.firstNode) {
      return this.firstNode.value;
    }
    return undefined;
  }
  
  set val(content) {
    this.nodeListAsIterable.forEach(node => {
      node.value = content;
    });
    return this;
  }
  
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
        dataset[key] = parseInt(value) ? parseInt(value) : value;
      });
      return dataset;
    }
    return undefined;
  }
  
  stringToElement(content) {
    const template = document.createElement('template');
    content = content.trim();
    template.innerHTML = content;
    return template.content;
  }
  
  prepend(content) {
    const html = this.stringToElement(content);
    this.nodeListAsIterable.forEach(node => {
      node.prepend(html);
    });
    return this;
  }
  
  append(content) {
    const html = this.stringToElement(content);
    this.nodeListAsIterable.forEach(node => {
      node.append(html);
    });
    return this;
  }
  
  empty() {
    this.nodeListAsIterable.forEach(node => {
      node.innerHTML = '';
    });
    return this;
  }
  
  remove() {
    this.nodeListAsIterable.forEach(node => {
      node.parentNode.removeChild(node);
    });
    return this;
  }
  
  get checked() {
    if (this.firstNode) {
      return this.firstNode.checked;
    }
    return undefined;
  }
  
  set checked(bool) {
    this.nodeListAsIterable.forEach(node => {
      node.checked = bool;
    });
    return this;
  }
   
}