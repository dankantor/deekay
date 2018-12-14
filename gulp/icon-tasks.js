var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var insert = require('gulp-insert');

var fontName = 'custom-icons';
var templateData = {};

// creates icon font www-icons from svg files
gulp.task('iconfont', function(){
  return gulp.src(['./src/icons/*.svg'])
    .pipe(iconfont({
      'fontName': fontName,
      'appendUnicode': true,    // rename svg files to prevent unicode conflicts
      'formats': ['ttf', 'eot', 'woff']
    }))
      .on('glyphs', function(glyphs) {
        templateData = {
          'glyphs': glyphs.map(function(glyph) {
            return {
              'name': glyph.name,
              'codepoint': glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
            }
          }),
          'fontName': fontName,
          'fontPath': '../static/fonts/',
          'className': 'icon'
        }
      })
    .pipe(gulp.dest('./build/static/fonts/'));
});

gulp.task('iconLess', ['iconfont'], function(){
  var iconLess = templateData.glyphs.map(function(g) {
    return '\n.icon-' + g.name + ':before{\n content:"\\' + g.codepoint + '";\n}';
  }).join('');

  return gulp.src('src/less/icons.less')
    .pipe(insert.wrap('// GENERATED FILE DO NOT EDIT \n ', iconLess))
    .pipe(gulp.dest('./src/less/generated/'))
});
