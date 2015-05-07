'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDer
 */
angular.module('accessimapEditeurDerApp')
  .controller('MainCtrl', ['$scope', '$location', 'settings',
    function($scope, $location, settings) {
      $scope.go = function(path) {
        $location.path(path).search('mapFormat', $scope.mapFormat).search('legendFormat', $scope.legendFormat);
      };

      $scope.formats = settings.FORMATS;
      $scope.mapFormat = 'landscapeA4';
      $scope.legendFormat = 'landscapeA4';

  }]);
