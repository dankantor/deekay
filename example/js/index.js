const Framework = require('./../../lib');
const Auth = require('./auth');
const SongView = require('./views/song');

class App {
  
  constructor() {
    this.init();
  }
  
  async init() {
    this.router = new Framework.Router();
    await this.createAuth();
    this.createViews();
    this.router.execute();
  }
  
  async createAuth() {
    this.auth = new Auth();
    await this.auth.check();
  }
  
  async createViews() {
    new SongView(this.auth);
  }
   
}

window.addEventListener('load', e => {
  new App();
});