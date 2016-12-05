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
    function ExportService(InteractionService, LegendService, DrawingService, DefsService, MapService, $q) {

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
                drawingNode            = MapService.getMap().getContainer(),
                tilesNode              = null,
                legendNode             = LegendService.getNode(),
                comments               = $('#comment').val(),
                interactionsContentXML = InteractionService.getXMLExport(),
                titleDrawing           = document.createElementNS("http://www.w3.org/2000/svg", "title"),

            zip         = new JSZip(),
            exportNode  = drawingNode ? drawingNode.cloneNode(true) : null,
            sizeDrawing = DrawingService.layers.overlay.getSize() ,
            svgDrawing  = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            d3.select(svgDrawing)
                .attr('data-version', exportVersion)
                .attr('width', sizeDrawing.width)
                .attr('height', sizeDrawing.height)
                .style('overflow', 'visible')

            // patterns
            DefsService.createDefs(d3.select(svgDrawing))

            // get transform attribute of margin / frame layers
            var translateOverlayArray = DrawingService.layers.overlay.getTranslation(),
                translateReverseOverlayPx = "translate(" + ( translateOverlayArray.x * -1 ) + 'px,'
                                                         + ( translateOverlayArray.y * -1 ) + 'px)';

            d3.select(svgDrawing).attr('viewBox', translateOverlayArray.x + ' '
                                                + translateOverlayArray.y + ' '
                                                + sizeDrawing.width + ' ' + sizeDrawing.height)

            function filterDOM(node) {
                return (node.tagName !== 'svg')
            }

            // TODO: union promises with a Promise.all to maintain a sequence programmation

            // TODO: inject DEFS ? il manque les fill patterns
            var defs = DefsService.createDefs(d3.select(node))
            function initNodeState() {
                defs.remove()
                $(node).css('transform', transformStyle)
            }

            $(node).css('transform', translateReverseOverlayPx);
            domtoimage.toPng(node, {width: sizeDrawing.width, height: sizeDrawing.height, filter: filterDOM })
                .then(function(dataUrl) {

                    // save the image in a file & add it to the current zip
                    var imgBase64 = dataUrl.split('base64,')
                    zip.file('carte.png', imgBase64[1], {base64: true});

                    // add the current image to a svg:image element
                    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    d3.select(image)
                        .attr('width', sizeDrawing.width)
                        .attr('height', sizeDrawing.height)
                        .attr('x', translateOverlayArray.x)
                        .attr('y', translateOverlayArray.y)
                        .attr('xlink:href', dataUrl)

                    // create some metadata object
                    var metadataGeoJSON = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        // metadataInteractions = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataModel = document.createElementNS("http://www.w3.org/2000/svg", "metadata");

                    metadataGeoJSON.setAttribute('data-name', 'data-geojson')
                    metadataGeoJSON.setAttribute('data-value',
                            JSON.stringify(DrawingService.layers.geojson.getFeatures()))

                    // metadataInteractions.setAttribute('data-name', 'data-interactions')
                    // metadataInteractions.setAttribute('data-value', interactionsContentXML)

                    metadataModel.setAttribute('data-name', 'data-model')
                    metadataModel.setAttribute('data-value', JSON.stringify(model))

                    // Assembly of 'carte_avec_source.svg'
                    svgDrawing.appendChild(metadataGeoJSON);
                    // svgDrawing.appendChild(metadataInteractions);
                    svgDrawing.appendChild(metadataModel);

                    svgDrawing.appendChild(image);

                    svgDrawing.appendChild(d3.select(exportNode)
                                             .select("svg[data-name='background']")
                                             .style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode)
                                             .select("svg[data-name='geojson']")
                                             .style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode)
                                             .select("svg[data-name='drawing']")
                                             .style('overflow', 'visible').node());
                    svgDrawing.appendChild(d3.select(exportNode)
                                             .select("svg[data-name='overlay']")
                                             .style('overflow', 'visible').node());

                    zip.file('carte_avec_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of 'carte_sans_source.svg' => remove tiles
                    svgDrawing.removeChild(image);

                    zip.file('carte_sans_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of legend
                    if (legendNode) {

                        var svgLegend = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                            sizeLegend = LegendService.getSize(),
                            legendNodeClone = legendNode.cloneNode(true);

                        DefsService.createDefs(d3.select(svgLegend))

                        d3.select(svgLegend)
                            .attr('data-version', exportVersion)
                            .attr('width', sizeLegend.width)
                            .attr('height', sizeLegend.height)
                            .attr('viewBox', '0 0 ' + sizeLegend.width + ' ' + sizeLegend.height)
                            .style('overflow', 'visible')

                        svgLegend.appendChild(legendNodeClone);

                        zip.file('legende.svg', (new XMLSerializer()).serializeToString(svgLegend));
                    }

                    // Adding the comments
                    zip.file('commentaires.txt', comments);

                    // Adding the interactions
                    zip.file('interactions.xml', interactionsContentXML);

                    domtoimage.toPng(node, {width: sizeDrawing.width, height: sizeDrawing.height})
                        .then(function(dataUrl) {

                            initNodeState();

                            // save the image in a file & add it to the current zip
                            var imgBase64 = dataUrl.split('base64,')
                            zip.file('der.png', imgBase64[1], {base64: true});

                            // get the Braille Font & add it to the current zip
                            var urlFont = window.location.origin
                                    // pathname could be a path like 'xxx/#/route' or 'xxx/file.html'
                                    // we have to obtain 'xxx' string
                                    + ( window.location.pathname !== undefined
                                    ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'))
                                    : '' )
                                    + '/assets/fonts/Braille_2007.ttf';

                            $.ajax({
                                url: urlFont,
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
                            })

                        }).catch(function(error) {
                            console.error(error);
                            initNodeState();
                            deferred.reject(error);
                        })

                }).catch(function(error) {
                    console.error(error);
                    initNodeState();
                    deferred.reject(error);
                });

            return deferred.promise;
        }

    }

    angular.module(moduleApp).service('ExportService', ExportService);

    ExportService.$inject = ['InteractionService', 'LegendService', 'DrawingService',
                            'DefsService', 'MapService', '$q'];
})();
