/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.InteractionService
 * 
 * @description
 * Service providing methods to CRUD interactions
 */
(function() {
    'use strict';

    function InteractionService() {

        this.isFeatureInteractive = isFeatureInteractive;

        /**
         * @ngdoc property
         * @name  interactions
         * @propertyOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Array of interactions
         *
         * An interaction is a feature (point, circle, polygon, ...) that
         * will be attached to an pointer event (click, double click, ...)
         * and play a specific interaction (sound, vibration, ...)
         * 
         * @type {Array}
         */
        var interactions = [];

        /**
         * @ngdoc method
         * @name  isFeatureInteractive
         * @methodOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Return if the feature is an interactive one
         * 
         * @param  {Object}  feature
         * Feature to be checked
         * 
         * @return {Boolean}
         * True if interactive, false if not
         */
        function isFeatureInteractive(feature) {
            var featureIid = feature.attr('data-link'),
                featurePosition = 
                    interactions.filter(function(row) {
                        return row.id === 'poi-' + featureIid;
                    });


            return interactions.indexOf(featurePosition[0]) >= 0;
        }
        
        /**
         * @ngdoc method
         * @name  addInteraction
         * @methodOf accessimapEditeurDerApp.InteractionService
         *
         * @description
         * Add an interaction on a feature
         * 
         * @param {Object} feature
         * Feature that will be interactive
         */
        function addInteraction(feature) {

            var featureIid = feature.attr('data-link');

            if (!featureIid) {
                featureIid = UtilService.getiid();
                feature.attr('data-link', featureIid);
            }

            // Add the highlight class to the relevant cells of the grid
            d3.selectAll('.poi-' + featureIid).classed('highlight', true);

            var featurePosition =
                interactions.filter(function(row) {
                    return row.id === 'poi-' + featureIid;
                }),
                featureToAdd = interactions.indexOf(featurePosition[0]) < 0;

            if (featureToAdd) {
                interactions.push(
                    {
                        'id': 'poi-' + featureIid,
                        'f1': feature.attr('name'),
                        'deletable': true
                    });
            }

        };
    }

    angular.module(moduleApp).service('InteractionService', InteractionService);

    InteractionService.$inject = [];

})();