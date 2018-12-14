var gulp = require('gulp');
var robots = require('gulp-robots');
var Env = require('./env');

gulp.task('robots', ['handlebars'], function() {
  var env = Env.get();
  return gulp.src('build/index')
    .pipe(robots(env.robotsOptions))
    .pipe(gulp.dest('./build/'));
});