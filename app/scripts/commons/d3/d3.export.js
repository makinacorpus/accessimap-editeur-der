(function() {
    'use strict';

    /*global JSZip, saveAs */
    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.ExportService
     * @memberOf accessimapEditeurDerApp
     * @module 
     * @description
     * Service in the accessimapEditeurDerApp.
     */
    function ExportService(shareSvg, InteractionService, LegendService, DrawingService, DefsService, MapService) {

        this.exportData = exportData;

        var exportVersion = '0.1';

        // TODO: add parameters to not have to use DOM selectors.
        // this function have to be independant from the DOM
        // To be added : drawingNode, legendNode, interactions
        function exportData(model) {

            if (! model.title)
                model.title = 'Dessin en relief fait avec Accessimap';

            var node = MapService.getMap().getPanes().mapPane,
                // center = DrawingService.layers.overlay.getCenter(),
                transformStyle = $(node).css('transform'),
                drawingNode = MapService.getMap().getContainer(), // d3.select('svg.leaflet-zoom-animated').node(),
                tilesNode = null,
                legendNode = LegendService.getNode(),
                comments = $('#comment').val(),
                interactionsContentXML = InteractionService.getXMLExport(),
                titleDrawing = document.createElementNS("http://www.w3.org/2000/svg", "title"),

            zip    = new JSZip(),
            exportNode = drawingNode ? drawingNode.cloneNode(true) : null,
            width = 1049 , // d3.select(drawingNode).attr('width'),
            height = 742 , // d3.select(drawingNode).attr('height'),
            format = 'landscapeA4' ,
            svgDrawing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            d3.select(svgDrawing)
                .attr('data-format', format)
                .attr('data-version', exportVersion)
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', '0 0 ' + width + ' ' + height)

            // patterns
            DefsService.createDefs(d3.select(svgDrawing))

            // get transform attribute of margin / frame layers
            var translateScaleOverlayGroup = DrawingService.layers.overlay.getLayer().attr('transform'),
                translateOverlayGroup = ( translateScaleOverlayGroup === null ) 
                                            ? null 
                                            : translateScaleOverlayGroup.substring(translateScaleOverlayGroup.indexOf('(') + 1, translateScaleOverlayGroup.indexOf(')')),
                translateOverlayGroupArray = ( translateOverlayGroup === null ) 
                                                ? [0, 0] 
                                                : translateOverlayGroup.slice(0, translateOverlayGroup.length).split(','),
                
                translateOverlay = d3.select(exportNode).select('#margin-layer').attr('transform'),
                translateOverlayArray = translateOverlay.slice(translateOverlay.indexOf('(') + 1, translateOverlay.length - 1).split(','),

                translateGeoJSON = d3.select(exportNode).select('#geojson-layer').attr('transform'),
                translateGeoJSONArray = translateGeoJSON.slice(translateGeoJSON.indexOf('(') + 1, translateGeoJSON.length - 1).split(','),

                translateReverseOverlay = "translate(" + ( ( translateOverlayArray[0] ) * -1 ) + ',' + ( ( translateOverlayArray[1] ) * -1 ) + ')',
                translateReverseGeoJSON = "translate(" + ( ( translateOverlayArray[0] + translateGeoJSONArray[0]  ) * -1 ) + ',' + ( ( translateOverlayArray[1] + translateGeoJSONArray[1] ) * -1 ) + ')',
                translateReverseOverlayPx = "translate(" + ( ( parseInt(translateOverlayArray[0]) + parseInt(translateOverlayGroupArray[0]) ) * -1 ) + 'px,' + ( ( parseInt(translateOverlayArray[1]) + parseInt(translateOverlayGroupArray[1]) ) * -1 ) + 'px)';

            d3.select(exportNode).select("svg[data-name='overlay'] > g").attr('transform', ''); 
                      
            d3.select(exportNode).select('#margin-layer').attr('transform', '');           
            d3.select(exportNode).select('#frame-layer').attr('transform', '');            
            d3.select(exportNode).select('#geojson-layer').attr('transform', translateReverseOverlay);            
            d3.select(exportNode).select('#drawing-layer').attr('transform', translateReverseOverlay);            
            d3.select(exportNode).select('#background-layer').attr('transform', translateReverseOverlay);            
            
            // we apply a transformation to facilitate the export 
            // TODO: see if it's necessary with a special viewbox
            $(node).css('transform', translateReverseOverlayPx);

            function filterDOM(node) {
                return (node.tagName !== 'svg')
            }

            domtoimage.toPng(node, {width: width, height: height, filter: filterDOM})
                .then(function(dataUrl) { 
                    $(node).css('transform', transformStyle);

                    // save the image in a file & add it to the current zip
                    var imgBase64 = dataUrl.split('base64,')
                    zip.file('carte.png', imgBase64[1], {base64: true});

                    // add the current image to a svg:image element
                    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    d3.select(image)
                        .attr('width', width)
                        .attr('height', height)
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('xlink:href', dataUrl)

                    // create some metadata object 
                    var metadataGeoJSON = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataInteractions = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataModel = document.createElementNS("http://www.w3.org/2000/svg", "metadata");

                    metadataGeoJSON.setAttribute('data-name', 'data-geojson')
                    metadataGeoJSON.setAttribute('data-value', JSON.stringify(DrawingService.layers.geojson.getFeatures()))

                    metadataInteractions.setAttribute('data-name', 'data-interactions')
                    metadataInteractions.setAttribute('data-value', interactionsContentXML)

                    metadataModel.setAttribute('data-name', 'data-model')
                    metadataModel.setAttribute('data-value', JSON.stringify(model))

                    // Assembly of 'carte_avec_source.svg'
                    svgDrawing.appendChild(metadataGeoJSON);
                    svgDrawing.appendChild(metadataInteractions);
                    svgDrawing.appendChild(metadataModel);
                    
                    svgDrawing.appendChild(image);

                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='background']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='geojson']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='drawing']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='overlay']").node());

                    zip.file('carte_avec_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of 'carte_sans_source.svg' => remove tiles
                    svgDrawing.removeChild(image);

                    zip.file('carte_sans_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of legend
                    if (legendNode) {

                        var svgLegend = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                            legendNodeClone = legendNode.cloneNode(true);

                        DefsService.createDefs(d3.select(svgLegend))

                        svgLegend.appendChild(legendNodeClone);

                        zip.file('legende.svg', (new XMLSerializer()).serializeToString(svgLegend));
                    }

                    // Adding the comments
                    zip.file('commentaires.txt', comments);

                    // Adding the interactions
                    zip.file('interactions.xml', interactionsContentXML);

                    // Build the zip & send the file to the user
                    zip.generateAsync({type: 'blob'})
                        .then(function(content) {
                            saveAs(content, model.title + '.zip');
                        })

                })

        }

    }

    angular.module(moduleApp).service('ExportService', ExportService);

    ExportService.$inject = ['shareSvg', 'InteractionService', 'LegendService', 'DrawingService', 'DefsService', 'MapService'];
})();