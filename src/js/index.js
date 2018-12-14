const Auth = require('./auth');
const SongView = require('./views/song');

class App {
  
  constructor() {
    this.createViews();
  }
  
  async createViews() {
    await this.createAuth();
    new SongView(this.auth);
  }
  
  async createAuth() {
    this.auth = new Auth();
    await this.auth.check();
  }
  
}

window.addEventListener('load', e => {
  new App();
});