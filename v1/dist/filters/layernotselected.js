
/**
 * @ngdoc filter
 * @name accessimapEditeurDerApp.filter:layerNotSelected
 * @function
 * 
 * @description
 * Return all the layers not selected from an array of layers 
 * & another of selected layers
 * 
 * Intersection between layers'set and selectedLayer'set
 */
(function() {
    'use strict';

    angular.module(moduleApp)
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
})();