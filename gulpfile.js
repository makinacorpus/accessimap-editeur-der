'use strict';

var gulp = require('gulp'),
    
    // gulp modules
    autoprefixer = require('gulp-autoprefixer'),
    clean        = require('gulp-clean'),
    compass      = require('gulp-compass'),
    concat       = require('gulp-concat'),
    connect      = require('gulp-connect'),
    filter       = require('gulp-filter'),
    karmaRunner  = require('karma').Server,
    jscs         = require('gulp-jscs'),
    minifyHTML   = require('gulp-minify-html'),
    minifyCss    = require('gulp-minify-css'),
    ngdocs       = require('gulp-ngdocs'),
    ngTemplate   = require('gulp-ng-template'),
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
gulp.task('clean:js', function() {
    return gulp.src(config.js.dest).pipe(clean())
});
gulp.task('clean:doc', function() {
    return gulp.src(config.doc.dest).pipe(clean())
});

/**
 * Copy JS files to dist
 * with style checking
 */
gulp.task('copy:js', ['clean:js'], function() {

    var localFilter = filter(config.js.jscs.filter, {restore: true});

    return gulp.src(config.js.globs)
                // jscs
                .pipe(localFilter)
                .pipe(jscs())
                .pipe(jscs.reporter())
                // .pipe(jscs.reporter('fail'))
                .pipe(localFilter.restore)
                .pipe(gulp.dest(config.js.dest))
                .pipe(connect.reload()) ;
})

/**
 * Copy project's files to dist
 */
gulp.task('copy:assets', ['copy:bower'], function() {
    return gulp.src(config.assets.globs, {base: config.assets.base})
                .pipe(gulp.dest(config.assets.dest))
                .pipe(connect.reload())
})
gulp.task('copy:bower', function() {
    return gulp.src(config.bower_components.globs, {base: config.bower_components.base})
                .pipe(gulp.dest(config.bower_components.dest))
                .pipe(connect.reload())
})

gulp.task('check:jscs', function() {

    var localFilter = filter(config.js.jscs.filter, {restore: true});

    return gulp.src(config.js.globs)
                // jscs
                .pipe(localFilter)
                .pipe(jscs())
                .pipe(jscs.reporter('fail'));
})

gulp.task('build:templatejs', function() {
    gulp.src(config.templates.globs)
        .pipe(minifyHTML({empty: true, quotes: true}))
        .pipe(ngTemplate({
            moduleName: config.templates.moduleName,
            standalone: false,
            filePath: config.templates.filePath,
            prefix: 'scripts/'
        }))
        .pipe(gulp.dest('.tmp'))
        .pipe(connect.reload());
})

/**
 * Compile SASS files into CSS
 * Use of autoprefixer to be compatible with prefix vendor
 */
gulp.task('build:css', ['clean:css'], function() {
    return gulp.src(config.compass.globs)
            .pipe(compass(config.compass.options))
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(gulp.dest(config.compass.dest))
            .pipe(connect.reload());
})

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
                connect().use(
                    '/node_modules',
                    connect.static('./node_modules')
                ),
                connect.static(config.dist)
             ];
        }
    });
})

/**
 * Task for running test configured by test/karma.conf.js
 */
gulp.task('test', function(done) {
    new karmaRunner({
        configFile: config.karma.configFile,
        singleRun: true,
        reporters: ['progress', 'coverage', 'coveralls'],
    }, done).start();
})


gulp.task('watch:test', function(done) {
    new karmaRunner({
        configFile: config.karma.configFile,
        singleRun: false
    }, done).start();
})

/**
 * Projet's documentation, AngularJS specific
 */
gulp.task('doc', ['clean:doc'], function() {
    return gulp.src(config.js.globs)
                .pipe(ngdocs.process(config.doc.options))
                .pipe(gulp.dest(config.doc.dest))
})

/**
 * Main task to launch the server
 */
gulp.task('serve', ['build:css', 'connect', 'copy:js', 'copy:assets', 'build:templatejs', 'doc'], function() {

    // wachers configuration
    gulp.watch(config.compass.globs, ['build:css']);
    gulp.watch(config.js.globs, ['copy:js', 'doc']);
    gulp.watch(config.templates.globs, ['build:templatejs']);
    gulp.watch(config.assets.globs, ['copy:assets']);

    return gulp.src(config.homepage)
                .pipe(open({ uri: 'http://' + config.connect.host + ':' + config.connect.port }));

})

/**
 * Build task for packaging purposes
 * Will uglify / concat / rev files
 */
gulp.task('build', [/*'clean:dist', 'check:jscs',*/ 'build:css', 'build:templatejs', 'copy:assets', 'doc'], function () {
    return gulp.src('./app/index.html')
                .pipe(usemin({
                    css: [rev, minifyCss],
                    js: [rev],
                }))
                .pipe(gulp.dest(config.dist))
})