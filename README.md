# Deekay

A simple vanilla JS framework with no dependencies. 

## Why create 'Yet Another JS Framework'?

I've been using Backbone and JQuery forever. I really only use a small bit of the functionality they offer. 
So I decided to create a simple framework that only does that small bit. 

## Getting started

```bash
  npm install deekay
```

## Usage

### View

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
    
    // callback when our route is triggered. Grab the 'query' property from params and render it 
    // in our template. The template will be inserted into #content. Notice that 'this' is already set to 
    // the SearchView instance. 
    show(params){
      this.query = params.query;
      this.render({
        'data': {
          'query': this.query 
        }
      });
    }
    
    // callback when our form is submitted. Call our API with the query using this.fetch. The uri for fetch
    // has already been set up top. If there is an error, the returned object from this.fetch will have the 
    // 'error' property set to true. 
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
    
    // callback when a custom 'search:refresh' event is fired from another view because we included it in our 
    // events array up top.
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

## Build from source

Deekay is written in ES6. To compile it for use in browsers, we use Rollup. The command to compile is - 
`npm run build`

To create the latest docs, you can do `npm run jsdoc`
