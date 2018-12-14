var gulp = require('gulp');
var webserver = require('gulp-webserver');
var serveStatic = require('serve-static');
var path = require('path');
var fs = require('fs');
var fileNotFound;

//starts a webserver on port 3000 to serve the *build* folder
gulp.task('webserver', function() {
  var middleware = [serve];
  var livereload = true;
  var port = process.env.PORT || '3000';
  return gulp.src('./build')
    .pipe(webserver({
      'livereload': livereload,
      'open': false,
      'host': '0.0.0.0',
      'port': port,
      'directoryListing': {
        'enable': false,
        'path': 'build'
      },
      'middleware': middleware,
      'fallback': 'index'
    }));
});

// convert all post and put to get
var handlePostPut = function(req, res, next) {
  req.method = 'GET';
  next();
};

var serveNotFound = function(req, res, next) {
  if (fileNotFound === undefined) {
    fileNotFound = fs.readFileSync(process.cwd() + '/build/404.html');
  }
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.end(fileNotFound);
};

// if file is not found make sure to search for index and not index.html in parent dir
var serve = serveStatic('./build',
  {
    'index': 'index',
    'setHeaders': setHeaders
  }
);

// if a page without an extension is served, set its content-type to text/html
function setHeaders(res, filePath) {
  var extname = path.extname(filePath);
  if ( extname === '' ) {
    res.setHeader('Content-Type', 'text/html');
  }
};

