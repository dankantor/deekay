var gulp = require('gulp');
var requireDir = require('require-dir')('./gulp');

var tasks = require('./gulp/tasks');

// this runs all the tasks and puts your compiled files into a build dir
gulp.task('build', tasks);

// this will do an initial build, then build on any changes to src
gulp.task(
  'watch',
  tasks,
  watchFiles
);

// watch for changes
function watchFiles() {
  gulp.watch(['src/js/**', 'src/handlebars/helpers/**'], ['jslint', 'browserify']);
  gulp.watch('src/less/**', ['less']);
  gulp.watch('src/images/**', ['imagemin']);
  gulp.watch('src/fonts/**', ['fontcopy']);
  gulp.watch('src/handlebars/**', ['handlebars']);
  gulp.watch('src/handlebars/partials/**', ['browserify']);
}