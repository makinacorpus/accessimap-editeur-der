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
        basePath: './',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',

            'app/vendor/dom-to-image.js',
            'bower_components/jszip/dist/jszip.js',

            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/d3/d3.js',
            'bower_components/angular-ui-select/dist/select.js',
            'bower_components/select2/select2.js',
            'bower_components/angular-bootstrap-slider/slider.js',

            'bower_components/file-saver.js/FileSaver.js',
            'bower_components/turf/turf.min.js',
            'bower_components/pdfjs-dist/build/pdf.combined.js',
            'bower_components/leaflet/dist/leaflet.js',

            'app/**/*.js',
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
        reporters: ['coverage' /*, 'coveralls' */],

        preprocessors: {
            'app/app.js': ['coverage' /*, 'coveralls'*/],
            'app/{routes,filters,services}/**/*.js': ['coverage' /*, 'coveralls'*/]
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        // Which plugins to enable
        plugins: [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-phantomjs-launcher',
          'karma-jasmine',
          'karma-coverage',
          'karma-coveralls'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};