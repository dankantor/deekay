var gulp = require('gulp');
var RevAll = require('gulp-rev-all');

gulp.task('rev', ['handlebars', 'less', 'browserify', 'imagemin', 'fontcopy', 'extrascopy'], function () {
  return gulp
    .src('build/**')
    .pipe(RevAll.revision({ 
      'dontRenameFile': [
        '/static/images/favicon.png',
        '/static/images/fig-fm.png',
        'sitemap.xml',
        'index',
        '404.html',
        'privacy',
        'terms',
        'robots.txt',
        'about',
        '/static\/images\/services\/.+',
        '/static\/images\/email\/.+',
        '/static\/images\/icons\/.+',
        'security'
      ],
      'dontUpdateReference': [
        '/static/images/favicon.png',
         '/static/images/fig-fm.png',
        'sitemap.xml',
        'robots.txt',
        '/static\/images\/services\/.+',
        '/static\/images\/email\/.+',
        '/static\/images\/icons\/.+'
      ]
    }))
    .pipe(gulp.dest('cdn'));
});