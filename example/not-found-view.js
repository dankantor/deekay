import {View} from './../lib/view.js';
import template from './not-found-template.js';

const selector = '#content';
const events = [
  {'type': 'router:nomatch', 'listener': 'show'}
];

class NotFoundView extends View {
  
  constructor() {
    super({selector, template, events});
  }
  
  // Listening to the 'router:nomatch' event as defined up top in Events.
  show(e, data) {
    this.render();
  }
  
}

export default NotFoundView;