'use strict';

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:AboutCtrl
 * @description
 *
 * Display informations about libraries used & mapping.
 *
 */
angular.module('accessimapEditeurDerApp')
  .controller('AboutCtrl', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
