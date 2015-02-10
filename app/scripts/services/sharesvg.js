'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.shareSvg
 * @description
 * # shareSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('shareSvg', ['$q', function ($q) {
    var svg;

    var addSvg = function(newSvg) {
      var deferred = $q.defer();
      svg = newSvg;

      deferred.resolve();

      return deferred.promise;
    };

    var getSvg = function(){
      var deferred = $q.defer();

      deferred.resolve(svg);

      return deferred.promise;
    };

    return {
      addSvg: addSvg,
      getSvg: getSvg
    };
  }]);
