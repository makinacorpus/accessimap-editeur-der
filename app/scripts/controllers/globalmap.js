'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:GlobalmapCtrl
 * @description
 * # GlobalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('GlobalmapCtrl', ['$scope', '$http', 'usSpinnerService', 'initSvg', 'mapService', 'settings', 'exportService',
    function ($scope, $http, usSpinnerService, initSvg, mapService, settings, exportService) {

      var width = 1000,
          legendWidth = 300,
          height = width / Math.sqrt(2),
          margin = 10;

      var svg = d3.xml("data/France_all_regions_A4.svg", function(xml) {
        d3.select("#map").node().appendChild(xml.documentElement);
      });

      $scope.mapExport = exportService.mapExport;

}]);
