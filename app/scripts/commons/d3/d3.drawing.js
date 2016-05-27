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

       /* this.exportData      = function(filename) {
            // shareSvg.getInteractions()
                // .then(function(interactionData) {
                    ExportService.exportData(filename, 
                            d3.select('svg.leaflet-zoom-animated').node(), 
                            d3.select('.leaflet-tile-container.leaflet-zoom-animated').node(),
                            d3.select('#der-legend').selectAll('svg').node(),
                            $('#comment').val(),
                            InteractionService.getInteractions());
                // })
        }
        */
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
         * @param  {integer} width
         * width in pixels of the svg created
         * 
         * @param  {integer} height
         * height in pixels of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         */
        function initDrawing(elements, width, height, margin) {
            
            LayersService.createLayers(elements, width, height, margin)

            ToolboxService.init(LayersService.drawing.getLayer(), 
                                LayersService.overlay.getLayer(), 
                                LayersService.overlay.getZoom );

            FeatureService.init(LayersService.drawing.getLayer())

        }

    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['LayersService', 'ToolboxService', 'settings', 'FeatureService'];

})();