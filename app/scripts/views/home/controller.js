/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:HomeController
 * @requires $rootScope
 * @requires $location
 * @requires accessimapEditeurDerApp.settings
 * 
 * @description
 * Controller of the Home View
 */
(function() {
    'use strict';

    function HomeController($rootScope, $location, settings) {

        var $ctrl = this;

        $rootScope.displayFooter  = true;
    
        $ctrl.mapFormat        = 'landscapeA4';
        $ctrl.legendFormat     = 'landscapeA4';
        $ctrl.formats          = settings.FORMATS;
    
        $ctrl.goToEdit         = goToEdit;

        function goToEdit() {
            $rootScope.displayFooter  = false;
            $location.path('/edit');
        }
    }

    angular.module(moduleApp).controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$location', 'settings'];
})();