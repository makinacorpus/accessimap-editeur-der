/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LayersService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.FeatureService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function DrawingService(LayersService, ToolboxService, settings, FeatureService) {

        this.initDrawing     = initDrawing;
        
        this.isUndoAvailable = FeatureService.isUndoAvailable;
        this.undo            = FeatureService.undo;
        this.toolbox = ToolboxService;
        this.layers  = LayersService;

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
            
            LayersService.createLayers(elements, format)

            ToolboxService.init(LayersService.drawing.getLayer(), 
                                LayersService.overlay.getLayer(), 
                                LayersService.overlay.getZoom );

            FeatureService.init(LayersService.drawing.getLayer())

        }

    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['LayersService', 'ToolboxService', 'settings', 'FeatureService'];

})();