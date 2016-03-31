
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.shareSvg
 * @description
 * # shareSvg
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function shareSvg($q) {
        var map,
            legend,
            interactions;

        function setMap(newMap) {
            var deferred = $q.defer();
            map = newMap;

            deferred.resolve();

            return deferred.promise;
        };

        function getMap() {
            var deferred = $q.defer();

            deferred.resolve(map);

            return deferred.promise;
        };

        function setLegend(newLegend) {
            var deferred = $q.defer();
            legend = newLegend;

            deferred.resolve();

            return deferred.promise;
        };

        function getLegend() {
            var deferred = $q.defer();

            deferred.resolve(legend);

            return deferred.promise;
        };

        function setInteractions(newInteractions) {
            var deferred = $q.defer();
            interactions = newInteractions;

            deferred.resolve();

            return deferred.promise;
        };

        function getInteractions() {
            var deferred = $q.defer();

            deferred.resolve(interactions);

            return deferred.promise;
        };

        return {
            setMap: setMap,
            getMap: getMap,
            setLegend: setLegend,
            getLegend: getLegend,
            setInteractions: setInteractions,
            getInteractions: getInteractions
        };
    }

    angular.module('accessimapEditeurDerApp')
        .service('shareSvg', shareSvg);

    shareSvg.$inject = ['$q'];
    
})();