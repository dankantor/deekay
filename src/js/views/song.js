const View = require('./../framework/view');

const template = require('./../../handlebars/partials/hello.hbs');
const el = '#content';
const events = [
  {'e': 'click', 'el': '#hello', 'fn': 'onClick'}
];
const listeners = [
  {'e': 'new:song', 'fn': 'onNewSong'},
  {'e': 'new:song', 'fn': 'onNewSong2'}
];
const uri = 'https://api.fig.fm/searches';

class SongView extends View { 
  
  constructor(auth) {
    super({el, template, events, listeners, uri});
    this.auth = auth;
    if (this.auth.authorization !== null) {
      this.render();
    }
  }
  
  async onClick(e) {
    let position = View.getData(e, 'position', true);
    console.log('position', position);
    let response = await this.getRemote(this.auth.authorization);
    this.eventEmitter.emit('new:song', response);
  }
  
  onNewSong(e, data) {
    console.log('onNewSong', e, data);
    this.eventEmitter.off('new:song', this.onNewSong2.bind(this));
  }
  
  onNewSong2(e, data) {
    console.log('onNewSong2', e, data);
  }
   
}

module.exports = SongView;