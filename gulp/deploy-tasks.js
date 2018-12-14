var gulp = require('gulp');
var awspublish = require('gulp-awspublish');
var awspublishRouter = require('gulp-awspublish-router');
var cloudfront = require('gulp-cloudfront-invalidate-aws-publish');
var fs = require('fs');
var gulpif = require('gulp-if');
var Env = require('./env');

var tasks = require('./tasks');

// deploy to the S3 bucket set in aws.json
gulp.task(
  'deploy',
  tasks,
  publish
);

// publish to S3
function publish() {
  var aws;
  var env = Env.get();
  var awsSync = env.awsSync;
  var awsCloudfront = env.awsCloudfront;
  if (process.env.CI) {
    console.log('Deploying from CI');
    var bucket = process.env.BUCKET;
    aws = {
      "params": {
        "Bucket": bucket 
      }
    }
  } else {
    console.log('Deploying from aws.json');
    aws = JSON.parse(fs.readFileSync('./aws.json'));
  }
  if (process.env.AWS_SYNC) {
    awsSync = JSON.parse(process.env.AWS_SYNC);
  }
  if (process.env.AWS_CLOUDFRONT) {
    awsCloudfront = JSON.parse(process.env.AWS_CLOUDFRONT);
  }
  var cfSettings = {
    'distribution': env.cfDistributionId,
    'indexRootPath': true
  };
  console.log('Deploy awsSync: ', awsSync);
  console.log('Deploy awsCloudfront: ', awsCloudfront);
  console.log('Deploy env: ', env.env);
  console.log('Deploy bucket:', aws.params.Bucket);
  var publisher = awspublish.create(aws);
  return getGulpSrc('./cdn/**')
    .pipe(publisher.publish())
    .pipe(gulpif(awsCloudfront, cloudfront(cfSettings)))
    .pipe(gulpif(awsSync, publisher.sync(), publisher.cache()))
    .pipe(awspublish.reporter());
};

// return gulp src piped through awspublishRouter
// cache all files for 6 hours. Cache js and css files for 1 week
function getGulpSrc(src) {
  var routerConfig = {
    'cache': {
      'cacheTime': 3600,
      'sharedCacheTime': 604800
    },
    'routes': {
      '^static/.+$': {
        'cacheTime': 31536000
      }
    }
  }
  var htmlRoutes = getHTMLRoutes();
  routerConfig.routes[htmlRoutes] = {
    'headers': {
      'Content-Type': 'text/html'
    }
  }
  routerConfig.routes['^.+$'] = '$&';
  return gulp.src(src)
    .pipe(awspublishRouter(routerConfig));
}

function getHTMLRoutes() {
  var buildDir = fs.readdirSync('./cdn');
  var routesList = [];
  buildDir.forEach(function(fileName) {
    var pathFile = './cdn/' + fileName;
    if (fs.statSync(pathFile).isFile() === true) {
      if ( fileName.indexOf('.') === -1 ) {
        routesList.push('^' + fileName + '$');
      }
    }
  });
  return routesList.join('|');
}