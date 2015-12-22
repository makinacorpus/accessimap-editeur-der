'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.getType
 * @description
 * # getType
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('getType', function() {
        this.getType = function(feature) {
            var nodeType = feature.node().nodeName;
                switch (nodeType) {
                    case 'path':
                        var parent = feature.node().parentNode;
                        var parentId = parent.id;
                        switch (parentId) {
                            case 'points-layer':
                                return 'point';
                                break;
                            case 'lines-layer':
                                return 'line';
                                break;
                            case 'polygons-layer':
                                return 'polygon';
                                break;
                            default:
                                return null;
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
        };
  });
