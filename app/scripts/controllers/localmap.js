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
        arrow: false
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
        var cx = d3.select('.' + feature.id).attr('cx');
        var cy = d3.select('.' + feature.id).attr('cy');
        d3.select('.' + feature.id).attr('transform', 'rotate(' + feature.rotation + ' ' + cx + ' ' + cy + ')');
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
              symbol.attr(attribute.k, attribute.v);
            });
            if (style.styleInner) {
              angular.forEach(style.styleInner, function(attribute) {
                symbolInner.attr(attribute.k, attribute.v);
              });
            }
            if ($scope.checkboxModel.arrow) {
              symbolInner.attr('marker-end', 'url(#arrowEnd)');
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
            symbol.attr(attribute.k, attribute.v);
          });

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
        angular.forEach(style.style, function(attribute) {
          d3.select('#' + id)
            .attr(attribute.k, attribute.v);
        });
        if (style.styleInner) {
          angular.forEach(style.styleInner, function(attribute) {
            d3.select('.inner#' + id)
              .attr(attribute.k, attribute.v);
          });
        }
        if (style.path) {
          var result = $scope.geojson.filter(function(obj) {
            return obj.id === id;
          });
          var index = $scope.geojson.indexOf(result[0]);
          $scope.geojson[index].style.path = style.path;
          zoomed();
        }

        var symbol = d3.select('.legend#' + id).select('.symbol');
        angular.forEach(style.style, function(attribute) {
          symbol.attr(attribute.k, attribute.v);
        });
        if (style.styleInner) {
          var symbolInner = d3.select('.legend#' + id).select('.inner');
          angular.forEach(style.styleInner, function(attribute) {
            symbolInner.attr(attribute.k, attribute.v);
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
          d3.select('#' + feature[0].id)
            .attr(attribute.k, attribute.v);
        });
        if (optionalClass) {
          angular.forEach(feature[0].style.styleInner, function(attribute) {
            d3.select('.' + optionalClass + '#' + feature[0].id)
              .attr(attribute.k, attribute.v);
          });
        }

        // If the arrow checkbox is checked, add a marker-end
        if ($scope.checkboxModel.arrow) {
          d3.select('#' + feature[0].id)
            .attr('marker-end', 'url(#arrowEnd)');
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
                styleChoices: $scope.styleChoices
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
            var point = mapService.formatLocation(projection.invert(coordinates), zoom.scale());
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
          mapS = parseFloat(point.lat) - 0.00005;
          mapW = parseFloat(point.lon) - 0.00005;
          mapN = parseFloat(point.lat) + 0.00005;
          mapE = parseFloat(point.lon) + 0.00005;
        } else {
          $('#map').css('cursor', 'auto');
          var boundsNW = mapService.formatLocation(projection.invert([0, 0]), zoom.scale());
          var boundsSE = mapService.formatLocation(projection.invert([width, height]), zoom.scale());
          mapS = boundsSE.lat;
          mapW = boundsNW.lon;
          mapN = boundsNW.lat;
          mapE = boundsSE.lon;
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
