var env = {};

env.dev = {
  'env': 'dev',
  'browserifyDebug': true,
  'browserifyFailOnError': false,
  'uglify': false,
  'awsSync': false,
  'awsCloudfront': false,
  'lintFailOnError': false,
  'lessFailOnError': false,
  'robotsOptions': {
    'useragent': '*',
    'disallow': '/',
    'allow': ''
  },
  'sitemap': false,
  'cfDistributionId': 'EBP2WUDPIT7OQ',
  'browserVars': {
    'apiBase': 'https://dev-api.fig.fm',
    'useAnalytics': false,
    'analyticsKey': 'UA-96799614-1',
    'raven': 'https://40daef2b7eeb4404ab00ed00a4b0e383@sentry.io/161760',
    'historyPushState': true,
    'pusherKey': 'b2265ae01a788aafa554',
    'favicon': 'favicon-dev.png',
    'lastfmApiBase': 'https://ws.audioscrobbler.com/2.0',
    'lastfmKey': 'd3da15412728feec81f1d3bc75cb6b4d',
    'mixpanelKey': '3e67f8790b7d39f440b1f71383563a0a',
    'algoliaApplicationId': 'M9LA4NA406',
    'algoliaIndex': 'dev_CatalogSongs',
    'algoliaKey': '57800266be2efeab3cf0e920fe983b26',
    'imagesUri': 'https://images.fig.fm'
  }
};

env.prod = {
  'env': 'prod',
  'browserifyDebug': false,
  'browserifyFailOnError': true,
  'uglify': true,
  'awsSync': false,
  'awsCloudfront': true,
  'lintFailOnError': true,
  'lessFailOnError': true,
  'robotsOptions': {
    'useragent': '*',
    'disallow': '',
    'allow': ''
  },
  'sitemap': true,
  'analytics': true,
  'cfDistributionId': 'EBQ2ZBVR9250Q',
  'browserVars': {
    'apiBase': 'https://api.fig.fm',
    'useAnalytics': true,
    'analyticsKey': 'UA-128042690-1',
    'raven': 'https://40daef2b7eeb4404ab00ed00a4b0e383@sentry.io/161760',
    'historyPushState': true,
    'pusherKey': 'b7d18923672f8f2c132a',
    'favicon': 'favicon.png',
    'lastfmApiBase': 'https://ws.audioscrobbler.com/2.0',
    'lastfmKey': 'd3da15412728feec81f1d3bc75cb6b4d',
    'mixpanelKey': 'e06093a832e465feb11b6e113f001029',
    'algoliaApplicationId': 'M9LA4NA406',
    'algoliaIndex': 'prod_CatalogSongs',
    'algoliaKey': 'e03951550792be76d667a8e2a87d9f9b',
    'imagesUri': 'https://images.fig.fm'
  }
};

module.exports.get = function() {
  var envString = process.env.ENV || 'dev';
  return env[envString];
};