(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.ImportService
     * @memberOf accessimapEditeurDerApp
     * 
     * @description
     * Provide service to import a drawing :
     * - background layer
     * - geojson layer
     * - drawing layer
     * - interactions
     * - legend
     */
    function ImportService(LayersService, InteractionService, LegendService) {

        this.importDrawing     = importDrawing;
        this.importInteraction = importInteraction;
        this.getModelFromSVG   = getModelFromSVG;

        function isVersionOfSVGAcceptable(svgElement) {
            
            return svgElement.querySelector('svg').getAttribute('data-version') >= '0.1';

        }

        function getModelFromSVG(svgElement) {

            if (isVersionOfSVGAcceptable(svgElement)) {
                var metadataModel = svgElement.querySelector('metadata[data-name="data-model"]');
                if (metadataModel) {
                    return JSON.parse(metadataModel.getAttribute('data-value'));
                }
            }
            
            return null;
        }

        /**
         * @ngdoc method
         * @name  importDrawing
         * @methodOf accessimapEditeurDerApp.ImportService
         *
         * @description 
         * Import data from the svgElement by trying to find the layers
         * 
         * @param  {DOM Element} svgElement
         * the element to import for drawing purpose
         */
        function importDrawing(svgElement) {

            if (isVersionOfSVGAcceptable(svgElement)) {

                var geojsonLayer = svgElement.querySelector('g[data-name="geojson-layer"]'),
                    drawingLayer = svgElement.querySelector('g[data-name="drawing-layer"]'),
                    backgroundLayer = svgElement.querySelector('g[data-name="background-layer"]'),
                    metadataGeoJSON = svgElement.querySelector('metadata[data-name="data-geojson"]'),
                    metadataInteractions = svgElement.querySelector('metadata[data-name="data-interactions"]'),
                    format = svgElement.querySelector('svg').getAttribute('data-format'),
                    center = svgElement.querySelector('svg').getAttribute('data-center');

                // get the format, and adapt the overlay
                // LayersService.changeFormat(format);

                // if map displayed, display it and center on the right place
                
                function removeChildren(node) {
                    var children = node.children;

                    for (var i = 0; i < children.length; i++) {
                        node.removeChild(children[0]); // children list is live, removing a child change the list... 
                    }
                }

                function cloneChildrenFromNodeToAnotherNode(nodeFrom, nodeTo) {
                    var children = nodeFrom.children;

                    for (var i = 0; i < children.length; i++) {
                        nodeTo.appendChild(children[i]);
                    }
                }

                // if exists, inserts data of the geojson layers
                if (geojsonLayer) {
                    var currentGeoJSONLayer = LayersService.geojson.getLayer().node();
                    removeChildren(currentGeoJSONLayer);
                    cloneChildrenFromNodeToAnotherNode(geojsonLayer, currentGeoJSONLayer);
                }

                // if exists, inserts data of the drawing layers
                if (drawingLayer) {
                    var currentDrawingLayer = LayersService.drawing.getLayer().node();
                    removeChildren(currentDrawingLayer);
                    cloneChildrenFromNodeToAnotherNode(drawingLayer, currentDrawingLayer);
                }
                
                // if exists, inserts data of the drawing layers
                if (backgroundLayer) {
                    var currentBackgroundLayer = LayersService.background.getLayer().node();
                    removeChildren(currentBackgroundLayer);
                    cloneChildrenFromNodeToAnotherNode(backgroundLayer, currentBackgroundLayer);
                }

                if (metadataGeoJSON && metadataGeoJSON.getAttribute('data-value') !== '') {
                    var dataGeoJSON = JSON.parse(metadataGeoJSON.getAttribute('data-value'));
                    LayersService.geojson.setFeatures(dataGeoJSON);
                    generateLegend(dataGeoJSON);
                }

                if (metadataInteractions && metadataInteractions.getAttribute('data-value') !== '') {
                    var parser = new DOMParser();
                    importInteraction(parser.parseFromString(metadataInteractions.getAttribute('data-value'), "text/xml"))
                }

            } else {
                // it's not a draw from the der, but we will append each element in the 'drawing section'
                LayersService.drawing.getLayer().node().appendChild(svgElement.childNodes[0])
            }

        }

        function generateLegend(dataGeoJSON) {
            dataGeoJSON.forEach(function(element, index, array) {
                LegendService.addToLegend(element, element.style, index, element.color, {contour: element.contour})
            })
        }

        function importInteraction(interactionData) {

            // insertion of filters
            var filters = interactionData.querySelectorAll('filter');

            // we don't take the first filter, because it's the OSM Value by default in a DER
            for (var i = 1; i < filters.length; i++) {
                InteractionService.addFilter(filters[i].name, filters[i].gesture, filters[i].protocol )
            }

            // insertion of interactions
            var pois = interactionData.querySelectorAll('poi');

            for (var i = 0; i < pois.length; i++) {
                var actions = pois[i].querySelectorAll('action');

                for (var j = 0; j < actions.length; j++) {
                    InteractionService.setInteraction(pois[i].getAttribute('id'), 
                                                        actions[j].getAttribute('filter'), 
                                                        actions[j].getAttribute('value'));
                }
            }

        }

    }

    angular.module(moduleApp).service('ImportService', ImportService);

    ImportService.$inject = ['LayersService', 'InteractionService', 'LegendService'];
})();