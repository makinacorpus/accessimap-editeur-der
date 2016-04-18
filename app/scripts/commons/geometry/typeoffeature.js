
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.typeOf
 * @description
 * # typeOf
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function typeOfFeature() {

        this.getType = function(feature) {
            var nodeType = feature.node().nodeName;

            switch (nodeType) {
                case 'path':
                    var parent = feature.node().parentNode;

                    if (d3.select(parent).classed('vector')) {
                        parent = parent.parentNode;
                    }
                    var parentId = parent.id;

                    switch (parentId) {
                        case 'points-layer':
                            return 'point';
                            break;

                        case 'lines-layer':
                            return 'line';
                            break;

                        /*case 'polygons-layer':
                            return 'polygon';
                            break;
                        */
                        default:
                            return 'polygon';
                    }
                    break;

                case 'circle':
                    return 'circle';
                    break;

                case 'text':
                    return 'text';
                    break;

                default:
                    return null;
            }
        }

    }

    angular.module(moduleApp)
        .service('typeOfFeature', typeOfFeature);

})();