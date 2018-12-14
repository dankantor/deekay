var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('unitTest', function() {
  return gulp.src('test/unit/*.js')
    .pipe(jasmine());
});

function intTest() {
  return gulp.src('test/integration/*.js')
    .pipe(jasmine({
      'verbose': true,
      'timeout': 10000
    }).on('end', function() {
      process.exit();
    }).on('error', function() {
      process.exit(1);
    }));
}

gulp.task('intTest', intTest);

gulp.task('test', ['unitTest'], intTest);
