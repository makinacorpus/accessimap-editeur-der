'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', '$location', 'settings', 'exportService', 'shareSvg', 'editSvg',
    function ($rootScope, $scope, $location, settings, exportService, shareSvg, editSvg) {
      d3.select("#der")
        .selectAll("svg")
        .remove();
      shareSvg.getSvg()
      .then(function(data) {
        if (data) {
          $scope.data = data;
          d3.select("#der")
            .node()
            .appendChild($scope.data);
        } else{
          $location.path('/')
        };
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
        d3.select("body")
          .on("keydown", function() {
          });
        $('#der').css('cursor','auto');
        d3.select(".ongoing").remove();
      }

      $scope.$watch('mode', function() {
        if ($scope.mode == 'default') {
          resetActions();
        };
        if ($scope.mode == 'delete') {
          resetActions();
          $('#der').css('cursor','crosshair');
          d3.selectAll("path")
            .on("click", function(d,i) {
              this.remove();
            });
          d3.selectAll("text")
            .on("click", function(d,i) {
              this.remove();
            });
        };
        if ($scope.mode == 'addpoint') {
          resetActions();
          $('#der').css('cursor','crosshair');
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
          $('#der').css('cursor','crosshair');
          var lineEdit = [];
          var lastPoint = null;
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
              lastPoint = coordinates;
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
              d3.select(".ongoing").remove();
              lastPoint = null;
            })
            .on("mousemove", function(d,i) {
              if(lastPoint) {
                var line;
                if (d3.select(".ongoing")[0][0]) {
                  line = d3.select(".ongoing")
                } else{
                  line = d3.select("svg")
                    .append("line")
                    .attr({"class": "ongoing"});
                  angular.forEach($scope.styleChosen.style, function(attribute) {
                    line.attr(attribute.k, attribute.v);
                  });
                };
                var coordinates = d3.mouse(this);
                line.attr("x1", lastPoint[0])
                  .attr("y1", lastPoint[1])
                  .attr("x2", coordinates[0])
                  .attr("y2", coordinates[1]);
              };
            });
        };
        if ($scope.mode == 'addtext') {
          resetActions();
          $('#der').css('cursor','crosshair');
          d3.select("svg")
            .on("click", function(d,i) {
              // the previously edited text should not be edited anymore
              d3.select(".braille.edition").classed('edition', false);
              var coordinates = d3.mouse(this);
              d3.select("svg")
                .append("text")
                .attr("x", coordinates[0])
                .attr("y", coordinates[1])
                .attr("font-size", "20px")
                .attr({"class": "braille edition"})
                .text("");
              d3.select("body")
                .on("keydown", function() {
                  window.onkeydown = function(e) { 
                    return !(e.keyCode == 32);
                  };
                  var newChar = String.fromCharCode(d3.event.keyCode).toLowerCase();
                  var newText = d3.select(".braille.edition").text() + newChar;
                  d3.select(".braille.edition").text(newText);
              });
           });
        };
      });

      $scope.mapExport = exportService.mapExport;
  }]);
