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
    function ExportService(InteractionService, LegendService, DrawingService, DefsService, MapService, $q, $http) {

        this.exportData = exportData;

        var exportVersion = '0.1';

        // TODO: add parameters to not have to use DOM selectors.
        // this function have to be independant from the DOM
        // To be added : drawingNode, legendNode, interactions
        function exportData(model) {

            var deferred = $q.defer();

            if (! model.title)
                model.title = 'der';

            var node                   = MapService.getMap().getPanes().mapPane,
                transformStyle         = $(node).css('transform'),
                drawingNode            = MapService.getMap().getContainer(), // d3.select('svg.leaflet-zoom-animated').node(),
                tilesNode              = null,
                legendNode             = LegendService.getNode(),
                comments               = $('#comment').val(),
                interactionsContentXML = InteractionService.getXMLExport(),
                titleDrawing           = document.createElementNS("http://www.w3.org/2000/svg", "title"),

            zip        = new JSZip(),
            exportNode = drawingNode ? drawingNode.cloneNode(true) : null,
            size       = DrawingService.layers.overlay.getSize() ,
            svgDrawing = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            d3.select(svgDrawing)
                .attr('data-version', exportVersion)
                .attr('width', size.width)
                .attr('height', size.height)
                .style('overflow', 'visible')

            // patterns
            DefsService.createDefs(d3.select(svgDrawing))

            // get transform attribute of margin / frame layers
            var translateOverlayArray = DrawingService.layers.overlay.getTranslation(),
                translateReverseOverlayPx = "translate(" + ( translateOverlayArray.x * -1 ) + 'px,' + ( translateOverlayArray.y * -1 ) + 'px)';

            d3.select(svgDrawing).attr('viewBox', translateOverlayArray.x + ' ' + translateOverlayArray.y+ ' ' + size.width + ' ' + size.height)
            
            function filterDOM(node) {
                return (node.tagName !== 'svg')
            }


            
            // DefsService.createDefs(d3.select(node))
            // TODO: union promises with a Promise.all to maintain a sequence programmation
            $(node).css('transform', translateReverseOverlayPx)
            domtoimage.toPng(node, {width: size.width, height: size.height, filter: filterDOM})
                .then(function(dataUrl) { 
                    
                    // save the image in a file & add it to the current zip
                    var imgBase64 = dataUrl.split('base64,')
                    zip.file('carte.png', imgBase64[1], {base64: true});

                    // add the current image to a svg:image element
                    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    d3.select(image)
                        .attr('width', size.width)
                        .attr('height', size.height)
                        .attr('x', translateOverlayArray.x)
                        .attr('y', translateOverlayArray.y)
                        .attr('xlink:href', dataUrl)

                    // create some metadata object 
                    var metadataGeoJSON = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        // metadataInteractions = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataModel = document.createElementNS("http://www.w3.org/2000/svg", "metadata");

                    metadataGeoJSON.setAttribute('data-name', 'data-geojson')
                    metadataGeoJSON.setAttribute('data-value', JSON.stringify(DrawingService.layers.geojson.getFeatures()))

                    // metadataInteractions.setAttribute('data-name', 'data-interactions')
                    // metadataInteractions.setAttribute('data-value', interactionsContentXML)

                    metadataModel.setAttribute('data-name', 'data-model')
                    metadataModel.setAttribute('data-value', JSON.stringify(model))

                    // Assembly of 'carte_avec_source.svg'
                    svgDrawing.appendChild(metadataGeoJSON);
                    // svgDrawing.appendChild(metadataInteractions);
                    svgDrawing.appendChild(metadataModel);
                    
                    svgDrawing.appendChild(image);

                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='background']").style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='geojson']").style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='drawing']").style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='overlay']").style('overflow', 'visible').node());

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

                    // TODO: inject DEFS ? il manque les fill patterns
                    domtoimage.toPng(node, {width: size.width, height: size.height})
                        .then(function(dataUrl) { 

                            $(node).css('transform', transformStyle)

                            // save the image in a file & add it to the current zip
                            var imgBase64 = dataUrl.split('base64,')
                            zip.file('der.png', imgBase64[1], {base64: true});

                            // get the Braille Font & add it to the current zip
                            $.ajax({
                                url: "/assets/fonts/Braille_2007.ttf",
                                type: "GET",
                                dataType: 'binary',
                                processData: false,
                                success: function(result) {
                                    zip.file('Braille_2007.ttf', result, {binary: true})
                                    zip.generateAsync({type: 'blob'})
                                        .then(function(content) {
                                            saveAs(content, model.title + '.zip');
                                            deferred.resolve(model.title + '.zip');
                                        }).catch(deferred.reject)
                                },
                                error: function(error) {
                                    deferred.reject('Braille font ' + error.statusText)
                                }
                            });             

                        }).catch(deferred.reject)

                }).catch(deferred.reject)
            
            return deferred.promise;
        }

    }

    angular.module(moduleApp).service('ExportService', ExportService);

    ExportService.$inject = ['InteractionService', 'LegendService', 'DrawingService', 'DefsService', 'MapService', '$q', '$http'];
})();