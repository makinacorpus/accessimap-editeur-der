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
            var el = feature.node();
            scope.$apply(function() {
                scope.deletedFeature = new XMLSerializer().serializeToString(el);
            });
            var t = document.createElement('foreignObject');
            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            el.remove();
            return true
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



            // function deleteFeature(el) {
            //     $scope.$apply(function() {
            //         $scope.deletedFeature = new XMLSerializer().serializeToString(el);
            //     });
            //     var t = document.createElement('foreignObject');
            //     d3.select(t).attr('id', 'deletedElement');
            //     el.parentNode.insertBefore(t, el);
            //     el.remove();
            // }

            // function deleteOnClick(el) {
            //     el.on('click', function() {
            //         // Remove previous deleted Element placeholder if it exists
            //         d3.select('#deletedElement').remove();

            //         // Some objects should not be deletable
            //         if (!d3.select(this).classed('notDeletable')) {
            //             var iid = d3.select(this).attr('iid');

            //             var featurePosition = $scope.interactiveFilters.data.filter(function(row) {
            //                 return row.id === 'poi-' + iid;
            //             });
            //             var featureInFilters = $scope.interactiveFilters.data.indexOf(featurePosition[0]);
            //             if (featureInFilters > -1) {
            //                 if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
            //                     $scope.removeRow($scope.interactiveFilters.data[featureInFilters]);
            //                     deleteFeature(this);
            //                 }
            //             } else {
            //                 deleteFeature(this);
            //             }
            //         }
            //     });
            // }