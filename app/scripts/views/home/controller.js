/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:HomeController
 * @requires accessimapEditeurDerApp.HomeService
 * @description
 * # HomeController
 * Controller of the accessimapEditeurDerApp
 */
(function() {
    'use strict';

    function HomeController($scope, $rootScope, $location, HomeService) {

        var $ctrl = this;

        $rootScope.displayFooter  = true;
    
        $ctrl.mapFormat        = 'landscapeA4';
        $ctrl.legendFormat     = 'landscapeA4';
        $ctrl.formats          = HomeService.settings.FORMATS;
    
        $ctrl.goToEdit         = goToEdit;
        $ctrl.goToBlankPage    = goToBlankPage;
        $ctrl.goToLocalMap     = goToLocalMap;
        $ctrl.goToExistingFile = goToExistingFile;

        /**
         * @ngdoc method
         * @name  go
         * @methodOf accessimapEditeurDerApp.controller:HomeController
         * @description
         * Go to a specific path, by adding two parameters :
         * - mapFormat
         * - legendFormat
         */
        function go(path) {
            $rootScope.displayFooter  = false;
            $location
                .path(path)
                .search('mapFormat', $ctrl.mapFormat)
                .search('legendFormat', $ctrl.legendFormat);
        };

        /**
         * @ngdoc method
         * @name  goToBlankPage
         * @methodOf accessimapEditeurDerApp.controller:HomeController
         * @description
         * Go to '/commonmap' path,
         * by creating a blank svg & adding two parameters :
         * - mapFormat
         * - legendFormat
         */
        function goToBlankPage() {
            HomeService.createBlankSvg($ctrl.mapFormat, $ctrl.legendFormat)
                .then(function() {
                    go('/commonmap');
                })
        }

        /**
         * @ngdoc method
         * @name  goToLocalMap
         * @methodOf accessimapEditeurDerApp.controller:HomeController
         * @description
         * Go to '/localmap' path, by adding two parameters
         * - mapFormat
         * - legendFormat
         */
        function goToLocalMap() {
            go('/localmap');
        }

        /**
         * @ngdoc method
         * @name  goToExistingFile
         * @methodOf accessimapEditeurDerApp.controller:HomeController
         * @description
         * Go to '/globalmap' path, by adding two parameters
         * - mapFormat
         * - legendFormat
         */
        function goToExistingFile() {
            go('/globalmap');
        }

        function goToEdit() {
            $rootScope.displayFooter  = false;
            $location.path('/edit');
        }
    }

    angular.module(moduleApp)
           .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$rootScope', '$location', 'HomeService'];
})();