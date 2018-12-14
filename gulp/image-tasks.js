var gulp = require('gulp');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

// minify src/images to build/images
gulp.task('imagemin', function() {
  return gulp.src('src/images/**')
    .pipe(newer('./build/static/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('./build/static/images'));
});
