'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', '$location', 'settings', 'exportService', 'shareSvg', 'svgicon', 'geometryutils',
    function($rootScope, $scope, $location, settings, exportService, shareSvg, svgicon, geometryutils) {
      d3.select('#der')
        .selectAll('svg')
        .remove();
      shareSvg.getMap()
      .then(function(data) {
        if (data) {
          $scope.data = data;
          d3.select('#der')
            .node()
            .appendChild($scope.data);
        } else {
          $location.path('/');
        }
      });

      shareSvg.getLegend()
      .then(function(data) {
        if (data) {
          d3.select('#der-legend')
            .node()
            .appendChild(data);
        }
      });

      $scope.mode = 'default';
      $scope.styleChoices = [];
      $scope.styleChosen = $scope.styleChoices[0];

      $scope.featureIcon = svgicon.featureIcon;

      d3.select('svg').append("defs")
          .append("marker")
          .attr("id", "midmarker")
          .attr("refX", 2)
          .attr("refY", 2)
          .attr("markerWidth", 4)
          .attr("markerHeight", 4)
          .attr("orient", "auto")
        .append("circle")
          .attr("cx", "2")
          .attr("cy", "2")
          .attr("r", "2");


      function resetActions() {
        d3.selectAll('path')
          .on('click', function() {
          });
        d3.selectAll('svg')
          .on('click', function() {
          });
        d3.select('body')
          .on('keydown', function() {
          });
        d3.selectAll('path')
          .attr("marker-mid", null);
        $('#der').css('cursor', 'auto');
        d3.select('.ongoing').remove();
      }

      $scope.$watch('mode', function() {
        if ($scope.mode === 'default') {
          resetActions();
        }
        if ($scope.mode === 'delete') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          d3.selectAll('path')
            .on('click', function() {
              this.remove();
            });
          d3.selectAll('text')
            .on('click', function() {
              this.remove();
            });
        }
        if ($scope.mode === 'move') {
          resetActions();
          d3.selectAll('path')
            .attr("marker-mid", function(d) { return "url(#midmarker)"; })
            .on('click', function() {
              var _pathSegList = this.pathSegList;
              d3.select('svg')
                .on('click', function() {
                  var features = [];
                  angular.forEach(_pathSegList, function(point, index) {
                      if (point.x && point.y) {
                        features.push([point.x, point.y, index]);
                      }
                    });
                  var clickPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
                  
                  var nearest = geometryutils.nearest(clickPoint, features);

                  _pathSegList[nearest[2]].x = clickPoint[0];
                  _pathSegList[nearest[2]].y = clickPoint[1];
                });
            });
        }
        if ($scope.mode === 'point') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          $scope.styleChoices = settings.STYLES[$scope.mode];
          $scope.styleChosen = $scope.styleChoices[0];
          d3.select('svg')
            .on('click', function() {
              var coordinates = d3.mouse(this);
              var feature = d3.select('svg')
              .append('path')
              .attr('d', $scope.styleChosen.path(coordinates[0], coordinates[1], $scope.styleChosen.radius));
              angular.forEach($scope.styleChosen.style, function(attribute) {
                feature.attr(attribute.k, attribute.v);
              });
              console.log(feature)
              feature.append('actions')
              .append('action')
              .attr('id', '1');
              console.log(feature)
           })
        }
        if ($scope.mode === 'circle') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          $scope.styleChoices = settings.STYLES.polygon;
          $scope.styleChosen = $scope.styleChoices[0];
          d3.select('svg')
            .on('click', function() {
              var coordinates = d3.mouse(this);
              if (d3.select('.edition')[0][0]) {
                var feature = d3.select('.edition');
                var xOffset = coordinates[0] - feature.attr('cx');
                var yOffset = coordinates[1] - feature.attr('cy');
                var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                feature.attr('r', r);
                feature.classed('edition', false);
              } else {
                var feature = d3.select('svg')
                .append('circle')
                .attr('cx', coordinates[0])
                .attr('cy', coordinates[1])
                .attr({'class': 'edition'});
                angular.forEach($scope.styleChosen.style, function(attribute) {
                  feature.attr(attribute.k, attribute.v);
                });
              }
           })
           .on('mousemove', function() {
              var feature = d3.select('.edition');
              if (feature[0][0]) {
                var coordinates = d3.mouse(this);
                var xOffset = coordinates[0] - feature.attr('cx');
                var yOffset = coordinates[1] - feature.attr('cy');
                var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                feature.attr('r', r);
              }
           });
        }
        if ($scope.mode === 'line' || $scope.mode === 'polygon') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          $scope.styleChoices = settings.STYLES[$scope.mode];
          $scope.styleChosen = $scope.styleChoices[0];
          var lineEdit = [];
          var lastPoint = null;
          var lineFunction = d3.svg.line()
                         .x(function(d) { return d[0]; })
                         .y(function(d) { return d[1]; })
                         .interpolate('linear');
          d3.select('svg')
            .on('click', function() {
              var path;
              var pathInner;
              if (d3.select('.edition')[0][0]) {
                path = d3.select('.edition');
                if ($scope.mode === 'line'){
                  pathInner = d3.select('.edition.inner');
                }
              } else {
                lineEdit = [];
                path = d3.select('svg')
                .append('path')
                .attr({'class': 'edition'});
                angular.forEach($scope.styleChosen.style, function(attribute) {
                  path.attr(attribute.k, attribute.v);
                });
                if ($scope.mode === 'line'){
                  pathInner = d3.select('svg')
                  .append('path')
                  .attr({'class': 'edition inner'});
                  angular.forEach($scope.styleChosen.style_inner, function(attribute) {
                    pathInner.attr(attribute.k, attribute.v);
                  });
                }
              }
              var coordinates = d3.mouse(this);
              lastPoint = coordinates;
              lineEdit.push(coordinates);
              path.attr({
                d: lineFunction(lineEdit)
              });

              if ($scope.mode === 'line'){
                pathInner.attr({
                  d: lineFunction(lineEdit)
                });
              } 
              angular.forEach($scope.styleChosen.style, function(attribute) {
                path.attr(attribute.k, attribute.v);
              });

              if ($scope.mode === 'line'){
                angular.forEach($scope.styleChosen.style_inner, function(attribute) {
                  pathInner.attr(attribute.k, attribute.v);
                });
              }
            })
            .on('dblclick', function() {
              if ($scope.mode === 'polygon') {
                var a = d3.select('.edition').attr('d');
                a = a.replace(a.substr(a.lastIndexOf('L')), '')
                d3.select('.edition').attr({
                  d: a + 'Z'
                });
              }
              d3.select('.edition').classed('edition', false);

              if ($scope.mode === 'line'){
                d3.select('.edition.inner').classed('edition', false);
              }
              d3.select('.ongoing').remove();
              lastPoint = null;
            })
            .on('mousemove', function() {
              if (lastPoint) {
                var line;
                if (d3.select('.ongoing')[0][0]) {
                  line = d3.select('.ongoing');
                } else {
                  line = d3.select('svg')
                    .append('line')
                    .attr({'class': 'ongoing'});
                  angular.forEach($scope.styleChosen.style, function(attribute) {
                    line.attr(attribute.k, attribute.v);
                  });
                }
                var coordinates = d3.mouse(this);
                line.attr('x1', lastPoint[0])
                  .attr('y1', lastPoint[1])
                  .attr('x2', coordinates[0])
                  .attr('y2', coordinates[1]);
              }
            });
        }
        if ($scope.mode === 'addtext') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          d3.select('svg')
            .on('click', function() {
              // the previously edited text should not be edited anymore
              d3.select('.braille.edition').classed('edition', false);
              var coordinates = d3.mouse(this);
              d3.select('svg')
                .append('text')
                .attr('x', coordinates[0])
                .attr('y', coordinates[1])
                .attr('font-family', 'braille')
                .attr('font-size', '20px')
                .attr({'class': 'braille edition'})
                .text('');
              d3.select('body')
                .on('keydown', function() {
                  window.onkeydown = function(e) {
                    return (e.keyCode !== 32);
                  };
                  var newChar = String.fromCharCode(d3.event.keyCode).toLowerCase();
                  var newText = d3.select('.braille.edition').text() + newChar;
                  d3.select('.braille.edition').text(newText);
              });
           });
        }
      });

      $scope.mapExport = exportService.mapExport;
  }]);
