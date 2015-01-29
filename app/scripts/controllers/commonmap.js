'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', 'settings', 'exportService', 'shareSvg', 'editSvg',
    function ($rootScope, $scope, settings, exportService, shareSvg, editSvg) {
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
      $scope.styleChoices = settings.STYLES;
      $scope.styleChosen = $scope.styleChoices[0];

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
              d3.select("svg")
              .append("path")
              .style("stroke", "gray")
              .style("fill", "black")
              .attr("d", editSvg.circlePath(coordinates[0], coordinates[1], 5));
           });
        };
        if ($scope.mode == 'addline' || $scope.mode == 'addpolygon') {
          resetActions();
          var lineEdit = [];
          var lineFunction = d3.svg.line()
                         .x(function(d) { return d[0]; })
                         .y(function(d) { return d[1]; })
                         .interpolate("linear");
          d3.select("svg")
            .on("click", function(d,i) {
              var path;
              if (d3.select(".edition")[0][0]) {
                path = d3.select(".edition")
              } else{
                lineEdit = [];
                path = d3.select("svg")
                .append("path")
                .attr({"class": "edition"});
                angular.forEach($scope.styleChosen.style, function(attribute) {
                  path.attr(attribute.k, attribute.v);
                });
              };
              var coordinates = d3.mouse(this);
              lineEdit.push(coordinates);
              path.attr({
                d: lineFunction(lineEdit)
              });
            })
            .on("dblclick", function(d,i) {
              if ($scope.mode == 'addpolygon') {
                var a = d3.select(".edition").attr("d");
                d3.select(".edition").attr({
                  d: a + 'Z'
                });
              };
              d3.select(".edition").classed('edition', false)
            });
        };
      });

      $scope.mapExport = exportService.mapExport;
  }]);
