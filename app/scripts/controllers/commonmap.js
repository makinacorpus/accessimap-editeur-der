'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', 'exportService', 'shareSvg', 'editSvg',
    function ($rootScope, $scope, exportService, shareSvg, editSvg) {
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

      function resetActions() {
        d3.selectAll("path")
          .on("click", function(d,i) {
          });
        d3.selectAll("svg")
          .on("click", function(d,i) {
          });
      }

      $scope.$watch('mode', function() {
        if ($scope.mode == 'default') {
          resetActions();
        };
        if ($scope.mode == 'delete') {
          resetActions();
          d3.selectAll("path")
            .on("click", function(d,i) {
              this.remove();
            });
        };
        if ($scope.mode == 'addpoint') {
          resetActions();
          d3.select("svg")
            .on("click", function(d,i) {
              var coordinates = d3.mouse(this);
              console.log(editSvg.circlePath(coordinates[0], coordinates[1], 5))
              d3.select("svg")
              .append("path")
              .style("stroke", "gray")
              .style("fill", "black")
              .attr("d", editSvg.circlePath(coordinates[0], coordinates[1], 5));
           });
        };
      });

      $scope.mapExport = exportService.mapExport;
  }]);
