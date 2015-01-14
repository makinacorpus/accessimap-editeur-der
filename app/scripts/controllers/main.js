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

    $scope.geojson = [];

    $scope.queryChoices = settings.QUERY_LIST;
    $scope.queryChosen = $scope.queryChoices[0];

    function downloadSidewalks() {
      usSpinnerService.spin('spinner-1');
      var mapBounds = map.getBounds(),
          mapS = mapBounds.getSouth(),
          mapW = mapBounds.getWest(),
          mapN = mapBounds.getNorth(),
          mapE = mapBounds.getEast();
      $http.get(settings.XAPI_URL + '[out:json];(way'+ $scope.queryChosen.query + '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + '););out body;>;out skel qt;').
        success(function(data, status, headers, config) {
          var osmGeojson = osmtogeojson(data);
          var layerGeojson = L.geoJson(osmGeojson).addTo(map);
          $scope.geojson.push({
            name: $scope.queryChosen.name,
            layer: layerGeojson
            }
          );
          usSpinnerService.stop('spinner-1');
          console.log($scope.geojson);
        }).
        error(function(data, status, headers, config) {
          usSpinnerService.stop('spinner-1');
        });
    }

    $scope.downloadSidewalks = downloadSidewalks;

  }]);
