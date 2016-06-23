/** 
 * @ngdoc service 
 * @name accessimapEditeurDerApp.LayerService 
 * @description 
 * Service providing layer functions to add 
 * - defs 
 * -  
 * Provide functions to  
 * - init a map/draw area 
 * - draw features 
 * - export data 
 */ 
(function() { 
    'use strict'; 
 
    function LayerService(LayerBackgroundService, LayerOverlayService, LayerGeoJSONService, LayerDrawingService) { 
 
        // layers functions 
        this.createLayers        = createLayers; 
        
        this.geojson             = LayerGeoJSONService; 
        this.geojson.getLayer    = getGeoJSONLayer; 
        this.geojson.getZoom     = getGeoJSONZoom; 
        
        this.overlay             = LayerOverlayService; 
        this.overlay.getLayer    = getOverlayLayer; 
        this.overlay.getZoom     = getOverlayZoom; 
        
        this.drawing             = LayerDrawingService;
        this.drawing.getLayer    = getDrawingLayer;
        this.drawing.getZoom     = getDrawingZoom;
        
        this.background          = LayerBackgroundService; 
        this.background.getLayer = getBackgroundLayer; 
 
        var _elements = { geojson: {}, drawing: {}, overlay: {}, background: {}}; 
        this._elements = _elements; 
 
        /** 
         * @ngdoc method 
         * @name  createLayers 
         * @methodOf accessimapEditeurDerApp.LayerService 
         * 
         * @description 
         * Add all the required layers to the svg 
         * 
         * @param {Object} svg 
         * SVG node on which will be added layers 
         *  
         * @param {Object} g 
         * G node on which will be added layers of polygon, points, etc. 
         *  
         * @param  {enum} format 
         * Format (landscapeA4, landscapeA3, ...) of the drawing 
         */ 
        function createLayers(elements, format) { 
 
            _elements = elements; 
 
            LayerBackgroundService.createLayer(elements.background.sel, format, elements.background.proj); 
            LayerGeoJSONService.createLayer(elements.geojson.sel, elements.geojson.proj); 
            LayerDrawingService.createLayer(elements.drawing.sel); 
            LayerOverlayService.createLayer(elements.overlay.sel, format, elements.overlay.proj); 
 
        } 
 
        function getOverlayLayer() { 
            return _elements.overlay.sel; 
        } 
 
        function getDrawingLayer() { 
            return _elements.drawing.sel; 
        } 
 
        function getGeoJSONLayer() { 
            return _elements.geojson.sel; 
        } 
 
        function getBackgroundLayer() { 
            return _elements.background.sel; 
        } 
 
        function getOverlayZoom() { 
            return _elements.overlay.proj.scale; 
        } 
 
        function getDrawingZoom() { 
            return _elements.drawing.proj.scale; 
        } 
 
        function getGeoJSONZoom() { 
            return _elements.geojson.proj.scale; 
        } 
 
 
 
    } 
 
    angular.module(moduleApp).service('LayerService', LayerService); 
 
    LayerService.$inject = ['LayerBackgroundService', 'LayerOverlayService',  
                            'LayerGeoJSONService', 'LayerDrawingService']; 
 
})();