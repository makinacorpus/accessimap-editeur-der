'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MainService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.svgicon
 * @description
 * Service linked to the controller accessimapEditeurDerApp.controller:CommonmapCtrl
 */
angular.module('accessimapEditeurDerApp')
    .service('MainService', ['$q', 'initSvg', 'shareSvg', 'settings',
            function($q, initSvg, shareSvg, settings) {

        /**
         * @ngdoc method
         * @name  createBlankSvg
         * @methodOf accessimapEditeurDerApp.MainService
         * 
         * @param  {[type]} mapFormat    [description]
         * @param  {[type]} legendFormat [description]
         * @return {Promise}              [description]
         */
        var createBlankSvg = function(mapFormat, legendFormat) {

            var deferred = $q.defer();

            var svgToStore = initSvg.createBlankSvg(mapFormat, legendFormat);

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
    }]);
