'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', 'exportService', 'shareSvg',
    function ($rootScope, $scope, exportService, shareSvg) {
      d3.select("#der")
        .selectAll("svg")
        .remove();
      shareSvg.getSvg()
      .then(function(data) {
        $scope.data = data;
        d3.select("#der")
          .node()
          .appendChild($scope.data);
      });

      $scope.mode = 'default';

      $scope.$watch('mode', function() {
        if ($scope.mode == 'default') {
          d3.selectAll("path")
            .on("click", function(d,i) {
            });
        };
        if ($scope.mode == 'delete') {
          d3.selectAll("path")
            .on("click", function(d,i) {
              this.remove();
            });
        };
      });

      $scope.mapExport = exportService.mapExport;
  }]);
