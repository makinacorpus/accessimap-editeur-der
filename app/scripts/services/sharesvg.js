'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.shareSvg
 * @description
 * # shareSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('shareSvg', ['$q', function($q) {
        var map,
                legend,
                interactions;

        var addMap = function(newMap) {
            var deferred = $q.defer();
            map = newMap;

            deferred.resolve();

            return deferred.promise;
        };

        var getMap = function() {
            var deferred = $q.defer();

            deferred.resolve(map);

            return deferred.promise;
        };

        var addLegend = function(newLegend) {
            var deferred = $q.defer();
            legend = newLegend;

            deferred.resolve();

            return deferred.promise;
        };

        var getLegend = function() {
            var deferred = $q.defer();

            deferred.resolve(legend);

            return deferred.promise;
        };

        var addInteractions = function(newInteractions) {
            var deferred = $q.defer();
            interactions = newInteractions;

            deferred.resolve();

            return deferred.promise;
        };

        var getInteractions = function() {
            var deferred = $q.defer();

            deferred.resolve(interactions);

            return deferred.promise;
        };

        return {
            addMap: addMap,
            getMap: getMap,
            addLegend: addLegend,
            getLegend: getLegend,
            addInteractions: addInteractions,
            getInteractions: getInteractions
        };
    }]);
