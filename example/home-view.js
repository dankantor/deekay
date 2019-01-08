import {View} from './../lib/view.js';
import {Query} from './../lib/query.js';
import template from './home-template.js';

// Define params up top
const selector = '#content';
const route = {'pathname': '/example/', 'name': 'Home', 'listener': 'show'};
const events = [
  {'type': 'click', 'selector': '#click-me', 'listener': 'onClick'},
  {'type': 'customEvent', 'listener': 'onCustomEvent'}
];

class HomeView extends View {
  
  // Pass in our params to parent
  constructor() {
    super({selector, route, template, events});
  }
  
  // Our route was triggered and this method was called.
  // Let's render HTML by passing in some data. Our template 
  // and parent element are defined up top. 
  show() {
    this.render({
      'data': {
        'name': 'world'
      }
    });
  }
  
  // #click-me was clicked so this method is called because it is defined up top in Events.
  // Let's query for the element #action and manipulate it.
  // Let's also trigger a custom event
  onClick(e, target) {
    const actionEl = new Query('#action');
    actionEl.html = `<a href='action'>I'm a new link click me</a>`;
    this.trigger('customEvent', {'foo': 'bar'});
  }
  
  // This method is called because it is defined up top in Events.
  onCustomEvent(e, data) {
    console.log(data);
  }
  
  
}

export default HomeView;