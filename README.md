# Deekay

A simple vanilla JS front-end framework with no dependencies. 

## Why create 'Yet Another JS Framework'?

I've been using Backbone and JQuery forever. I really only use a small bit of the functionality they offer. 
So I decided to create a simple framework that only does that small bit. 

## Getting started

```bash
  npm install deekay
```

The easiest way to get started is to jump into the [Example App](example/index.html). 

To run it, you'll need a webserver. I recommend https://www.npmjs.com/package/http-server. After installing
it run `http-server` and open a browser to http://localhost:8080/example/. 

## Usage


### View

View is a class that provides a small subset of the functionality provided by Backbone. 

[View Documentation](docs/View.html)

```js
  // create our variables up top
  const {View} = require('deekay');
  const template = require('./templates/search.hbs');
  const selector = '#content';
  const events = [
    {'type': 'submit', 'selector': '#search-form', 'listener': 'onSubmit'},
    {'type': 'search:refresh', 'listener': 'onRefresh'}
  ];
  const uri = '/api/search';
  const route = {'pathname': '/search/:query', 'name': 'Search', 'listener': 'show'};
  const binded = ['refresh'];
  
  // extend the View class
  class SearchView extends View {
    
    // pass in all our variables to the parent View
    constructor() {
      super({selector, template, events, route, uri, binded});
    }
    
    // callback when our route is triggered. Grab the 'query' property from params and render 
    // it in our template. The template will be inserted into #content. Notice that 'this' 
    // is already set to the SearchView instance. 
    show(params){
      this.query = params.query;
      this.render({
        'data': {
          'query': this.query 
        }
      });
    }
    
    // callback when our form is submitted. Call our API with the query using this.fetch.
    // The uri for fetch has already been set up top. If there is an error, the returned object
    // from this.fetch will have the 'error' property set to true. 
    async onSubmit(e, target) {
      e.preventDefault();
      const response = await this.fetch({
        'body': JSON.stringify({
          'query': this.query
        });
      });
      if (response.error === false) {
        alert('Good response'); 
      } else {
        alert('There was an error'); 
      }
      return false; 
    }
    
    // callback when a custom 'search:refresh' event is fired from another view because we 
    // included it in our events array up top.
    onRefresh(e, target) {
      setTimeout(this.binded.refresh, 500);
    }
    
    // refresh called from our setTimeout above. Notice that 'this' is already set to the SearchView 
    // instance because we set it in the binded array up top and used 'this.binded.refresh'.
    refresh() {
      this.render({
        'data': {
          'query': this.query 
        }
      }); 
    }
    
  }
  
  export {SearchView}
``` 

### Query

Query is a class that provides a small subset of the functionality provided by jQuery. View the docs to see
what it includes. 

[View Documentation](docs/Query.html)

```js
  const {Query} = require('deekay');
  
  const el = new Query('#some-id');
  el.addClass('myclass');
  el.text = 'Some new text';
```

### Router

Router listens to browser location changes and fires when a known route is matched. If there is no match, a
'router:nomatch' event will be fired.

Router will listen for all clicks on anchor elements. When anchors are clicked the browser will not 
navigate to the new url, but will instead change the History state. If the anchor has `target=_self` the 
browser will perform a full navigation. If the anchor has `target=_blank'` it will open a new tab/window. 

[View Documentation](docs/Router.html)

```js
  const {Router} = require('deekay');
  
  // create a new router. It is a singleton and only one router can be created in an application.
  const router = new Router();
  
  // call this after all views are created to trigger the initial route. 
  router.execute();
```

All View instances automatically have the router set as a member, and will usually be accessed that way.

```js
  const {View} = require('deekay');
  const template = require('./templates/not-found.hbs');
  const events = [
    {'type': 'router:nomatch', 'listener': 'show'},
    {'type': 'click', 'selector': '#home', 'listener': 'onClick'}
  ];
  
  class NotFoundView extends View {
    
    constructor() {
      super({events});
    }
    
    show(params) {
      this.render();
    }
    
    // #home was clicked. Navigate our router to '/'.
    onClick(e, target) {
      this.router.navigate({'href': '/'});
    }  
     
  }
```

### DocumentListener

DocumentListener is rarely used directly, but rather through a View. Each view instance will get a member 
documentListener. Each application will only have one DocumentListener created (singleton). 

[View Documentation](docs/DocumentListener.html)

```js
  const {View} = require('deekay');
  
  // events added here with a selector property will be passed to the documentListener.on method
  const events = [
    {'type': 'click', 'selector': '#home', 'listener': 'onClick'}
  ];
  
  class NotFoundView extends View {
    
    constructor() {
      super({events});
    }
    
    // #home was clicked. We can add a class to it.
    onClick(e, target) {
      target.addClass('active');
    } 
    
    // We can add listeners this way as well
    addListener() {
      this.documentListener.on('click', '#some-id', (e, target) => {
        target.addClass('active');
      }, this);
    } 
     
  }
```

If you do want to use DocumentListener outside of a View.
  
```js
  const {DocumentListener} = require('deekay');
  
  let documentListener = new DocumentListener();
  documentListener.on('click', '#some-id', (e, target) => {
    target.addClass('active');
  }, this);
```

### EventBus

EventBus is used as a global event bus for custom events. 

EventBus is rarely used directly, but rather through a View. Each view instance will get a member 
EventBus. Each application will only have one EventBus created (singleton).

[View Documentation](docs/EventBus.html)

```js
  const {View} = require('deekay');
  
  // events added here without a selector property are considered custom events and will be passed 
  // to the eventBus.on method
  const events = [
    {'type': 'search:refresh', 'listener': 'onRefresh'}
  ];
  
  class SearchView extends View {
    
    constructor() {
      super({events});
    }
    
    // search:refresh was triggered 
    onRefresh(e, data) {
      console.log(data);
    } 
    
    // We can add listeners for custom events this way too
    addListener() {
      this.on('search:refresh', this.onRefresh);
    } 
     
  }
```

Stop listening for a custom event.

```js
  const {View} = require('deekay');
  
  class SearchView extends View { 
    
    removeListener() {
      this.off('search:refresh', this.onRefresh);
    } 
     
  }
```


Trigger a custom event.

```js
  const {View} = require('deekay');
  
  class SearchView extends View { 
    
    triggerEvent() {
      this.trigger('search:refresh', data);
    } 
     
  }
```

If you do want to use EventBus outside of a View.
  
```js
  const {EventBus} = require('deekay');
  
  let eventBus = new EventBus();
  eventBus.on('search:refresh', (e, data) => {
    console.log(data);
  });
```

## Build from source

Deekay is written in ES6. To compile it for use in browsers, use Rollup. The command to compile is - 
`npm run build`

To create the latest docs, you can do `npm run jsdoc`

## Babel / CoreJS

Deekay targets modern browsers but can work all the way back to IE11 with a few polyfills. If using CoreJs 
you'll need to include these features to work properly. Learn more here - https://github.com/zloirock/core-js

```
import 'core-js/features/array/for-each';
import 'core-js/features/array/find';
import 'core-js/features/promise';
import 'core-js/web/dom-collections';
import 'core-js/features/object/assign';
```
