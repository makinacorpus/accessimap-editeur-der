'use strict';

/**
 * @ngdoc overview
 * @name accessimapEditeurDerApp
 * @description
 * # accessimapEditeurDerApp
 *
 * Main module of the application.
 */
angular
    .module('accessimapEditeurDerApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angularSpinner',
        'ui.select',
        'ui.bootstrap-slider',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.autoResize'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/localmap', {
                templateUrl: 'views/localmap.html',
                controller: 'LocalmapCtrl'
            })
            .when('/globalmap', {
                templateUrl: 'views/globalmap.html',
                controller: 'GlobalmapCtrl'
            })
            .when('/commonmap', {
                templateUrl: 'views/commonmap.html',
                controller: 'CommonmapCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
