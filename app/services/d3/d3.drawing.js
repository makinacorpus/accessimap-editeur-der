/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LayerService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function DrawingService(LayerService, ToolboxService) {

        this.initDrawing = initDrawing;
        
        this.toolbox     = ToolboxService;
        this.layers      = LayerService;
        this.updatePoint = updatePoint;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.DrawingService.initDrawing
         * @methodOf accessimapEditeurDerApp.DrawingService
         *
         * @description
         * Create the drawing svg in a dom element with specific size
         *
         * @param  {Object} elements
         * Object containing each layer (overlay, drawing, geojson) with a sel & proj property
         * 
         * These properties are given by D3SvgOverlay and help us to display at the right place features & drawings
         * 
         * @param  {enum} format
         * Format (landscapeA4, landscapeA3, ...) of the drawing
         * 
         */
        function initDrawing(elements, format) {
            LayerService.createLayers(elements, format)

            ToolboxService.init(LayerService.drawing.getLayer(), 
                                LayerService.overlay.getLayer(), 
                                LayerService.overlay.getZoom )

        }

        /**
         * @ngdoc method
         * @name  updateFeatureStyleAndColor
         * @methodOf accessimapEditeurDerApp.DrawingService
         *
         * @description 
         * Update the style (pattern) & color of a feature.
         * Could be a geojson feature or a drawing feature.
         * 
         * @param {Object} style 
         * SettingsService.STYLES object
         * 
         */
        function updatePoint(style) {

            var currentSelection = d3.select('.styleEdition'),
                featureId = currentSelection.attr('id'),
                featureFrom = currentSelection.attr('data-from');

            if (featureFrom === 'drawing') {
                ToolboxService.updateFeatureStyleAndColor(style, null);
            } else if (featureFrom === 'osm') {
                // find the id of the current feature
                var idFound = null,
                    currentParent = currentSelection.node().parentNode;
                
                while (! currentParent.getAttribute('id')) {
                    currentParent = currentParent.parentNode;
                }

                layers.geojson.updateFeature(currentParent.getAttribute('id'), style)
            }
            currentSelection.classed('styleEdition', false)
        }

    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['LayerService', 'ToolboxService'];

})();