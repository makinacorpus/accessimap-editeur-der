
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.remove
 * @description
 * # remove
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function remove() {

        this.removeObject = removeObject;
        
        function removeFeature(feature, scope) {
            var featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var el = featuresToUpdate.node();
            scope.deletedFeature = new XMLSerializer().serializeToString(el);
            scope.updateView();
            
            var t = document.createElement('foreignObject');
            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            featuresToUpdate.remove();
        }

        function removeObject(feature, scope) {
            // Remove previous deleted Element placeholder if it exists
            d3.select('#deletedElement').remove();

            // Some objects should not be deletable
            if (!d3.select(feature).node().classed('notDeletable')) {
                var iid = d3.select(feature).node().attr('iid'),
                    featurePosition = scope.interactiveFilters.data.filter(function(row) {
                        return row.id === 'poi-' + iid;
                    }),
                    featureInFilters = scope.interactiveFilters.data.indexOf(featurePosition[0]);

                if (featureInFilters > -1) {
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        scope.removeRow(scope.interactiveFilters.data[featureInFilters]);
                        removeFeature(feature, scope);
                    }
                }

                else {
                    removeFeature(feature, scope);
                }
            }
        }
    }

    angular.module('accessimapEditeurDerApp')
        .service('remove', remove);

})();