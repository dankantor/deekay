export class Query {
  
  constructor(selector) {
    this.selector = selector;
    this.cachedNodeList = null;
    this.ran = Math.random();
    return this;
  }
  
  get nodeList() {
    if (this.cachedNodeList !== null) {
      return this.cachedNodeList;
    }
    if (typeof this.selector === 'string') {
      this.cachedNodeList = document.querySelectorAll(this.selector);
      this._clearCachedNodeList();
      return this.cachedNodeList;
    } else if (typeof this.selector === 'object') {
      if (this.selector.length) {
        this.cachedNodeList = this.selector;
        this._clearCachedNodeList();
        return this.cachedNodeList;
      } else {
        this.cachedNodeList = [this.selector];
        this._clearCachedNodeList();
        return this.cachedNodeList;
      }
    }
    return null; 
  }
  
  _clearCachedNodeList() {
    setTimeout(() => {
      this.cachedNodeList = null;
    }, 200);
  }
  
  get length() {
    return this.nodeList.length;
  }
  
  addClass(className) {
    this.nodeList.forEach(node => {
      node.classList.add(className);
    });
    return this;
  }
  
  removeClass(className) {
    this.nodeList.forEach(node => {
      node.classList.remove(className);
    });
    return this;
  }
  
  hasClass(className) {
    let _hasClass = false;
    this.nodeList.forEach(node => {
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
    if (this.nodeList && this.nodeList.length > 0) {
      return this.nodeList[0].innerHTML;
    } else {
      return '';
    }
  }
  
  set html(content) {
    this.nodeList.forEach(node => {
      node.innerHTML = content;
    });
    return this;
  }
  
  get text() {
    if (this.nodeList && this.nodeList.length > 0) {
      return this.nodeList[0].innerText;
    } else {
      return '';
    }
  }
  
  set text(content) {
    this.nodeList.forEach(node => {
      node.innerText = content;
    });
    return this;
  }
  
  get val() {
    if (this.nodeList && this.nodeList.length > 0) {
      return this.nodeList[0].value;
    } else {
      return '';
    }
  }
  
  set val(content) {
    this.nodeList.forEach(node => {
      node.value = content;
    });
    return this;
  }
  
  get data() {
    if (this.nodeList !== null) {
      const target = this.nodeList[0];
      let dataset = null;
      const keys = Object.keys(target.dataset);
      if (keys.length === 0) {
        return null;
      }
      dataset = {};
      keys.forEach(key => {
        const value = target.dataset[key];
        dataset[key] = parseInt(value) ? parseInt(value) : value;
      });
      return dataset;
    }
    return null;
  }
  
  prepend(content) {
    this.nodeList.forEach(node => {
      const html = node.innerHTML;
      node.innerHTML = content + html;
    });
    return this;
  }
  
  append(content) {
    this.nodeList.forEach(node => {
      const html = node.innerHTML;
      node.innerHTML = html + content;
    });
    return this;
  }
  
  empty() {
    this.nodeList.forEach(node => {
      node.innerHTML = '';
    });
    return this;
  }
  
  remove() {
    this.nodeList.forEach(node => {
      node.parentNode.removeChild(node);
    });
    return this;
  }
   
}