(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name accessimapEditeurDerApp
     * @description
     * Main module of the application.
     */
    var moduleApp = 'accessimapEditeurDerApp';

    window.moduleApp = moduleApp;

    angular
        .module(moduleApp, [
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
                    templateUrl: 'scripts/views/main/template.html',
                    controller: 'MainController',
                    controllerAs: '$ctrl'
                })
                .when('/edit', {
                    templateUrl: 'scripts/views/edit/template.html',
                    controller: 'EditController',
                    controllerAs: '$ctrl'
                })
                .when('/localmap', {
                    templateUrl: 'scripts/views/localmap/template.html',
                    controller: 'LocalmapController',
                    controllerAs: '$ctrl'
                })
                .when('/globalmap', {
                    templateUrl: 'scripts/views/globalmap/template.html',
                    controller: 'GlobalmapController',
                    controllerAs: '$ctrl'
                })
                .when('/commonmap', {
                    templateUrl: 'scripts/views/commonmap/template.html',
                    controller: 'CommonmapController',
                    controllerAs: '$ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .config(function(uiSelectConfig) {
            uiSelectConfig.dropdownPosition = 'down';
        });

})();