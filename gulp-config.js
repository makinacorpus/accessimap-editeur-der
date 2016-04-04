'use strict';

var app = './app/',
    dist = './dist/',
    moduleName = 'accessimapEditeurDerApp';

module.exports = {
    app: app,
    dist: dist,
    homepage: dist + 'index.html',
    compass: {
        globs: app + 'assets/styles/*.scss',
        options: {
            css: '.tmp/styles',
            sass: app + 'assets/styles',
            import_path: 'bower_components'
        }
    },
    autoprefixer: {
        browsers: ['last 1 version'],
        cascade: true
    },
    karma: {
        configFile: __dirname + '/karma.conf.js'
    },
    js: {
        globs: app + 'scripts/**/*.js',
        dest: dist + 'scripts/',
        jscs: {
            filter: ['**/*.js', '!**/vendor/**'],
            reporter: require('jshint-stylish')
        }
    },
    doc: {
        dest: dist + 'docs/',
        globs: [app + 'scripts/**/*.js', '!' + app + 'scripts/vendor/**/*.js'],
        options: {
            title: 'Editeur Documents en reliefs (DER)',
            readme: 'README.md',
            html5Mode: false
        }
    },
    assets: {
        globs: [ app + '*', 
                app + 'assets/**/*', 
                '!' + app + 'assets/**/*.{zip,scss}'],
        base: './app',
        dest: dist
    },
    bower_components: {
        globs: 'bower_components/{fontawesome,bootstrap-sass-official}/**',
        base: './',
        dest: dist + 'assets/'
    },
    templates: {
        moduleName: moduleName,
        globs: app + 'scripts/**/*.html',
        filePath: 'scripts/templates.js'
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