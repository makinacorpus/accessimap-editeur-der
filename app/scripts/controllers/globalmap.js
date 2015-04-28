'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:GlobalmapCtrl
 * @description
 * # GlobalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
  .controller('GlobalmapCtrl', ['$scope', '$rootScope', '$http', '$location', 'usSpinnerService',
    'initSvg', 'mapService', 'settings', 'shareSvg',
    function($scope, $rootScope, $http, $location, usSpinnerService,
      initSvg, mapService, settings, shareSvg) {


      $scope.uploadSvg = function(element) {
        var svgFile = element.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(svgFile); //readAsDataURL
        reader.onload = function(e) {
          appendSvg(e.target.result);
        };
      };

      $scope.mapCategories = [{
        id: 'world',
        name: 'Monde',
        images: [{
          path: 'data/BlankMap-World6-Equirectangular.svg'
        }]
      }, {
        id: 'france',
        name: 'France',
        images: [{
          path: 'data/France_all_regions_A4.svg'
        }]
      }];

      function appendSvg(path) {
        $scope.accordionStyle = {display: 'none'};
        d3.xml(path, function(xml) {
          var svg = d3.select(xml.documentElement);
          // Load polygon fill styles taht will be used on common map
          angular.forEach(settings.POLYGON_STYLES, function(key) {
              svg.call(key);
          });
          shareSvg.addMap(xml.documentElement)
          .then(function() {
            $location.path('/commonmap');
          });
        });
      }

      $scope.appendSvg = appendSvg;

}]);
