'use strict';

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:MainCtrl
 * @requires accessimapEditeurDerApp.MainService
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'MainService',
        function($scope, $rootScope, $location, MainService) {
            
            $scope.mapFormat    = 'landscapeA4';
            $scope.legendFormat = 'landscapeA4';
            $scope.formats      = MainService.settings.FORMATS;

            $rootScope.iid = 1;
            $rootScope.getiid = function() {
                return $rootScope.iid++;
            };

            /**
             * @ngdoc function
             * @name  go
             * @description
             * Go to a specific path, by adding two parameters : mapFormat & legendFormat
             */
            var go = function(path) {
                $location
                    .path(path)
                    .search('mapFormat', $scope.mapFormat)
                    .search('legendFormat', $scope.legendFormat);
            };

            /**
             * @ngdoc method
             * @name  goToBlankPage
             * @methodOf accessimapEditeurDerApp.controller:MainCtrl
             * @description
             * Go to '/commonmap' path, by creating a blank svg & adding two parameters : mapFormat & legendFormat
             */
            $scope.goToBlankPage = function() {
                MainService.createBlankSvg($scope.mapFormat, $scope.legendFormat)
                    .then(function() {
                        go('/commonmap');
                    })
            }

            /**
             * @ngdoc method
             * @name  goToLocalMap
             * @methodOf accessimapEditeurDerApp.controller:MainCtrl
             * @description
             * Go to '/localmap' path, by adding two parameters : mapFormat & legendFormat
             */
            $scope.goToLocalMap = function() {
                go('/localmap');
            }

            /**
             * @ngdoc method
             * @name  goToExistingFile
             * @methodOf accessimapEditeurDerApp.controller:MainCtrl
             * @description
             * Go to '/globalmap' path, by adding two parameters : mapFormat & legendFormat
             */
            $scope.goToExistingFile = function() {
                go('/globalmap');
            }


    }]);
