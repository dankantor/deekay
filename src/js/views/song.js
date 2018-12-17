const View = require('./../framework/view');

const template = require('./../../handlebars/partials/hello.hbs');
const el = '#content';
const events = [
  {'type': 'click', 'selector': '#hello', 'listener': 'onClick'},
  {'type': 'new:song', 'listener': 'onNewSong'}
];
const listeners = [
  {'e': 'new:song', 'fn': 'onNewSong'}
];
const uri = 'https://api.fig.fm/searches';

class SongView extends View { 
  
  constructor(auth) {
    super({el, template, events, listeners, uri});
    this.auth = auth;
    if (this.auth.authorization !== null) {
      this.render({
        'foo': 'bar'
      });
    }
  }
  
  async onClick(e) {
    let position = View.getData(e, 'position', true);
    console.log('position', position);
    let response = await this.getRemote(this.auth.authorization);
    this.trigger('new:song', response);
  }
  
  onNewSong(e, data) {
    console.log('onNewSong', e, data, this);
  }
  
  onNewSong2(e, data) {
    console.log('onNewSong2', this);
  }
   
}

module.exports = SongView;