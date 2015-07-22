'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDer
 */
angular.module('accessimapEditeurDerApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'settings',
    function($scope, $rootScope, $location, settings) {
      $scope.go = function(path) {
        $location.path(path).search('mapFormat', $scope.mapFormat).search('legendFormat', $scope.legendFormat);
      };

      $scope.formats = settings.FORMATS;
      $scope.mapFormat = 'landscapeA4';
      $scope.legendFormat = 'landscapeA4';

      $rootScope.iid = 1;

      $rootScope.getiid = function() {
        return $rootScope.iid ++;
      };

  }]);
