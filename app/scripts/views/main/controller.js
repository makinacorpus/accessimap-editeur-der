/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:MainController
 * @requires accessimapEditeurDerApp.MainService
 * @description
 * # MainController
 * Controller of the accessimapEditeurDerApp
 */
(function() {
    'use strict';

    function MainController($scope, $rootScope, $location, MainService) {

        var $ctrl = this;
    
        $ctrl.mapFormat        = 'landscapeA4';
        $ctrl.legendFormat     = 'landscapeA4';
        $ctrl.formats          = MainService.settings.FORMATS;
    
        $ctrl.goToBlankPage    = goToBlankPage;
        $ctrl.goToLocalMap     = goToLocalMap;
        $ctrl.goToExistingFile = goToExistingFile;

        /**
         * @ngdoc method
         * @name  go
         * @methodOf accessimapEditeurDerApp.controller:MainController
         * @description
         * Go to a specific path, by adding two parameters :
         * - mapFormat
         * - legendFormat
         */
        function go(path) {
            $location
                .path(path)
                .search('mapFormat', $ctrl.mapFormat)
                .search('legendFormat', $ctrl.legendFormat);
        };

        /**
         * @ngdoc method
         * @name  goToBlankPage
         * @methodOf accessimapEditeurDerApp.controller:MainController
         * @description
         * Go to '/commonmap' path,
         * by creating a blank svg & adding two parameters :
         * - mapFormat
         * - legendFormat
         */
        function goToBlankPage() {
            MainService.createBlankSvg($ctrl.mapFormat, $ctrl.legendFormat)
                .then(function() {
                    go('/commonmap');
                })
        }

        /**
         * @ngdoc method
         * @name  goToLocalMap
         * @methodOf accessimapEditeurDerApp.controller:MainController
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
         * @methodOf accessimapEditeurDerApp.controller:MainController
         * @description
         * Go to '/globalmap' path, by adding two parameters
         * - mapFormat
         * - legendFormat
         */
        function goToExistingFile() {
            go('/globalmap');
        }
    }

    angular.module('accessimapEditeurDerApp')
           .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$rootScope', '$location', 'MainService'];
})();