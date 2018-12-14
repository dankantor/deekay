var gulp = require('gulp');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace-task');
var _ = require('underscore');
var hbsfy = require('hbsfy');
var requireGlobify = require('require-globify');
var sourcemaps = require('gulp-sourcemaps');
var Env = require('./env');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('browserify', function () {
  var env = Env.get();
  var replacePatterns = [
    {
      'match': 'buildTimestamp',
      'replacement': new Date().getTime()
    },
    {
      'match': 'env',
      'replacement': env.env
    }
  ];
  _.mapObject(env.browserVars, function(val, key) {
    var obj = {
      'match': key,
      'replacement': val
    };
    replacePatterns.push(obj);
  });
  var b = browserify({
    entries: './src/js/index.js',
    debug: true,
    insertGlobals: false,
    transform: ['babelify', 'require-globify', 'hbsfy']
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .on('error', notify.onError(function(error) {
      var message = 'Browserify error: ' + error.message;
      if ( env.browserifyFailOnError === true ) {
        console.log(error);
        process.exit(1);
      }
      return message;
    }))
    .pipe(replace({
      patterns: replacePatterns
    }))
    .pipe(gulpif( env.uglify, uglify() ))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/static/js'));
});