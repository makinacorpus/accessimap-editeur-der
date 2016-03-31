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
    jscs         = require('gulp-jscs'),
    ngdocs       = require('gulp-ngdocs'),
    open         = require('gulp-open'),
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
gulp.task('clean:doc', function() {
    return gulp.src(config.doc.dest).pipe(clean())
});

/**
 * Copy files to dist, with specific transformations, depending on file's type
 */
gulp.task('copy:js', function() {

    var localFilter = filter(config.js.jscs.filter, {restore: true});

    return gulp.src(config.js.globs)
                // jscs
                .pipe(localFilter)
                .pipe(jscs())
                .pipe(jscs.reporter())
                // .pipe(jscs.reporter('fail'))
                .pipe(localFilter.restore)
                .pipe(gulp.dest(config.dist))
                .pipe(connect.reload()) ;
})

gulp.task('copy:else', function() {
    return gulp.src([ config.app + '/**/*',
                    '!' + config.js.globs,
                    '!' + config.compass.globs])
                .pipe(gulp.dest(config.dist))
                .pipe(connect.reload())
})

gulp.task('usemin', ['compass'], function () {
    return gulp
                .src('./app/index.html')
                .pipe(usemin(config.usemin))
                .pipe(print())
                .pipe(rev())
                .pipe(print())
                .pipe(gulp.dest(config.dist))
});

/**
 * Compile SASS files into CSS
 * Use of autoprefixer to be compatible with prefix vendor
 */
gulp.task('compass', ['clean:css'], function() {
    return gulp.src(config.compass.globs)
            .pipe(compass(config.compass.options))
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(gulp.dest('.tmp/styles'))
            .pipe(connect.reload());
});

/**
 * Launch an express server pointing a local directory, mainly ./dist
 * with livereload enabled
 */
gulp.task('connect', function() {
    return connect.server({
        port: config.connect.port,
        host: config.connect.host,
        root: config.dist,
        livereload: true,
        middleware: function (connect) {
            return [
                connect.static('.tmp'),
                connect().use(
                    config.doc.dest,
                    connect.static(config.doc.dest)
                ),
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
gulp.task('serve', ['compass', 'connect', 'copy:js', 'copy:else', 'doc'], function() {

    // wachers configuration
    gulp.watch(config.compass.globs, ['compass']);
    gulp.watch(config.js.globs, ['copy:js']);
    gulp.watch([ config.app + '/**/*',
                    '!' + config.js.globs,
                    '!' + config.compass.globs], ['copy:else']);

    return gulp.src(config.homepage)
                .pipe(open({ uri: 'http://' + config.connect.host + ':' + config.connect.port }));

});

/**
 * Build task for packaging purposes
 * Will uglify / concat / rev files
 */
gulp.task('build', ['clean:dist', 'usemin', 'doc'], function() {

})

/**
 * Projet's documentation, AngularJS specific
 */
gulp.task('doc', ['clean:doc'], function() {
    return gulp.src(config.js.globs)
                .pipe(ngdocs.process(config.doc.options))
})