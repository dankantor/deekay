var gulp = require('gulp');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var requireDir = require('require-dir');
var helpers = requireDir('./../example/handlebars/helpers');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace-task');
var data = require('gulp-data');
var gulpif = require('gulp-if');
var path = require('path');
var _ = require('underscore');
var Env = require('./env');
var pageData = requireDir('./../example/handlebars/data');

gulp.task('handlebars', function() {
  var env = Env.get();
  var timestamp = new Date().getTime();
  var options = {
    'ignorePartials': true,
    'batch' : [
      './example/handlebars/partials/'
    ],
    'helpers': helpers
  };
  return gulp.src('example/handlebars/pages/**')
    .pipe(data(function(file) {
      var key = path.basename(file.path, '.hbs');
      var data = pageData[key];
      if ( data === undefined ) {
        data = {};
      }
      data.sitemap = env.sitemap;
      _.mapObject(env.browserVars, function(val, key) {
        data[key] = val;
      });
      return data;
    }))
    .pipe(rename(function (path) {
      if (path.basename === '404') {
        path.extname = '.html';
      } else {
        path.extname = '';
      }
    }))
    .pipe(handlebars(data, options))
    .pipe(gulpif( env.uglify, htmlmin({collapseWhitespace: true}) ))
    .pipe(gulp.dest('./build/'));
});