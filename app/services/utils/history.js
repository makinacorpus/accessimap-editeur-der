/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.HistoryService
 * 
 * @description
 * Service exposing history functions to allow user to roll back
 */
(function() {
    'use strict';

    function HistoryService() {
        this.saveState  = saveState;
        this.init       = init;

        this.history    = [];
        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        function saveState() {
            var drawingLayer = svgDrawing.select('g[data-name="polygons-layer"]');
            this.history.push(drawingLayer)
            console.log('save state', this.history);
        }

        function resetState() {
            var drawingLayer = svgDrawing.select('g[data-name="polygons-layer"]');
            DrawingService.layers.background.appendImage(
                drawingLayer.toDataURL(), 
                MapService.getMap().getSize(),
                MapService.getMap().getPixelOrigin(), 
                MapService.getMap().getPixelBounds().min
            );
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

})();