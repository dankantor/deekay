export class Query {
  
  constructor(selector) {
    this.selector = selector;
    return this;
  }
  
  get nodeList() {
    if (typeof this.selector === 'string') {
      return document.querySelectorAll(this.selector);
    } else if (typeof this.selector === 'object') {
      if (this.selector.length) {
        return this.selector;
      } else {
        return [this.selector];
      }
    } else {
      throw new TypeError('selector must be of type string or object');
    } 
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