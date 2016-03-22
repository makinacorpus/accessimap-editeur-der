'use strict';

var gulp = require('gulp'),
    
    // gulp modules
    autoprefixer = require('gulp-autoprefixer'),
    clean        = require('gulp-clean'),
    compass      = require('gulp-compass'),
    concat       = require('gulp-concat'),
    connect      = require('gulp-connect'),
    filter       = require('gulp-filter'),
    karma_runner = require('karma').Server,
    jshint       = require('gulp-jshint'),
    print        = require('gulp-print'),
    rev          = require('gulp-rev'),
    uglify       = require('gulp-uglify'),
    usemin       = require('gulp-usemin'),
    watch        = require('gulp-watch'),
    wiredep      = require('wiredep'),

    // local config
    config       = require('./gulp-config');

// default task
gulp.task('default', ['serve']);

/**
 * Clean the directory used to locally deploy files
 */
gulp.task('clean:dist', function() {
    return gulp.src(config.dist).pipe(clean())
});
gulp.task('clean:css', function() {
    return gulp.src('.tmp/styles/*').pipe(clean())
});

/**
 * Copy files to dist, with specific transformations, depending on file's type
 */
gulp.task('copy:js', function() {
    return gulp.src(config.js.globs)

                // jshint
                .pipe(config.js.jshint.filter)
                .pipe(print())
                .pipe(jshint())
                .pipe(jshint.reporter(config.js.jshint.reporter))
                .pipe(config.js.jshint.filter.restore)

                .pipe(gulp.dest(config.dist))

                .pipe(rev())
                .pipe(gulp.dest(config.dist))

                .pipe(rev.manifest())
                .pipe(gulp.dest(config.dist))

                .pipe(connect.reload())
})

gulp.task('usemin', function () {
  return gulp.src('./app/index.html')
        .pipe(usemin({
            js: [uglify()]
            // in this case css will be only concatenated (like css: ['concat']). 
        }))
        .pipe(rev())
        .pipe(gulp.dest(config.dist))
});

gulp.task('copy:css', function() {
    
})

gulp.task('copy:html', function() {
    
})

/**
 * Compile SASS files into CSS
 */
gulp.task('compass', ['clean:css'], function() {
    gulp.src(config.app + '/styles/*.scss')
            .pipe(compass(config.compass))
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(gulp.dest('.tmp/styles'))
            .pipe(connect.reload());
});

/**
 * Launch an express server pointing a local directory, mainly ./dist
 * listening to files modifications & reloading automatically
 */
gulp.task('connect', function() {
  return connect.server({
    root: config.dist,
    livereload: true,
    middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(config.app)
             ];
          }
  });
});

/**
 * Task for running test configured by test/karma.conf.js
 */
gulp.task('test', function(done) {
    new karma_runner(config.karma, done).start();
})

/**
 * Main task to launch the server
 */
gulp.task('serve', ['clean:dist', 'compass', 'connect'], function() {

    // gulp.watch(config.app + '/styles/*.scss', ['compass']);

    return gulp.src(config.app + '/**/*')
                // .pipe(watch(config.app + '/**/*'))
                .pipe(gulp.dest(config.dist))
                .pipe(connect.reload())
});

gulp.task('build', ['clean:dist', 'compass'], function() {

})