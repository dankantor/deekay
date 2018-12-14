var gulp = require('gulp');

// copy src/extras to build
gulp.task('extrascopy', function() {
  return gulp.src(
    './src/extras/**/'
  )
  .pipe(gulp.dest('./build/static'));
});