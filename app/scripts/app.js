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
    'angularSpinner'
  ])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  });
