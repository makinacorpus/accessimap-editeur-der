'use strict';

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

      var width = 1000,
          legendWidth = 300,
          height = width / Math.sqrt(2),
          margin = 10;

      var tile = d3.geo.tile()
          .size([width, height]);

      var projection = d3.geo.mercator()
          .scale((1 << 22) / 2 / Math.PI)
          .translate([width / 2, height / 2]);

      var center = projection(settings.leaflet.GLOBAL_MAP_CENTER);

      var path = d3.geo.path()
          .projection(projection);

      var zoom = d3.behavior.zoom()
          .scale(projection.scale() * 2 * Math.PI)
          .scaleExtent([1 << 11, 1 << 27])
          .translate([width - center[0], height - center[1]])
          .on('zoom', zoomed)
          .on('zoomend', zoomed);

      var svg = initSvg.createSvg(width, height);

      // Load polygon fill styles, defined in settings
      angular.forEach(settings.POLYGON_STYLES, function(key, value) {
          svg.call(key);
      });

      var map = svg.append('g')
          .attr('width', function() {
              return width - legendWidth;
          })
          .attr('height', height);

      var raster = map.append('g')
          .attr('class', 'tiles');

      var legendContainter = svg.append('g');

      var legend = legendContainter.append('rect')
          .attr('x', function() {
              return width - legendWidth;
          })
          .attr('y', '0px')
          .attr('width', function() {
              return legendWidth;
          })
          .attr('height', height)
          .attr('fill', 'white');

      legendContainter.append('text')
          .attr('x', function() {
              return width - legendWidth + margin;
          })
          .attr('y', '30px')
          .attr('class', 'braille')
          .attr('font-size', '20px')
          .text(function() {
              return 'legende';
          });

      $scope.geojson = [];

      $scope.queryChoices = settings.QUERY_LIST;
      $scope.queryChosen = $scope.queryChoices[0];

      $scope.styleChoices = settings.STYLES[$scope.queryChosen.type];
      $scope.styleChosen = $scope.styleChoices[0];

      $scope.changeStyle = function(query) {
        $scope.styleChoices = settings.STYLES[$scope.queryChosen.type];
        $scope.styleChosen = $scope.styleChoices[0];
      };

      $scope.featureIcon = svgicon.featureIcon;

      function addToLegend(type, name, style, position) {
        if (type === 'line') {
            var symbol = legendContainter.append('line')
                .attr('x1', function() {
                    return width - legendWidth + margin;
                })
                .attr('y1', function() {
                    return position * 30 + 40;
                })
                .attr('x2', function() {
                    return width - legendWidth + margin + 40;
                })
                .attr('y2', function() {
                    return position * 30 + 40;
                })
                .attr('fill', 'red');
        }
        if (type === 'point') {
            var symbol = legendContainter.append('path')
                .attr('d', function() {
                    var cx = width - legendWidth + margin + 20,
                        cy = position * 30 + 40 + style.radius / 2;
                    return style.path(cx, cy, style.radius);
                })
                .attr('fill', 'red');
        }
        if (type === 'polygon') {
            var symbol = legendContainter.append('rect')
                .attr('x', function() {
                    return width - legendWidth + margin;
                })
                .attr('y', function() {
                    return position * 30 + 40;
                })
                .attr('width', function() {
                    return 40;
                })
                .attr('height', function() {
                    return 15;
                })
                .attr('fill', 'red');
        }

          angular.forEach(style.style, function(attribute) {
            symbol.attr(attribute.k, attribute.v);
          });

          legendContainter.append('text')
              .attr('x', function() {
                  return width - legendWidth + margin + 50;
              })
              .attr('y', function() {
                  return position * 30 + margin + 40;
              })
              .attr('font-size', '20px')
              .attr('class', 'braille')
              .text(function() {
                  return name;
              });
      }

      function zoomed() {
        var tiles = tile
            .scale(zoom.scale())
            .translate(zoom.translate())();

        angular.forEach($scope.geojson, function(geojson) {
          d3.selectAll('path.' + geojson.id)
              .filter(function(d) {
                return d.geometry.type !== 'Point'; })
              .attr('d', path);
          d3.selectAll('path.' + geojson.id)
              .filter(function(d) {
                return d.geometry.type === 'Point'; })
              .attr('d', function(d) {
                var coords = projection(d.geometry.coordinates);
                return geojson.style.path(coords[0], coords[1], geojson.style.width);});
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
                var url = 'http://' + ['a', 'b', 'c'][Math.random() * 3 | 0];
                url += '.tile.osm.org/' + d[2] + '/' + d[0] + '/' + d[1] + '.png';
              return url;
            })
            .attr('width', 1)
            .attr('height', 1)
            .attr('x', function(d) { return d[0]; })
            .attr('y', function(d) { return d[1]; });
      }

      map.call(zoom);
      zoomed();

      function mapCommon() {
        //d3.select('.tiles').node().remove();
        var svg = d3.select('svg').node();
        zoom.on('zoom', null)
            .on('zoomend', null);
        shareSvg.addSvg(svg)
        .then(function() {
            $location.path('/commonmap');
        });
      }

      function downloadData() {
        usSpinnerService.spin('spinner-1');

        var boundsNW = mapService.formatLocation(projection.invert([0, 0]), zoom.scale());
        var boundsSE = mapService.formatLocation(projection.invert([width, height]), zoom.scale());
        var mapS = boundsSE.lat,
            mapW = boundsNW.lon,
            mapN = boundsNW.lat,
            mapE = boundsSE.lon;
        var url = settings.XAPI_URL + '[out:json];(' + $scope.queryChosen.query;
        url += '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + '););out body;>;out skel qt;';
        $http.get(url).
          success(function(data) {
            var osmGeojson = osmtogeojson(data);

            // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
            // Polygon coordinates need therefore to be reversed
            osmGeojson.features.forEach(function(feature) {
              if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates[0].reverse();
              }
            });

            map.append('g')
              .attr('class', 'vector')
              .attr('id', $scope.queryChosen.id)
              .selectAll('path')
              .data(osmGeojson.features.filter(function(d) {
                return d.geometry.type !== 'Point';}))
              .enter().append('path')
              .attr('class', $scope.queryChosen.id)
              .attr('d', path)
              .data(osmGeojson.features.filter(function(d) {
                return d.geometry.type === 'Point';}))
              .enter().append('path')
              .attr('class', $scope.queryChosen.id)
              .attr('d', function(d) {
                var coords = projection(d.geometry.coordinates);
                return $scope.styleChosen.path(coords[0], coords[1], $scope.styleChosen.radius);});

            angular.forEach($scope.styleChosen.style, function(attribute) {
              d3.select('#' + $scope.queryChosen.id)
                .attr(attribute.k, attribute.v);
            });

            map.call(zoom);

            $scope.geojson.push({
              id: $scope.queryChosen.id,
              name: $scope.queryChosen.name,
              layer: osmGeojson,
              style: {
                path: $scope.styleChosen.path,
                width: $scope.styleChosen.radius
              }
            });

            addToLegend($scope.queryChosen.type, $scope.queryChosen.name, $scope.styleChosen, $scope.geojson.length);

            zoomed();

            usSpinnerService.stop('spinner-1');
          }).
          error(function() {
            usSpinnerService.stop('spinner-1');
          });
      }

      $scope.downloadData = downloadData;
      $scope.mapCommon = mapCommon;

}]);
