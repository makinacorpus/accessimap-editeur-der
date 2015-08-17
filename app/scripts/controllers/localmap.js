'use strict';
/*global turf, osmtogeojson */

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:LocalmapCtrl
 * @description
 * # LocalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('LocalmapCtrl', ['$rootScope', '$scope', '$http', '$location', 'usSpinnerService', 'initSvg',
    'mapService', 'settings', 'exportService', 'shareSvg', 'editSvg', 'svgicon',
    function($rootScope, $scope, $http, $location, usSpinnerService, initSvg,
      mapService, settings, exportService, shareSvg, editSvg, svgicon) {

      var mapFormat = $location.search().mapFormat;
      var legendFormat = $location.search().legendFormat;

      var widthMm = settings.FORMATS[mapFormat].width,
          legendWidthMm = settings.FORMATS[legendFormat].width,
          heightMm = settings.FORMATS[mapFormat].height,
          legendHeightMm = settings.FORMATS[legendFormat].height,
          margin = 40;

      var mapsvg = initSvg.createMap(widthMm, heightMm);
      var legendsvg = initSvg.createLegend(widthMm, heightMm);
      initSvg.createDefs(mapsvg);

      var width = widthMm / 0.2822222,
          height = heightMm / 0.2822222,
          legendWidth = legendWidthMm / 0.2822222,
          legendHeight = legendHeightMm / 0.2822222;

      var tile = d3.geo.tile()
          .size([width, height]);

      var projection = d3.geo.mercator()
          .scale(Math.pow(2, 22) / 2 / Math.PI)
          .translate([width / 2, height / 2]);

      var center = projection(settings.leaflet.GLOBAL_MAP_CENTER);
      var path = d3.geo.path()
          .projection(projection);

      $scope.leftMenuVisible = false;

      $scope.hideMenu = function() {
        $scope.leftMenuVisible = false;
      };

      $scope.showMenu = function() {
        $scope.leftMenuVisible = true;
      };

      function zoomed() {
        var tiles = tile
            .scale(zoom.scale())
            .translate(zoom.translate())();

        angular.forEach($scope.geojson, function(geojson) {
          d3.selectAll('path.' + geojson.id)
              .filter(function(d) {
                return d.geometry.type !== 'Point'; })
              .attr('d', path);
          d3.selectAll('path.inner.' + geojson.id)
              .filter(function(d) {
                return d.geometry.type !== 'Point'; })
              .attr('d', path);
          d3.selectAll('path.' + geojson.id)
              .filter(function(d) {
                return d.geometry.type === 'Point'; })
              .attr('cx', function(d) {
                return projection(d.geometry.coordinates)[0];
              })
              .attr('cy', function(d) {
                return projection(d.geometry.coordinates)[1];
              })
              .attr('d', function(d) {
                var coords = projection(d.geometry.coordinates);
                return geojson.style.path(coords[0], coords[1], geojson.style.radius);});
        });

        projection
            .scale(zoom.scale() / 2 / Math.PI)
            .translate(zoom.translate());

        var image = raster
            .attr('transform', 'scale(' + tiles.scale + ')translate(' + tiles.translate + ')')
          .selectAll('image')
            .data(tiles, function(d) { return d; });

        image.exit()
            .remove();

        image.enter().append('image')
            .attr('xlink:href', function(d) {
                var url = 'http://' + ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
                url += '.tile.openstreetmap.org/' + d[2] + '/' + d[0] + '/' + d[1] + '.png';
              return url;
            })
            .attr('width', 1)
            .attr('height', 1)
            .attr('x', function(d) { return d[0]; })
            .attr('y', function(d) { return d[1]; });
      }

      var zoom = d3.behavior.zoom()
          .scale(projection.scale() * 2 * Math.PI)
          .scaleExtent([Math.pow(2, 11), Math.pow(2, 27)])
          .translate([width - center[0], height - center[1]])
          .on('zoom', zoomed)
          .on('zoomend', zoomed);

      // Load polygon fill styles, defined in settings
      angular.forEach(settings.POLYGON_STYLES, function(key) {
          mapsvg.call(key);
          legendsvg.call(key);
      });
      $scope.rotationAngle = 0;
      $scope.checkboxModel = {
        contour: false,
        fill: false,
      };

      var map = mapsvg.append('g')
          .attr('width', width)
          .attr('height', height)
          .attr('transform', 'rotate(' + $scope.rotationAngle + ')');

      initSvg.createMargin(mapsvg, width, height);
      initSvg.createMargin(legendsvg, legendWidth, legendHeight);

      var raster = map.append('g')
          .attr('class', 'tiles');

      var legendContainter = legendsvg.append('g')
          .attr('width', legendWidth)
          .attr('height', legendHeight);

      legendContainter.append('text')
          .attr('x', function() {
              return margin;
          })
          .attr('y', function() {
              return margin * 2;
          })
          .attr('class', 'braille')
          .attr('font-family', 'Braille_2007')
          .attr('font-size', '35px')
          .text(function() {
              return 'Légende';
          });

      $scope.geojson = [];

      $scope.queryChoices = settings.QUERY_LIST;
      $scope.queryChosen = $scope.queryChoices[0];

      $scope.styleChoices = settings.STYLES[$scope.queryChosen.type];
      $scope.styleChosen = $scope.styleChoices[0];

      $scope.changeStyle = function() {
          $scope.styleChoices = settings.STYLES[$scope.queryChosen.type];
          $scope.styleChosen = $scope.styleChoices[0];
      };

      $scope.rotateMap = function() {
          map.attr('transform', 'rotate(' + $scope.rotationAngle + ' ' + width / 2 + ' ' + height / 2 + ')');
      };

      $scope.rotateFeature = function(feature) {
        var features = d3.selectAll('.' + feature.id);
        angular.forEach(features[0], function(featurei) {
          var cx = d3.select(featurei).attr('cx');
          var cy = d3.select(featurei).attr('cy');
          d3.select(featurei).attr('transform', 'rotate(' + feature.rotation + ' ' + cx + ' ' + cy + ')');
        });
      };

      $scope.featureIcon = svgicon.featureIcon;

      function addToLegend(query, style, position) {
        var legendGroup = legendContainter.append('g')
            .attr('class', 'legend')
            .attr('id', query.id);
        var symbol;
        if (query.type === 'line') {
            symbol = legendGroup.append('line')
                .attr('x1', function() {
                    return margin * 2;
                })
                .attr('y1', function() {
                    return position * 40 + margin * 2;
                })
                .attr('x2', function() {
                    return margin * 2 + 40;
                })
                .attr('y2', function() {
                    return position * 40 + margin * 2;
                })
                .attr('class', 'symbol')
                .attr('fill', 'red');
            var symbolInner = legendGroup.append('line')
                .attr('x1', function() {
                    return margin * 2;
                })
                .attr('y1', function() {
                    return position * 40 + margin * 2;
                })
                .attr('x2', function() {
                    return margin * 2 + 40;
                })
                .attr('y2', function() {
                    return position * 40 + margin * 2;
                })
                .attr('class', 'symbol')
                .attr('class', 'inner')
                .attr('fill', 'red');
            angular.forEach(style.style, function(attribute) {
              var k = attribute.k;
              var v = attribute.v;
              if (typeof(v) === 'function') {
                v = v.url();
              }
              symbol.attr(k, v);
            });
            if (style.styleInner) {
              angular.forEach(style.styleInner, function(attribute) {
                var k = attribute.k;
                var v = attribute.v;
                if (typeof(v) === 'function') {
                  v = v.url();
                }
                symbolInner.attr(k, v);
              });
            }
        }
        if (query.type === 'point') {
            symbol = legendGroup.append('path')
                .attr('cx', margin * 2 + 20)
                .attr('cy', position * 40 + margin * 2 + style.radius / 2)
                .attr('d', function() {
                    var x = parseFloat(d3.select(this).attr('cx')),
                        y = parseFloat(d3.select(this).attr('cy'));
                    return style.path(x, y, style.radius);
                })
                .attr('class', 'symbol')
                .attr('fill', 'red');
        }
        if (query.type === 'polygon') {
            symbol = legendGroup.append('rect')
                .attr('x', function() {
                    return margin * 2;
                })
                .attr('y', function() {
                    return position * 40 + margin * 2;
                })
                .attr('width', function() {
                    return 40;
                })
                .attr('height', function() {
                    return 15;
                })
                .attr('class', 'symbol')
                .attr('fill', 'red');
        }

          angular.forEach(style.style, function(attribute) {
            var k = attribute.k;
            var v = attribute.v;
            if (k === 'fill-pattern') {
              if ($scope.checkboxModel.fill) {
                v += '_bg';
              }
              symbol.attr('fill', settings.POLYGON_STYLES[v].url());
            } else {
              symbol.attr(k, v);
            }
          });

          if ($scope.checkboxModel.contour && !symbol.attr('stroke')) {
            symbol
              .attr('stroke', 'black')
              .attr('stroke-width', '2');
          }

          legendGroup.append('text')
              .attr('x', function() {
                  return margin * 2 + 50;
              })
              .attr('y', function() {
                  return position * 40 + margin * 2 + 20;
              })
              .attr('font-family', 'Braille_2007')
              .attr('font-size', '35px')
              .attr('class', 'braille')
              .text(function() {
                  return query.name;
              });
      }

      map.call(zoom);
      zoomed();

      function mapCommon() {
        var svg = d3.select('#map').select('svg').node(),
            legend = d3.select('#legend').select('svg').node();
        zoom.on('zoom', null)
            .on('zoomend', null);
        shareSvg.addMap(svg)
        .then(function() {
          shareSvg.addLegend(legend)
          .then(function() {
              $location.path('/commonmap');
          });
        });
      }

      function removeFeature(id) {
        // Remove object from $scope.geojson
        var result = $scope.geojson.filter(function(obj) {
          return obj.id === id;
        });
        var index = $scope.geojson.indexOf(result[0]);
        $scope.geojson.splice(index, 1);

        // Remove object from map
        d3.select('.vector#' + id).remove();
        if (d3.select('.vector.inner#' + id)) {
          d3.select('.vector.inner#' + id).remove();
        }

        // Remove object from legend
        d3.select('.legend#' + id).remove();
      }

      function updateFeature(id, style) {
        var result = $scope.geojson.filter(function(obj) {
          return obj.id === id;
        });
        var objectId = $scope.geojson.indexOf(result[0]);

        if ($scope.geojson[objectId].contour) {
          d3.select('#' + id)
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        } else {
          d3.select('#' + id)
            .attr('stroke', null)
            .attr('stroke-width', null);
        }

        angular.forEach(style.style, function(attribute) {
          var k = attribute.k;
          var v = attribute.v;
          if (k === 'fill-pattern') {
            if ($scope.geojson[objectId].fill) {
              v += '_bg';
            }
            d3.select('#' + id)
              .attr('fill', settings.POLYGON_STYLES[v].url());
          } else {
            d3.select('#' + id)
              .attr(k, v);
          }
        });
        if (style.styleInner) {
          angular.forEach(style.styleInner, function(attribute) {
            var k = attribute.k;
            var v = attribute.v;
            if (k === 'fill-pattern') {
              d3.select('.inner#' + id).attr('fill', settings.POLYGON_STYLES[v].url());
            } else {
              d3.select('.inner#' + id).attr(k, v);
            }
          });
        }
        if (style.path) {
          $scope.geojson[objectId].style.path = style.path;
          zoomed();
        }

        var symbol = d3.select('.legend#' + id).select('.symbol');

        if ($scope.geojson[objectId].contour) {
          symbol
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        } else {
          symbol
            .attr('stroke', null)
            .attr('stroke-width', null);
        }
        angular.forEach(style.style, function(attribute) {
          var k = attribute.k;
          var v = attribute.v;
          if (k === 'fill-pattern') {
            if ($scope.geojson[objectId].fill) {
              v += '_bg';
            }
            symbol.attr('fill', settings.POLYGON_STYLES[v].url());
          } else {
            symbol.attr(k, v);
          }
        });
        if (style.styleInner) {
          var symbolInner = d3.select('.legend#' + id).select('.inner');
          angular.forEach(style.styleInner, function(attribute) {
            var k = attribute.k;
            var v = attribute.v;
            if (k === 'fill-pattern') {
              symbol.attr('fill', settings.POLYGON_STYLES[v].url());
            } else {
              symbolInner.attr(k, v);
            }
          });
        }
        if (style.path) {
          symbol.attr('d', function() {
              return style.path(symbol.attr('cx'), symbol.attr('cy'), style.radius);
          });
        }
      }

      function simplifyFeatures(feature) {
        //if (feature.simplification > 0) {
          d3.select('.vector#' + feature.id).remove();
          if (d3.select('.vector.inner#' + feature.id)) {
            d3.select('.vector.inner#' + feature.id).remove();
          }
          var data = $.extend(true, {}, feature.originallayer);
          geojsonToSvg(data, feature.simplification / 100000, feature.id);
        //}
      }

      function drawFeature(data, feature, optionalClass) {
        map.append('g')
          .attr('class', function() {
            if (optionalClass) {
              return 'vector ' + optionalClass;
            } else {
              return 'vector';
            }
          })
          .attr('id', feature[0].id)
          .selectAll('path')
          .data(data.features.filter(function(d) {
            return d.geometry.type !== 'Point';
          }))
          .enter().append('path')
          .attr('class', function() {
            if (optionalClass) {
              return feature[0].id + ' ' + optionalClass;
            } else {
              return feature[0].id;
            }
          })
          .attr('name', function(d) {
            return d.properties.tags.name;
          })
          .append('svg:title')
            .text(function(d) { return d.properties.tags.name; })
          .attr('d', path)
          .data(data.features.filter(function(d) {
            return d.geometry.type === 'Point';
          }))
          .enter().append('path')
          .attr('class', feature[0].id)
          .attr('name', function(d) {
            return d.properties.tags.name;
          })
          .attr('cx', function(d) {
            return projection(d.geometry.coordinates)[0];
          })
          .attr('cy', function(d) {
            return projection(d.geometry.coordinates)[1];
          })
          .attr('d', function(d) {
            var coords = projection(d.geometry.coordinates);
            return feature[0].style.path(coords[0], coords[1], feature[0].style.radius);
          });

        angular.forEach(feature[0].style.style, function(attribute) {
          var k = attribute.k;
          var v = attribute.v;
          if (k === 'fill-pattern') {
            if ($scope.checkboxModel.fill) {
              v += '_bg';
            }
            d3.select('#' + feature[0].id).attr('fill', settings.POLYGON_STYLES[v].url());
          } else {
            d3.select('#' + feature[0].id).attr(k, v);
          }
        });
        if (optionalClass) {
          angular.forEach(feature[0].style.styleInner, function(attribute) {
            var k = attribute.k;
            var v = attribute.v;
            if (k === 'fill-pattern') {
              if ($scope.checkboxModel.fill) {
                v += '_bg';
              }
              d3.select('.' + optionalClass + '#' + feature[0].id).attr('fill', settings.POLYGON_STYLES[v].url());
            } else {
              d3.select('.' + optionalClass + '#' + feature[0].id).attr(k, v);
            }
          });
        }
        if ($scope.checkboxModel.contour && !d3.select('#' + feature[0].id).attr('stroke')) {
          d3.select('#' + feature[0].id)
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        }

        if (optionalClass) {
          angular.forEach(feature[0].style['style_' + optionalClass], function(attribute) {
            d3.select('.' + optionalClass + '#' + feature[0].id)
              .attr(attribute.k, attribute.v);
          });
        }
      }

      function geojsonToSvg(data, simplification, id, poi) {
        if (data) {
          data.features.forEach(function(feature, index) {
            if (simplification) {
              data.features[index] = turf.simplify(feature, simplification, false);
            }
          });
          var featureExists;
          if (id) {
            featureExists = $scope.geojson.filter(function(obj) {
              return obj.id === id;
            });
          } else {
            featureExists = $scope.geojson.filter(function(obj) {
              return obj.id === $scope.queryChosen.id;
            });
          }

          if (featureExists.length === 0) {
            if (poi) {
              var tags = data.features[0].properties.tags;
              var name = tags.name || tags.amenity || tags.shop || 'POI';
              $scope.geojson.push({
                id: id,
                name: name,
                geometryType: $scope.queryChosen.type,
                layer: $.extend(true, {}, data), //deep copy,
                originallayer: $.extend(true, {}, data), //deep copy
                style: $scope.styleChosen,
                styleChoices: $scope.styleChoices,
                rotation: 0
              });
              addToLegend({'type': 'point', 'name': name, 'id': id}, $scope.styleChosen, $scope.geojson.length);
            } else {
              $scope.geojson.push({
                id: $scope.queryChosen.id,
                name: $scope.queryChosen.name,
                geometryType: $scope.queryChosen.type,
                layer: $.extend(true, {}, data), //deep copy,
                originallayer: $.extend(true, {}, data), //deep copy
                style: $scope.styleChosen,
                styleChoices: $scope.styleChoices,
                contour: $scope.checkboxModel.contour,
                fill: $scope.checkboxModel.fill
              });
              addToLegend($scope.queryChosen, $scope.styleChosen, $scope.geojson.length);
            }
          } else {
            drawFeature(data, featureExists);
            if ($scope.styleChosen.styleInner) {
              drawFeature(data, featureExists, 'inner');
            }
          }

          map.call(zoom);
          zoomed();
        }
      }

      function downloadPoi() {
        $('#map').css('cursor', 'crosshair');
        d3.select('svg')
          .on('click', function() {
            var coordinates = d3.mouse(this);
            var point = projection.invert(coordinates);
            downloadData(point);
          });
      }

      function downloadData(point) {
        usSpinnerService.spin('spinner-1');
        var mapS,
            mapW,
            mapN,
            mapE;
        if (point) {
          mapS = parseFloat(point[1]) - 0.00005;
          mapW = parseFloat(point[0]) - 0.00005;
          mapN = parseFloat(point[1]) + 0.00005;
          mapE = parseFloat(point[0]) + 0.00005;
        } else {
          $('#map').css('cursor', 'auto');
          var boundsNW = projection.invert([0, 0]);
          var boundsSE = projection.invert([width, height]);
          mapS = boundsSE[1];
          mapW = boundsNW[0];
          mapN = boundsNW[1];
          mapE = boundsSE[0];
        }
        var url = settings.XAPI_URL + '[out:xml];(';
        for (var i = 0; i < $scope.queryChosen.query.length; i++) {
          url += $scope.queryChosen.query[i];
          url += '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + ');';
        }
        url += ');out body;>;out skel qt;';
        $http.get(url).
          success(function(data) {
            var osmGeojson = osmtogeojson(new DOMParser().parseFromString(data, 'text/xml'));

            // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
            // Polygon coordinates need therefore to be reversed

            osmGeojson.features.forEach(function(feature, index) {

              if (feature.geometry.type === 'Polygon') {
                var n = feature.geometry.coordinates.length;
                feature.geometry.coordinates[0].reverse();
                if (n > 1) {
                  for (var i = 1; i < n; i++) {
                    var reversedCoordinates = feature.geometry.coordinates[i].slice().reverse();
                    osmGeojson.features[index].geometry.coordinates[i] = reversedCoordinates;
                  }
                }
              }

              if (feature.geometry.type === 'MultiPolygon') {
                // Split it in simple polygons
                feature.geometry.coordinates.forEach(function(coords) {
                  var n = coords.length;
                  coords[0].reverse();
                  if (n > 1) {
                    for (var i = 1; i < n; i++) {
                      coords[i] = coords[i].slice().reverse();
                    }
                  }
                   osmGeojson.features.push({'type': 'Feature',
                                             'properties': osmGeojson.features[index].properties,
                                             'geometry': {'type': 'Polygon', 'coordinates': coords
                                            }});
                   }
                );
              }
            });

            if ($scope.queryChosen.id === 'poi') {
              osmGeojson.features = [osmGeojson.features[0]];
              if (osmGeojson.features[0]) {
                geojsonToSvg(osmGeojson, undefined, 'node_' + osmGeojson.features[0].properties.id, true);
              }
            } else {
              geojsonToSvg(osmGeojson, undefined, undefined);
            }



            usSpinnerService.stop('spinner-1');
          }).
          error(function() {
            usSpinnerService.stop('spinner-1');
          });
      }


      function zoomOnPlace(input) {
        var url = 'http://api-adresse.data.gouv.fr/search/?q=' + input.target.value + '&limit=1';
        $http.get(url).
          success(function(data) {
            if (data.features[0]) {
              var p = d3.geo.mercator()
                  .scale(zoom.scale() / 2 / Math.PI);
              var location = p(data.features[0].geometry.coordinates);
              var translateX = -location[0] + width,
                  translateY = -location[1] + height;
              zoom.translate([translateX, translateY]);
              zoomed();
            }
        });
      }

      $scope.downloadData = downloadData;
      $scope.downloadPoi = downloadPoi;
      $scope.removeFeature = removeFeature;
      $scope.updateFeature = updateFeature;
      $scope.simplifyFeatures = simplifyFeatures;
      $scope.mapCommon = mapCommon;
      $scope.zoomOnPlace = zoomOnPlace;

}]);
