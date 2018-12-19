export class Query {
  
  constructor(selector) {
    this.nodeList = document.querySelectorAll(selector);
    return this;
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
  
   
}