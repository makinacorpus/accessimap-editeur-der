/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.interact
 * @description
 * # interact
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function interact(UtilService) {

        this.addInteraction = function(feature, scope) {

            var featureIid;
            featureIid = feature.attr('data-link');

            if (!featureIid) {
                featureIid = UtilService.getiid();
                feature.attr('data-link', featureIid);
            }

            // Add the highlight class to the relevant cells of the grid
            d3.selectAll('.poi-' + featureIid).classed('highlight', true);

            var featurePosition =
                scope.interactiveFilters.data.filter(function(row) {
                    return row.id === 'poi-' + featureIid;
                }),
                featureToAdd = scope.interactiveFilters.data.indexOf(featurePosition[0]) < 0;

            if (featureToAdd) {
                scope.$apply(function() {
                    scope
                        .interactiveFilters.data.push({
                                'id': 'poi-' + featureIid,
                                'f1': feature.attr('name'),
                                'deletable': true});
                });
            }

        };
    }
    angular.module('accessimapEditeurDerApp')
        .service('interact', interact);

    interact.$inject = ['UtilService'];
    
})();