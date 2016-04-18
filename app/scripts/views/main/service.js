
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MainService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.svgicon
 * @description
 * Service linked to the controller accessimapEditeurDerApp.controller:CommonmapController
 */
(function() {
    'use strict';

    function MainService($q, initSvg, shareSvg, settings) {

        /**
         * @ngdoc method
         * @name  createBlankSvg
         * @methodOf accessimapEditeurDerApp.MainService
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
        .service('MainService', MainService);

    MainService.$inject = ['$q', 'initSvg', 'shareSvg', 'settings']

})();