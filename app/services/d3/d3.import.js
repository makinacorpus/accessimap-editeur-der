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
    function ImportService(LayerService, InteractionService, LegendService, SettingsService, SVGService) {

        this.importDrawing     = importDrawing;
        this.importInteraction = importInteraction;
        this.getModelFromSVG   = getModelFromSVG;

        function isVersionOfSVGAcceptable(svgElement) {

            return svgElement.querySelector('svg').getAttribute('data-version') >= '0.1';

        }

        function getModelFromSVG(svgElement) {

            var model = null;

            if (isVersionOfSVGAcceptable(svgElement)) {
                var metadataModel = svgElement.querySelector('metadata[data-name="data-model"]');

                if (metadataModel) {
                    model = JSON.parse(metadataModel.getAttribute('data-value'));
                }
            }

            if (! model) {
                model = {
                    title           : 'Nouveau dessin',
                    isMapVisible    : false,
                    comment         : 'Pas de commentaire',
                    mapFormat       : 'landscapeA4',
                    legendFormat    : 'landscapeA4',
                    backgroundColor : SettingsService.COLORS.transparent[0], // transparent
                    backgroundStyle : SettingsService.STYLES.polygon[SettingsService.STYLES.polygon.length - 1],
                }
            }

            return model;
        }

        function cloneChildrenFromNodeAToB(nodeFrom, nodeTo, translationToApply) {

            var children = nodeFrom.children,
                paths = nodeFrom.querySelectorAll('path,circle,line,text');

            if (translationToApply) {
                for (var i = 0; i < paths.length; i++) {
                    var currentD = paths[i].getAttribute('d');

                    if (currentD) {
                        var currentParseD = SVGService.parseSVGPath(currentD),
                            currentTranslateD = SVGService.translateSVGPath(currentParseD,
                                                                                translationToApply.x,
                                                                                translationToApply.y),
                            currentSerializeD = SVGService.serializeSVGPath(currentTranslateD);

                        paths[i].setAttribute('d', currentSerializeD)
                    } else {
                        var cx = paths[i].getAttribute('cx'),
                            cy = paths[i].getAttribute('cy'),
                            x = paths[i].getAttribute('x'),
                            y = paths[i].getAttribute('y');

                        if (cx !== null ) {
                            paths[i].setAttribute('cx', parseFloat(cx) + translationToApply.x)
                            paths[i].setAttribute('cy', parseFloat(cy) + translationToApply.y)
                        } else {
                            paths[i].setAttribute('x', parseFloat(x) + translationToApply.x)
                            paths[i].setAttribute('y', parseFloat(y) + translationToApply.y)
                        }

                    }
                }
            }

            var length = children.length;

            for (var i = 0; i < length; i++) {
                nodeTo.appendChild(children[0]);
            }
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

            var

            currentGeoJSONLayer    = LayerService.geojson.getLayer().node(),
            currentDrawingLayer    = LayerService.drawing.getLayer().node(),
            currentBackgroundLayer = LayerService.background.getLayer().node(),

            geojsonLayer    = svgElement.querySelector('g[data-name="geojson-layer"]'),
            drawingLayer    = svgElement.querySelector('g[data-name="drawing-layer"]'),
            backgroundLayer = svgElement.querySelector('g[data-name="background-layer"]'),
            overlayLayer    = svgElement.querySelector('svg[data-name="overlay"]'),

            metadataGeoJSON      = svgElement.querySelector('metadata[data-name="data-geojson"]'),
            // metadataInteractions = svgElement.querySelector('metadata[data-name="data-interactions"]'),

            format = svgElement.querySelector('svg').getAttribute('data-format'),
            center = svgElement.querySelector('svg').getAttribute('data-center'),

            currentOverlayTranslation = LayerService.overlay.getTranslation(),

            translateScaleOverlayGroup = overlayLayer && overlayLayer.getAttribute('transform'),

            translateOverlayGroup = ( translateScaleOverlayGroup === null )
                                    ? null
                                    : translateScaleOverlayGroup
                                            .substring(translateScaleOverlayGroup.indexOf('(') + 1,
                                                        translateScaleOverlayGroup.indexOf(')')),

            translateOverlayGroupArray = ( translateOverlayGroup === null ) ? [0, 0]
                : translateOverlayGroup.slice(0, translateOverlayGroup.length).split(','),

            translateMarginGroup = overlayLayer
                                && overlayLayer.querySelector('g[id="margin-layer"]').getAttribute('transform'),

            translateMargin = ( translateMarginGroup === null )
                                ? null
                                : translateMarginGroup
                                        .substring(translateMarginGroup.indexOf('(') + 1,
                                                    translateMarginGroup.indexOf(')')),

            translateMarginArray = ( translateMargin === null ) ? [0, 0]
                : translateMargin.slice(0, translateMargin.length).split(','),

            translationToApply = { x: currentOverlayTranslation.x
                                        - translateOverlayGroupArray[0]
                                        - translateMarginArray[0],
                                    y: currentOverlayTranslation.y
                                        - translateOverlayGroupArray[1]
                                        - translateMarginArray[1]
                                };

            if (isVersionOfSVGAcceptable(svgElement)) {

                // if exists, inserts data of the geojson layers
                if (geojsonLayer) {
                    cloneChildrenFromNodeAToB(geojsonLayer, currentGeoJSONLayer, translationToApply);
                }

                // if exists, inserts data of the drawing layers
                if (drawingLayer) {
                    cloneChildrenFromNodeAToB(drawingLayer, currentDrawingLayer, translationToApply);
                }

                // if exists, inserts data of the drawing layers
                if (backgroundLayer) {
                    cloneChildrenFromNodeAToB(backgroundLayer, currentBackgroundLayer, translationToApply);
                }

                if (metadataGeoJSON && metadataGeoJSON.getAttribute('data-value') !== '') {
                    var dataGeoJSON = JSON.parse(metadataGeoJSON.getAttribute('data-value'));
                    LayerService.geojson.setFeatures(dataGeoJSON);
                    generateLegend(dataGeoJSON);
                }

            } else {
                // it's not a draw from the der, but we will append each element in the 'drawing section'
                // we remove metadata, namedview elements because it crash the export
                var metadata = svgElement.querySelector('metadata'),
                    namedview = svgElement.querySelector('namedview'),
                    inkscapePerspectiveElement = svgElement.querySelector('perspective'),
                    translationToApply = 'translate(' + translationToApply.x + ',' + translationToApply.y + ')';

                if (metadata) metadata.remove();

                if (namedview) namedview.remove();

                // linked to a bug when exporting a DERi with 'perspective' information from Inkscape...
                if (inkscapePerspectiveElement) inkscapePerspectiveElement.remove();

                LayerService.drawing.appendSvg(svgElement, translationToApply);
            }

        }

        function generateLegend(dataGeoJSON) {
            dataGeoJSON.forEach(function(element, index, array) {
                var currentStyle = SettingsService.STYLES[element.type].find(function(style, index, array) {
                    return style.id = element.style.id;
                })
                LegendService.addItem(element.id,
                                      element.name,
                                      element.type,
                                      currentStyle,
                                      element.color,
                                      element.contour)
            })
        }

        function importInteraction(interactionData) {
            // insertion of filters
            var filters = interactionData.querySelectorAll('filter');
            
            // Warning: reset to 0 to fix DER without OSM: (TODO: test if no regression)
            // we don't take the first filter, because it's the OSM Value by default in a DER
            for (var i = 0; i < filters.length; i++) {
                InteractionService.addFilter(filters[i].getAttribute('name'), filters[i].getAttribute('id'))
            }

            // insertion of interactions
            var pois = interactionData.querySelectorAll('poi');
            for (var i = 0; i < pois.length; i++) {
                var actions = pois[i].querySelectorAll('action');
                
                for (var j = 0; j < actions.length; j++) {
                    InteractionService.setInteraction(pois[i].getAttribute('id'),
                                                        actions[j].getAttribute('filter'),
                                                        actions[j].getAttribute('value'),
                                                        actions[j].getAttribute('gesture'),
                                                        actions[j].getAttribute('protocol'));
                }
            }

        }

    }

    angular.module(moduleApp).service('ImportService', ImportService);

    ImportService.$inject = ['LayerService', 'InteractionService', 'LegendService', 'SettingsService', 'SVGService'];

})();
