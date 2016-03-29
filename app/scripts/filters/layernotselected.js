'use strict';

/**
 * @ngdoc filter
 * @name accessimapEditeurDerApp.filter:layerNotSelected
 * @function
 * @description
 * # layerNotSelected
 * Filter in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .filter('layerNotSelected', function() {
        return function(layers, selectedLayers) {
            var filteredLayers = [];
            angular.forEach(layers, function(layer) {
                var toAdd = true;
                angular.forEach(selectedLayers, function(selectedLayer) {
                    if (layer.id === selectedLayer.id) {
                        toAdd = false;
                    }
                });

                if (toAdd) {
                    filteredLayers.push(layer);
                }
            });

            return filteredLayers;
        };
    });
