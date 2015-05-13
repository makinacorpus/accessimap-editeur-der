'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.mapService
 * @description
 * # mapService
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('mapService', ['$http', function($http) {

    this.formatLocation = function(p, k) {
      var format = d3.format('.' + Math.floor(Math.log(k) / 2 - 2) + 'f');
      return {
        'lon': p[0] < 0 ? format(-p[0]) : format(p[0]),
        'lat': p[1] < 0 ? format(-p[1]) : format(p[1])
      };
    };

  }]);
