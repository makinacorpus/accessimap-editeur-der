'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:GlobalmapCtrl
 * @description
 * # GlobalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('GlobalmapCtrl', ['$scope', '$rootScope', '$http', '$location', 'usSpinnerService',
    'initSvg', 'mapService', 'settings', 'exportService', 'shareSvg',
    function($scope, $rootScope, $http, $location, usSpinnerService,
      initSvg, mapService, settings, exportService, shareSvg) {

      $scope.mapCategories = [{
        id: 'world',
        name: 'Monde',
        images: [{
          path: 'data/BlankMap-World6-Equirectangular.svg'
        }]
      }, {
        id: 'france',
        name: 'France',
        images: [{
          path: 'data/France_all_regions_A4.svg'
        }]
      }];

      function appendSvg(path) {
        $scope.accordionStyle = {display: 'none'};
        d3.xml(path, function(xml) {
          shareSvg.addSvg(xml.documentElement)
          .then(function() {
            $location.path('/commonmap');
          });
        });
      }

      $scope.mapExport = exportService.mapExport;
      $scope.appendSvg = appendSvg;

}]);
