const View = require('./../../../lib').View;

const template = require('./../../handlebars/partials/hello.hbs');
const el = '#content';
const events = [
  {'type': 'click', 'selector': '#hello', 'listener': 'onClick'},
  {'type': 'new:song', 'listener': 'onNewSong'},
  {'type': 'router:execute', 'listener': 'onRouterExecute'}
];
const uri = 'https://api.fig.fm/searches';
const route = {'pathname': '/user/:username', 'name': 'Song'};

class SongView extends View { 
  
  constructor(auth) {
    super({el, template, events, uri, route});
    this.auth = auth;
  }
  
  show(params) {
    this.render({
      'data': {
        'foo': params.username
      }
    });
  }

  async onClick(e) {
    let position = View.getDataAttr(e, 'position', true);
    console.log('position', position);
    let response = await this.fetch({
      'headers': {
        'authorization': this.auth.authorization
      }
    });
    this.trigger('new:song', response);
  }
  
  onNewSong(e, data) {
    console.log('onNewSong', this);
  }
  
  onRouterExecute(e, data) {
    console.log('onRouterExecute', e, data);
  }
   
}

module.exports = SongView;