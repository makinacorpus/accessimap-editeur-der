'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.delete
 * @description
 * # delete
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('delete', function() {
        var deleteFeature = function(feature, scope) {
            var featuresToUpdate = feature;
            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var el = featuresToUpdate.node();
            scope.$apply(function() {
                scope.deletedFeature = new XMLSerializer().serializeToString(el);
            });
            var t = document.createElement('foreignObject');
            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            featuresToUpdate.remove();
        };


        this.deleteObject = function(feature, scope) {
            // Remove previous deleted Element placeholder if it exists
            d3.select('#deletedElement').remove();

            // Some objects should not be deletable
            if (!d3.select(feature).node().classed('notDeletable')) {
                var iid = d3.select(feature).node().attr('iid');

                var featurePosition = scope.interactiveFilters.data.filter(function(row) {
                    return row.id === 'poi-' + iid;
                });
                var featureInFilters = scope.interactiveFilters.data.indexOf(featurePosition[0]);
                if (featureInFilters > -1) {
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        scope.removeRow(scope.interactiveFilters.data[featureInFilters]);
                        deleteFeature(feature, scope);
                    }
                } else {
                    deleteFeature(feature, scope);
                }
            }
        };
    });
