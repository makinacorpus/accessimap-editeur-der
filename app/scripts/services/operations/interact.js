'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.interact
 * @description
 * # interact
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('interact', ['$rootScope', function($rootScope) {

        this.addInteraction = function(feature, scope) {

            var featureIid;
            featureIid = feature.attr('iid');
            if (!featureIid) {
                featureIid = $rootScope.getiid();
                feature.attr('iid', featureIid);
            }
            // Add the highlight class to the relevant cells of the grid
            d3.selectAll('.poi-' + featureIid).classed('highlight', true);

            var featurePosition = scope.interactiveFilters.data.filter(function(row) {
                return row.id === 'poi-' + featureIid;
            });
            var featureToAdd = scope.interactiveFilters.data.indexOf(featurePosition[0]) < 0;

            if (featureToAdd) {
                scope.$apply(function() {
                    scope.interactiveFilters.data.push({'id': 'poi-' + featureIid, 'f1': feature.attr('name'), 'deletable': true});
                });
            }

        };
    }]);
