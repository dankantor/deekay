import {Router} from './../lib/router.js';
import HomeView from './home-view.js';
import NotFoundView from './not-found-view.js';

class App {
  
  constructor() {
    // Create our router
    const router = new Router();
    
    // Create a new HomeView 
    new HomeView();
    
    // Create a new NotFoundView 
    new NotFoundView();
    
    // Execute our router so the initial page gets triggered
    router.execute();
  }
  
}

window.addEventListener('load', e => {
  new App();
});