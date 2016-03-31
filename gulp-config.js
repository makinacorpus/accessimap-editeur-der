'use strict';

var app = './app/',
    dist = './dist/';

module.exports = {
    app: app,
    dist: dist,
    homepage: dist + 'index.html',
    compass: {
        globs: app + 'styles/*.scss',
        options: {
            css: '.tmp/styles',
            sass: app + '/styles',
            import_path: 'bower_components'
        }
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
        jscs: {
            filter: ['**/*.js', '!**/vendor/**'],
            reporter: require('jshint-stylish')
        }
    },
    doc: {
        dest: './docs/',
        globs: [app + 'scripts/**/*.js', '!' + app + 'scripts/vendor/**/*.js'],
        options: {
            title: 'Editeur Documents en reliefs (DER)',
            readme: 'README.md',
            html5Mode: false
        }
    },
    usemin: {
        // js: [function() { console.log('hello world'); return uglify() }]
        // in this case css will be only concatenated (like css: ['concat'])
    },
    connect: {
        port: 8080,
        host: 'localhost'
    }
};