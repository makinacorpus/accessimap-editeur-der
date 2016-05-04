/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayersService
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

    function LayersService(LayerOverlayService, LayerGeoJSONService, LayerDrawingService, settings) {

        // layers functions
        this.createLayers        = createLayers;

        this.geojson = {
            getLayer      : getGeoJSONLayer,
            getZoom       : getGeoJSONZoom,
            geojsonToSvg  : LayerGeoJSONService.geojsonToSvg, // TODO: rename this function to be more understable
            removeFeature : LayerGeoJSONService.removeFeature,
            updateFeature : LayerGeoJSONService.updateFeature,
            rotateFeature : LayerGeoJSONService.rotateFeature,
            drawAddress   : LayerGeoJSONService.drawAddress,
            refresh       : LayerGeoJSONService.refresh,
            getFeatures   : LayerGeoJSONService.getFeatures,
        }

        this.overlay = {
            getLayer : getOverlayLayer,
            getZoom  : getOverlayZoom,
            refresh  : LayerOverlayService.refresh,
            draw     : LayerOverlayService.draw,
            getCenter     : LayerOverlayService.getCenter,
        }

        this.drawing = {
            getLayer : getDrawingLayer,
            getZoom  : getDrawingZoom,
        }

        var _svg,
            _map, // TODO: change this dependency
            _width,
            _height,
            _margin,
            _projection,
            _latLngToLayerPoint,
            _pixelOrigin,
            _wgsOrigin,
            _wgsInitialShift,
            _zoom,
            _zoomDiff,
            _shift,
            _elements;

        /**
         * @ngdoc method
         * @name  createLayers
         * @methodOf accessimapEditeurDerApp.LayersService
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
         * @param {integer} width
         * Width in pixel of the drawing zone
         * 
         * @param {integer} height
         * Height in pixel of the drawing zone
         * 
         * @param {integer} margin
         * Margin in pixel of the drawing zone, useful for printing purpose
         */
        function createLayers(elements, width, height, margin) {

            _width = width;
            _height = height;
            _margin = margin;

            _svg = elements.overlay.sel;
            _elements = elements;

            createDefs();

            LayerGeoJSONService.createLayer(elements.geojson.sel, width, height, margin, elements.geojson.proj);
            LayerDrawingService.createLayer(elements.drawing.sel, _width, _height, _margin);
            LayerOverlayService.createLayer(elements.overlay.sel, _width, _height, _margin, elements.overlay.proj);

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

        function getOverlayZoom() {
            return _elements.overlay.proj.scale;
        }

        function getDrawingZoom() {
            return _elements.drawing.proj.scale;
        }

        function getGeoJSONZoom() {
            return _elements.geojson.proj.scale;
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayersService.createDefs
         * @methodOf accessimapEditeurDerApp.LayersService
         *
         */
        function createDefs() {

            var _defs = _svg.append("defs");
            
            _defs.append('marker')
                    .attr('id', 'arrowStartMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M9,1 L5,5 9,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'arrowStopMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L5,5 1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'straightMarker')
                    .attr('refX', 1)
                    .attr('refY', 5)
                    .attr('markerWidth', 2)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            Object.keys(settings.POLYGON_STYLES).forEach(function(value, index, array) {
                _defs.call(settings.POLYGON_STYLES[value]);
                // legendsvg.call(fillPatterns[value]);
            });

        };

    }

    angular.module(moduleApp).service('LayersService', LayersService);

    LayersService.$inject = ['LayerOverlayService', 'LayerGeoJSONService', 'LayerDrawingService', 'settings'];

})();
