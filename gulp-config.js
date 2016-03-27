'use strict';

var filter       = require('gulp-filter');

var app = './app/',
    dist = './dist/';

module.exports = {
    app: app,
    dist: dist,
    compass: {
        css: '.tmp/styles',
        sass: app + '/styles',
        import_path: 'bower_components',
    },
    autoprefixer: {
        browsers: ['last 1 version'],
        cascade: true
    },
    karma: {
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true,
        reporters: ['progress']
    },
    js: {
        globs: app + 'scripts/**/*.js',
        jshint: {
            filter: filter([ app + 'scripts/**/*.js', '!' + app + 'scripts/vendor/**/*.js' ], {restore: true}),
            reporter: require('jshint-stylish')
        }
    },
    doc: {
        dest: './docs/',
        options: {
            title: 'Editeur Documents en reliefs (DER)',
            html5Mode: false
        }
    }
};