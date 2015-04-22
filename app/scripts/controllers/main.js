'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDer
 */
angular.module('accessimapEditeurDerApp')
  .controller('MainCtrl', ['$scope', '$location',
    function($scope, $location) {
      $scope.go = function(path) {
        $location.path(path).search('mapFormat', $scope.mapFormat).search('legendFormat', $scope.legendFormat);
      };

      $scope.mapFormat = 'landscape';
      $scope.legendFormat = 'landscape';

  }]);
