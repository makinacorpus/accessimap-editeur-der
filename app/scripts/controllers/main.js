'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDer
 */
angular.module('accessimapEditeurDerApp')
  .controller('MainCtrl', ['$scope', '$http', 'usSpinnerService', 'settings', function ($scope, $http, usSpinnerService, settings) {

    var map = L.map('map', {
      center: settings.leaflet.GLOBAL_MAP_CENTER,
      zoom: settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(map);

    $scope.geojson = {};

    $scope.values = [{
      id: 1,
      name: 'trottoirs',
      query: '["footway"="sidewalk"]'
    }, {
      id: 2,
      name: 'rues',
      query: '["highway"]["footway"!="sidewalk"]["area"!="yes"]'
    }];
    $scope.selected = $scope.values[0];

    function downloadSidewalks() {
      usSpinnerService.spin('spinner-1');
      var mapBounds = map.getBounds(),
          mapS = mapBounds.getSouth(),
          mapW = mapBounds.getWest(),
          mapN = mapBounds.getNorth(),
          mapE = mapBounds.getEast();
      $http.get(settings.XAPI_URL + '[out:json];(way'+ $scope.selected.query + '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + '););out body;>;out skel qt;').
        success(function(data, status, headers, config) {
          var geojson = osmtogeojson(data);
          $scope.geojson["trottoirs"] = L.geoJson(geojson).addTo(map);
          usSpinnerService.stop('spinner-1');
        }).
        error(function(data, status, headers, config) {
          usSpinnerService.stop('spinner-1');
        });
    }

    $scope.downloadSidewalks = downloadSidewalks;

  }]);
