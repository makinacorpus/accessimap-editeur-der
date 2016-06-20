/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LayerService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @requires accessimapEditeurDerApp.SettingsService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function DrawingService(LayerService, ToolboxService, SettingsService) {

        this.initDrawing     = initDrawing;
        
        this.toolbox         = ToolboxService;
        this.layers          = LayerService;

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

    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['LayerService', 'ToolboxService', 'SettingsService'];

})();