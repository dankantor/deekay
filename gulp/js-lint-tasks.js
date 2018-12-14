var gulp = require('gulp');
var eslint = require('gulp-eslint');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var Env = require('./env');

gulp.task('jslint', function () {
  var env = Env.get();
  if ( env.lintFailOnError === true ) {
    return failOnError();
  } else {
    return dontFailOnError();
  }
});

function dontFailOnError() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError().on('error', notify.onError("Error: <%= error.message %>")));
};

function failOnError() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError().on('error', function(e) {
      console.log('jslint error:', e);
      process.exit(1);
    }));
};
