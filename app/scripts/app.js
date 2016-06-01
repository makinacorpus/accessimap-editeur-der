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
            'ui.select',
            'ui.bootstrap',
            'ui.bootstrap-slider'
        ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'scripts/views/home/template.html',
                    controller: 'HomeController',
                    controllerAs: '$ctrl'
                })
                .when('/edit', {
                    templateUrl: 'scripts/views/edit/template.html',
                    controller: 'EditController',
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