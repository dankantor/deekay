var gulp = require('gulp');

// copy src/fonts to build/fonts
gulp.task('fontcopy', function() {
  return gulp.src(
    './src/fonts/**/'
  )
  .pipe(gulp.dest('./build/static/fonts/'));
});