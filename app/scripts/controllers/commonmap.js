'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('CommonmapCtrl', ['$rootScope', '$scope', '$location', 'settings', 'exportService',
    'shareSvg', 'svgicon', 'geometryutils',
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

      $scope.filename = 'map';
      $scope.fonts = settings.FONTS;
      $scope.fontChosen = $scope.fonts[0];
      $scope.colors = settings.COLORS;
      $scope.colorChosen = $scope.colors[$scope.fontChosen.color][0];
      $scope.mode = 'default';
      $scope.styleChoices = [];
      $scope.styleChosen = $scope.styleChoices[0];
      $scope.deletedFeature = null;
      $scope.checkboxModel = {
        contour: false,
        fill: false,
      };

      $scope.interactionFilters = {
        'f0': {
          name: 'Aucune interaction'
        },
        'f1': {
          name: 'filtre numéro 1'
        },
        'f2': {
          name: 'filtre numéro 2'
        }
      };

      $scope.interaction = {};

      $scope.featureIcon = svgicon.featureIcon;

      d3.select('svg').append('defs')
          .append('marker')
          .attr('id', 'midmarker')
          .attr('refX', 2)
          .attr('refY', 2)
          .attr('markerWidth', 4)
          .attr('markerHeight', 4)
          .attr('orient', 'auto')
        .append('circle')
          .attr('cx', '2')
          .attr('cy', '2')
          .attr('r', '2');


      $scope.changeColor = function() {
          $scope.colorChosen = $scope.colors[$scope.fontChosen.color][0];
      };

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
          .attr('marker-mid', null);
        $('#der').css('cursor', 'auto');
        d3.select('.ongoing').remove();
        d3.selectAll('.blink').classed('blink', false);
      }


      function selectElementContents(el) {
          var range = document.createRange();
          range.selectNodeContents(el);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      }

      function deleteOnClick(el) {
        el.on('click', function() {
          // Some objects should not be deletable
          if(!d3.select(this).classed('notDeletable')) {
            var _this = this;
            $scope.$apply(function() {
              $scope.deletedFeature = new XMLSerializer().serializeToString(_this);
            });
            var t = document.createElement('foreignObject');
            d3.select(t).attr('id', 'deletedElement');
            this.parentNode.insertBefore(t, this);
            this.remove();
          }
        });
      }

      $scope.$watch('mode', function() {
        if ($scope.mode === 'default') {
          resetActions();
        }
        if ($scope.mode === 'delete') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          // Remove previous deleted Element placeholder if it exists
          d3.select('#deletedElement').remove();
          deleteOnClick(d3.selectAll('path'));
          deleteOnClick(d3.selectAll('circle'));
          deleteOnClick(d3.selectAll('text'));
        }
        if ($scope.mode === 'undo') {
          resetActions();
          if ($scope.deletedFeature) {
            var deletedElement = d3.select('#deletedElement').node();
            var t = document.createElement('path');
            d3.select(t).attr('id', 'restoredElement');
            deletedElement.parentNode.insertBefore(t, deletedElement);
            d3.select('#restoredElement').node()
              .outerHTML = $scope.deletedFeature;
            d3.select('#deletedElement').remove();
            $scope.deletedFeature = null;
          }
        }
        if ($scope.mode === 'move') {
          resetActions();
          d3.selectAll('path:not(.notDeletable)')
            .attr('marker-mid', function() { return 'url(#midmarker)'; })
            .on('click', function() {
              d3.selectAll('.blink').classed('blink', false);
              d3.select(this).classed('blink', true);
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
        if ($scope.mode === 'interaction') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          // Add filters to SVG if they don't exist
          if (d3.select('filters').empty()) {
            var filters = d3.select('#der')
              .select('svg')
              .append('filters');
            filters.append('filter')
              .attr('id', 'f0')
              .attr('name', 'Aucune interaction')
              .attr('expandable', 'false');
            filters.append('filter')
              .attr('id', 'f1')
              .attr('name', 'filtre numéro 1')
              .attr('expandable', 'true');
            filters.append('filter')
              .attr('id', 'f2')
              .attr('name', 'filtre numéro 2')
              .attr('expandable', 'true');
          }

          // Make the selected feature blink
          d3.selectAll('path')
            .on('click', function() {
              d3.selectAll('.blink').classed('blink', false);
              var feature = d3.select(this);
              feature.classed('blink', true);
              var bbox = feature[0][0].getBBox();
              if (feature.select('actions').empty()) {
                $scope.$apply(function() {
                  $scope.interaction = {};
                });
                feature.append('actions')
                  .append('action')
                  .attr('filter', $scope.interaction.filter)
                  .attr('protocol', $scope.interaction.protocol)
                  .attr('value', $scope.interaction.value)
                  .attr('x', bbox.x)
                  .attr('y', bbox.y)
                  .attr('width', bbox.width)
                  .attr('height', bbox.height);
              } else {
                $scope.$apply(function() {
                  $scope.interaction.filter = feature.select('actions').select('action').attr('filter');
                  $scope.interaction.protocol = feature.select('actions').select('action').attr('protocol');
                  $scope.interaction.value = feature.select('actions').select('action').attr('value');
                });
              }
              $scope.$watch('interaction.filter', function() {
                d3.selectAll('.blink')
                  .select('actions')
                  .select('action')
                  .attr('filter', $scope.interaction.filter);
              });
              $scope.$watch('interaction.protocol', function() {
                d3.selectAll('.blink')
                  .select('actions')
                  .select('action')
                  .attr('protocol', $scope.interaction.protocol);
              });
              $scope.$watch('interaction.value', function() {
                d3.selectAll('.blink')
                  .select('actions')
                  .select('action')
                  .attr('value', $scope.interaction.value);
              });
            });
          d3.selectAll('circle')
            .on('click', function() {
              d3.selectAll('.blink').classed('blink', false);
              var feature = d3.select(this);
              feature.classed('blink', true);
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
                var k = attribute.k;
                var v = attribute.v;
                if (k === 'fill-pattern') {
                  if ($scope.checkboxModel.fill) {
                    v += '_bg';
                  }
                  feature.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                  feature.attr(k, v);
                }
              });
              feature.append('actions')
              .append('action')
              .attr('id', '1');
           });
        }
        if ($scope.mode === 'circle') {
          resetActions();
          $('#der').css('cursor', 'crosshair');
          $scope.styleChoices = settings.STYLES.polygon;
          $scope.styleChosen = $scope.styleChoices[0];
          d3.select('svg')
            .on('click', function() {
              var coordinates = d3.mouse(this);
              var feature;
              if (d3.select('.edition')[0][0]) {
                feature = d3.select('.edition');
                var xOffset = coordinates[0] - feature.attr('cx');
                var yOffset = coordinates[1] - feature.attr('cy');
                var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                feature.attr('r', r);
                feature.classed('edition', false);
              } else {
                feature = d3.select('svg')
                .append('circle')
                .attr('cx', coordinates[0])
                .attr('cy', coordinates[1])
                .attr({'class': 'edition'});
                angular.forEach($scope.styleChosen.style, function(attribute) {
                  var k = attribute.k;
                  var v = attribute.v;
                  if (k === 'fill-pattern') {
                    if ($scope.checkboxModel.fill) {
                      v += '_bg';
                    }
                    feature.attr('fill', settings.POLYGON_STYLES[v].url());
                  } else {
                    feature.attr(k, v);
                  }
                });

                if ($scope.checkboxModel.contour && !feature.attr('stroke')) {
                  feature
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
                }
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
                if ($scope.mode === 'line') {
                  pathInner = d3.select('.edition.inner');
                }
              } else {
                lineEdit = [];
                path = d3.select('svg')
                .append('path')
                .attr({'class': 'edition'});
                angular.forEach($scope.styleChosen.style, function(attribute) {
                  var k = attribute.k;
                  var v = attribute.v;
                  if (k === 'fill-pattern') {
                    if ($scope.checkboxModel.fill) {
                      v += '_bg';
                    }
                    path.attr('fill', settings.POLYGON_STYLES[v].url());
                  } else {
                    path.attr(k, v);
                  }
                });

                if ($scope.checkboxModel.contour && !path.attr('stroke')) {
                  path
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
                }

                if ($scope.mode === 'line') {
                  pathInner = d3.select('svg')
                  .append('path')
                  .attr({'class': 'edition inner'});
                  angular.forEach($scope.styleChosen.styleInner, function(attribute) {
                    var k = attribute.k;
                    var v = attribute.v;
                    if (k === 'fill-pattern') {
                      if ($scope.checkboxModel.fill) {
                        v += '_bg';
                      }
                      pathInner.attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                      pathInner.attr(k, v);
                    }
                  });
                }
              }
              var coordinates = d3.mouse(this);
              lastPoint = coordinates;
              lineEdit.push(coordinates);
              path.attr({
                d: lineFunction(lineEdit)
              });

              if ($scope.mode === 'line') {
                pathInner.attr({
                  d: lineFunction(lineEdit)
                });
              }
              angular.forEach($scope.styleChosen.style, function(attribute) {
                var k = attribute.k;
                var v = attribute.v;
                if (k === 'fill-pattern') {
                  if ($scope.checkboxModel.fill) {
                    v += '_bg';
                  }
                  path.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                  path.attr(k, v);
                }
              });

              if ($scope.checkboxModel.contour && !path.attr('stroke')) {
                path
                  .attr('stroke', 'black')
                  .attr('stroke-width', '2');
              }

              if ($scope.mode === 'line') {
                angular.forEach($scope.styleChosen.styleInner, function(attribute) {
                  var k = attribute.k;
                  var v = attribute.v;
                  if (k === 'fill-pattern') {
                    if ($scope.checkboxModel.fill) {
                      v += '_bg';
                    }
                    pathInner.attr('fill', settings.POLYGON_STYLES[v].url());
                  } else {
                    pathInner.attr(k, v);
                  }
                });
              }
            })
            .on('dblclick', function() {
              if ($scope.mode === 'polygon') {
                var a = d3.select('.edition').attr('d');
                a = a.replace(a.substr(a.lastIndexOf('L')), '');
                d3.select('.edition').attr({
                  d: a + 'Z'
                });
              }
              d3.select('.edition').classed('edition', false);

              if ($scope.mode === 'line') {
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
                    var k = attribute.k;
                    var v = attribute.v;
                    if (k === 'fill-pattern') {
                      if ($scope.checkboxModel.fill) {
                        v += '_bg';
                      }
                      line.attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                      line.attr(k, v);
                    }
                  });

                  if ($scope.checkboxModel.contour && !line.attr('stroke')) {
                    line
                      .attr('stroke', 'black')
                      .attr('stroke-width', '2');
                  }
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
              d3.select('.edition').classed('edition', false);
              var coordinates = d3.mouse(this);
              var d = 'Texte';
              d3.select('svg')
                .append('text')
                .attr('x', coordinates[0])
                .attr('y', coordinates[1] - 35)
                .attr('font-family', $scope.fontChosen.family)
                .attr('font-size', $scope.fontChosen.size)
                .attr('font-weight', function() {
                  return $scope.fontChosen.weight;
                })
                .attr('fill', $scope.colorChosen.color)
                .attr({'class': 'edition'})
                .text('');
              d3.select('svg').selectAll('foreignObject')
                .data([d])
                .enter()
                .append('foreignObject')
                .attr('x', coordinates[0])
                .attr('y', coordinates[1] - 35)
                .attr('height', 500)
                .attr('width', 500)
                .attr('font-family', $scope.fontChosen.family)
                .attr('font-size', $scope.fontChosen.size)
                .attr('font-weight', function() {
                  return $scope.fontChosen.weight;
                })
                .attr('fill', $scope.colorChosen.color)
                .attr({'class': 'edition'})
                .append('xhtml:p')
                .attr('contentEditable', 'true')
                .text(d)
                .on('mousedown', function() {
                  d3.event.stopPropagation();
                })
                .on('keydown', function() {
                  d3.event.stopPropagation();
                  if (d3.event.keyCode === 13 && !d3.event.shiftKey) {
                    this.blur();
                  }
                })
                .on('blur', function() {
                  angular.forEach(this.childNodes, function(node) {
                    var data = node.data;
                    if (data) {
                      data = data.replace(/(\d+)/g, '¤$1');
                      d3.select('.edition')
                        .attr('text-anchor', 'start')
                        .append('tspan')
                        .attr('text-anchor', 'start')
                        .attr('x', function() {
                           return d3.select(this.parentNode).attr('x');
                        })
                        .attr('dy', 35)
                        .text(data);
                    }
                  });
                  d3.select(this.parentElement).remove();
                  // var bbox = d3.select('.edition')[0][0].getBBox();
                  // d3.select('.edition')
                  //       .append('rect')
                  //       .attr('x', bbox.x)
                  //       .attr('y', bbox.y)
                  //       .attr('width', bbox.width)
                  //       .attr('height', bbox.height);
                  d3.select('.edition').classed('edition', false);
                });

                selectElementContents(d3.selectAll(this.getElementsByTagName('foreignObject')).selectAll('p').node());

                $scope.$apply(function() {
                  $scope.mode = 'default';
                });
                resetActions();
              });
        }
      });

      $scope.mapExport = exportService.mapExport;
  }]);
