var gulp = require('gulp');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var notify = require('gulp-notify');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var Env = require('./env');

// less src/less to build/css
gulp.task('less', function() {
  var autoprefix = new LessPluginAutoPrefix({
    'browsers': ["last 2 versions"]
  });
  var env = Env.get();
  return gulp
    .src('./src/less/index.less')
    .pipe(less({
      'paths': ['src/less'],
      'plugins': [autoprefix]
    }).on('error', notify.onError(function(error) {
      var message = 'Less error: ' + error.message;
      if ( env.lessFailOnError === true ) {
        console.log(error);
        process.exit(1);
      }
      return message;
    })))
    .pipe(gulpif( env.uglify, minifyCss() ))
    .pipe(gulp.dest('./build/static/css'));
});