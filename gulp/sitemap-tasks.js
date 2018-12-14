var gulp = require('gulp');
var sitemap = require('gulp-sitemap');
var rename = require('gulp-rename');

// create an xml sitemap from the pages in build. Exclude static, extras, mock, alpha and account pages
gulp.task('sitemap', ['handlebars'], function () {
  gulp.src([
    'build/**/',
    '!build/static/**',
    '!build/sitemap.xml',
    '!build/robots.txt',
    '!build/about'
  ])
    .pipe(rename(function (path) {
      if ( path.basename === 'index' ) {
        path.basename = '';
      }
    }))
    .pipe(sitemap({
      'siteUrl': 'https://fig.fm',
      'changefreq': 'weekly',
      'priority': 1.0,
      'lastmod': Date.now()
    }))
    .pipe(gulp.dest('./build'));
});