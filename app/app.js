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
            'ui.bootstrap-slider',
            'ui.bootstrap.tabs',
            'ui.bootstrap.tooltip',
            'bootstrap.fileField'
        ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'scripts/routes/home/template.html',
                    controller: 'HomeController',
                    controllerAs: '$ctrl'
                })
                .when('/edit', {
                    templateUrl: 'scripts/routes/edit/template.html',
                    controller: 'EditController',
                    controllerAs: '$ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .config(function(uiSelectConfig) {
            uiSelectConfig.dropdownPosition = 'down';
        })
        // .config(function ($opbeatProvider) {
        //     $opbeatProvider.config({
        //         orgId: '43f4c77b74f64097ab04194c87d98086',
        //         appId: '7bcd582124'
        //     })
        // });

})();
