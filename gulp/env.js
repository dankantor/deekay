var env = {};

env.dev = {
  'env': 'dev',
  'browserifyDebug': true,
  'browserifyFailOnError': false,
  'uglify': false,
  'lintFailOnError': false,
  'lessFailOnError': false
};

env.prod = {
  'env': 'prod',
  'browserifyDebug': false,
  'browserifyFailOnError': true,
  'uglify': true,
  'lintFailOnError': true,
  'lessFailOnError': true
};

module.exports.get = function() {
  var envString = process.env.ENV || 'dev';
  return env[envString];
};