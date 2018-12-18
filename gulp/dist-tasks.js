var gulp = require('gulp');
var notify = require('gulp-notify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('dist', function () {
  var b = browserify({
    entries: './lib/index.js',
    debug: false,
    insertGlobals: false,
    transform: ['babelify']
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .on('error', notify.onError(function(error) {
      var message = 'Browserify error: ' + error.message;
      if ( env.browserifyFailOnError === true ) {
        console.log(error);
        process.exit(1);
      }
      return message;
    }))
    .pipe(gulp.dest('./dist/'));
});