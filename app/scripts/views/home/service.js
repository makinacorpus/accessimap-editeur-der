
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.HomeService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.svgicon
 * @description
 * Service linked to the controller accessimapEditeurDerApp.controller:CommonmapController
 */
(function() {
    'use strict';

    function HomeService($q, initSvg, shareSvg, settings) {

        /**
         * @ngdoc method
         * @name  createBlankSvg
         * @methodOf accessimapEditeurDerApp.HomeService
         * 
         * @param  {Object} mapFormat    [description]
         * @param  {Object} legendFormat [description]
         * @return {Promise}              [description]
         */
        var createBlankSvg = function(mapFormat, legendFormat) {

            var deferred = $q.defer(),
                svgToStore = initSvg.createBlankSvg(mapFormat, legendFormat);

            shareSvg.setMap(svgToStore.map)
            .then(function() {
                shareSvg.setLegend(svgToStore.legend)
                .then(function() {
                    deferred.resolve();
                });
            });

            return deferred.promise;

        }
        
        return {
            createBlankSvg: createBlankSvg,
            settings: settings
        }
    }
    
    angular.module(moduleApp)
        .service('HomeService', HomeService);

    HomeService.$inject = ['$q', 'initSvg', 'shareSvg', 'settings']

})();