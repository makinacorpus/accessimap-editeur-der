// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-01-13 using
// generator-karma 0.8.3

module.exports = function(config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
          'bower_components/angular/angular.js',
          'bower_components/jquery/dist/jquery.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-touch/angular-touch.js',
          'bower_components/spin.js/spin.js',
          'bower_components/angular-spinner/angular-spinner.js',
          'bower_components/d3/d3.js',
          'bower_components/angular-ui-select/dist/select.js',
          'bower_components/select2/select2.js',
          // 'bower_components/bootstrap/dist/js/bootstrap.js',
          // 'bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js',
          'bower_components/angular-bootstrap-slider/slider.js',
          'bower_components/angular-ui-grid/ui-grid.js',
          'app/scripts/vendor/d3.geo.tile.v0.min.js',
          'app/scripts/vendor/osmtogeojson.js',
          'app/scripts/vendor/textures.js',
          'app/scripts/app.js',
          'app/scripts/commons/**/*.js',
          'app/scripts/filters/**/*.js',
          'app/scripts/routes/**/*.js',
          // 'test/mock/**/*.js',
          'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
          'PhantomJS'
        ],

        // Code coverage report
        reporters: ['progress', 'coverage', 'coveralls'],
        preprocessors: {
            'app/scripts/app.js': ['coverage'],
            'app/scripts/commons/*.js': ['coverage'],
            'app/scripts/filters/*.js': ['coverage'],
            'app/scripts/routes/*.js': ['coverage']
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        // Which plugins to enable
        plugins: [
          'karma-phantomjs-launcher',
          'karma-jasmine',
          'karma-coverage',
          'karma-coveralls'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
