var gulp = require('gulp');
var del = require('del');

// delete the contents of build folder
gulp.task('cleanbuild', function() {
  return del([
    './build/**',
    './src/less/generated/**',
    './src/handlebars/generated/**',
    './cdn/**'
  ]); 
});
