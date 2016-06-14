/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:HomeController
 * @requires $rootScope
 * @requires $location
 * 
 * @description
 * Controller of the Home View
 */
(function() {
    'use strict';

    function HomeController($rootScope, $location) {

        var $ctrl = this;

        $rootScope.displayFooter  = true;
    
        $ctrl.goToEdit         = goToEdit;

        function goToEdit() {
            $rootScope.displayFooter  = false;
            $location.path('/edit');
        }
    }

    angular.module(moduleApp).controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$location'];
})();