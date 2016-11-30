// jscs:disable maximumNumberOfLines
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditService
 *
 * @requires accessimapEditeurDerApp.SettingsService
 * @requires accessimapEditeurDerApp.MapService
 * @requires accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LegendService
 * @requires accessimapEditeurDerApp.DefsService
 * @requires accessimapEditeurDerApp.InteractionService
 * @requires accessimapEditeurDerApp.ExportService
 * @requires accessimapEditeurDerApp.UtilService
 * @requires accessimapEditeurDerApp.ImportService
 * @requires accessimapEditeurDerApp.ModeService
 *
 * @description
 * Service used for the 'EditController', and the 'edit' view
 *
 * Provide functions to
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function EditService($q, SettingsService, MapService, DrawingService, LegendService,
        DefsService, InteractionService, ExportService, UtilService, ImportService,
        FeatureService, ModeService, RadialMenuService) {

        this.init          = init;
        this.settings      = SettingsService;
        this.featureIcon   = DrawingService.toolbox.featureIcon;
        this.insertOSMData = insertOSMData;

        this.enableAddPOI  = ModeService.enableAddPOI;
        this.disableAddPOI = ModeService.disableAddPOI;

        // Drawing services
        // TODO : reset action has to work correctly for event...
        // we have to use map event or d3 event... not both (mea culpa)
        this.resetState    = ModeService.resetState;

        // Toolbox
        this.drawPoint                     = DrawingService.toolbox.drawPoint;
        this.drawCircle                    = DrawingService.toolbox.drawCircle;
        this.changeTextColor               = DrawingService.toolbox.changeTextColor;
        this.updateBackgroundStyleAndColor = DrawingService.toolbox.updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = DrawingService.toolbox.updateFeatureStyleAndColor;
        this.updateMarker                  = DrawingService.toolbox.updateMarker;
        this.updatePoint                   = DrawingService.updatePoint;

        this.isUndoAvailable               = FeatureService.isUndoAvailable;
        this.undo                          = FeatureService.undo;

        this.enableDefaultMode             = ModeService.enableDefaultMode;
        this.enableSelectMode              = ModeService.enableSelectMode;
        this.enablePointMode               = ModeService.enablePointMode;
        this.enableCircleMode              = ModeService.enableCircleMode;
        this.enableSquareMode              = ModeService.enableSquareMode;
        this.enableTriangleMode            = ModeService.enableTriangleMode;
        this.enableLineOrPolygonMode       = ModeService.enableLineOrPolygonMode;
        this.enableTextMode                = ModeService.enableTextMode;
        this.enableImageMode               = ModeService.enableImageMode;

        this.exportData                    = function(model) {
            var deferred = $q.defer();

            model.center       = DrawingService.layers.overlay.getCenter();
            model.zoom         = zoom   ? zoom   : MapService.getMap().getZoom();
            model.mapIdVisible = MapService.getBaseLayerId();

            MapService.resetView(model.center, model.zoom, function() {
                ExportService.exportData(model).then(function() {
                    deferred.resolve()
                })
                .catch(deferred.reject)
            });

            return deferred.promise;
        }

        // Map services
        this.showMapLayer            = MapService.showMapLayer;
        this.hideMapLayer            = MapService.hideMapLayer;

        this.geojsonToSvg            = DrawingService.layers.geojson.geojsonToSvg;
        this.getFeatures             = DrawingService.layers.geojson.getFeatures;

        this.removeFeature           = DrawingService.layers.geojson.removeFeature;
        this.updateFeature           = DrawingService.layers.geojson.updateFeature;
        this.rotateFeature           = DrawingService.layers.geojson.rotateFeature;

        this.searchAndDisplayAddress = searchAndDisplayAddress;
        this.fitBounds               = function (latlng) { return MapService.getMap().fitBounds(latlng) };
        this.panTo                   = function (latlng) { return MapService.getMap().panTo(latlng) };

        this.freezeMap               = freezeMap;

        this.resetView               = function(callback) {
            MapService.resetView(center, zoom, callback);
        }

        this.rotateMap           = rotateMap;

        this.interactions        = InteractionService;

        this.changeDrawingFormat = changeDrawingFormat;
        this.changeLegendFormat  = changeLegendFormat;
        this.showFontBraille     = LegendService.showFontBraille;
        this.hideFontBraille     = LegendService.hideFontBraille;

        this.importBackground    = importBackground;
        this.importImage         = importImage;
        this.appendSvg           = appendSvg;
        this.importDER           = importDER;

        var d3Element = null,
            overlayDrawing,
            overlayGeoJSON,
            overlayBackground,
            overlay,
            center = null,
            zoom = null,
            referenceBounds, // useful to remember where to center view
            // useful to know if the map is 'freezed',
            // that is to say it's not moving anymore inside the 'format overlay'
            mapFreezed,
            // indicates if the initial scaled have been defined
            // to be used in d3svgoverlay
            // if true, we don't need to init overlay anymore
            scaleDefined = false;

        function freezeMap() {
            mapFreezed = true;
            MapService.removeMoveHandler();
            // MapService.removeViewResetHandler();
            if (scaleDefined!==true) {
                scaleDefined = true;
            }

            overlay.unFreezeScaling();
            overlayGeoJSON.unFreezeScaling();
            overlayDrawing.unFreezeScaling();
            overlayBackground.unFreezeScaling();

            center = DrawingService.layers.overlay.getCenter();
            zoom   = zoom   ? zoom   : MapService.getMap().getZoom();

        }

        function initWorkspace() {

            mapFreezed = false;
            scaleDefined = false;

            MapService.addMoveHandler(function(size, pixelOrigin, pixelBoundMin) {
                // if scale is not defined,
                // we have to re draw the overlay to keep the initial format / position
                if (scaleDefined!==true) {
                    DrawingService.layers.background.refresh(size, pixelOrigin, pixelBoundMin);
                    DrawingService.layers.overlay.refresh(size, pixelOrigin, pixelBoundMin);
                }
            })

            MapService.addClickHandler();

            overlay.freezeScaling();
            overlayGeoJSON.freezeScaling();
            overlayDrawing.freezeScaling();
            overlayBackground.freezeScaling();

            center = null;
            zoom   = null;
        }

        /**
         * @ngdoc method
         * @name  init
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Initialize the different services :
         * - MapLeaflet to init the map container
         * - Drawing to init the d3 container
         * - Legend to init the legend container
         *
         * Link the map & the d3 container on 'move' and 'viewreset' events
         *
         * @param  {[type]} drawingFormat
         * Printing format of the d3 container and the map container
         *
         * @param  {[type]} legendFormat
         * Printing format of the legend container
         */
        var selBackground, selOverlay, selDrawing, selGeoJSON,
                projBackground, projOverlay, projDrawing, projGeoJSON,
                currentDrawingFormat, currentLegendFormat ;

        function init(drawingFormat, legendFormat) {

            currentDrawingFormat = (drawingFormat === undefined
                                    && SettingsService.FORMATS[drawingFormat] === undefined)
                                    ? SettingsService.FORMATS[SettingsService.DEFAULT_DRAWING_FORMAT]
                                    : SettingsService.FORMATS[drawingFormat];
            currentLegendFormat = (legendFormat === undefined
                                    && SettingsService.FORMATS[legendFormat] === undefined)
                                    ? SettingsService.FORMATS[SettingsService.DEFAULT_LEGEND_FORMAT]
                                    : SettingsService.FORMATS[legendFormat];

            MapService.init('workspace', drawingFormat, SettingsService.ratioPixelPoint, MapService.resizeFunction);

            // Background used to import images, svg or pdf to display a background helper
            overlayBackground = L.d3SvgOverlay(function(sel, proj) {
                selBackground = sel;
                projBackground = proj;
            }, { zoomDraw: true, zoomHide: false, name: 'background'});
            overlayBackground.addTo(MapService.getMap())
            overlayBackground.freezeScaling();

            // Overlay used to import GeoJSON features from OSM
            overlayGeoJSON = L.d3SvgOverlay(function(sel, proj) {
                selGeoJSON = sel;
                projGeoJSON = proj;

                DrawingService.layers._elements.geojson.sel = sel;
                DrawingService.layers._elements.geojson.sel = proj;

                // if map is freezed, we just use the translate / zoom from d3svgoverlay
                // if not, we re draw the geojson features with reverse scaling
                if (mapFreezed !== true){
                    DrawingService.layers.geojson.refresh(proj);
                }

            }, { zoomDraw: true, zoomHide: false, name: 'geojson'});
            overlayGeoJSON.addTo(MapService.getMap())
            overlayGeoJSON.freezeScaling();

            // Overlay used to draw shapes
            overlayDrawing = L.d3SvgOverlay(function(sel, proj) {
                selDrawing = sel;
                projDrawing = proj;
                DrawingService.layers._elements.drawing.sel = sel;
                DrawingService.layers._elements.drawing.sel = proj;
            }, { zoomDraw: true, zoomHide: false, name: 'drawing'});
            overlayDrawing.addTo(MapService.getMap())
            overlayDrawing.freezeScaling();

            // Overlay used to display the printing format
            overlay = L.d3SvgOverlay(function(sel, proj) {
                selOverlay = sel;
                projOverlay = proj;
            }, { zoomDraw: false, zoomHide: false, name: 'overlay'});
            overlay.addTo(MapService.getMap())
            overlay.freezeScaling();

            DrawingService.initDrawing({
                            background: {sel: selBackground, proj: projBackground },
                            overlay: {sel: selOverlay, proj: projOverlay },
                            drawing: {sel: selDrawing, proj: projDrawing },
                            geojson: {sel: selGeoJSON, proj: projGeoJSON }
                        },
                        drawingFormat)

            initWorkspace();

            MapService.getMap().setView(MapService.getMap().getCenter(), MapService.getMap().getZoom(), {reset:true});

            // we create defs svg in a different svg of workspace & legend
            // it's useful to let #legend & #workspace svg access to patterns
            // created inside #pattern svg
            DefsService.createDefs(d3.select('#pattern'));

            LegendService.init('#legend',
                                    currentLegendFormat.width,
                                    currentLegendFormat.height,
                                    SettingsService.margin,
                                    SettingsService.ratioPixelPoint,
                                    RadialMenuService.addRadialMenu);

            FeatureService.init(selDrawing, projDrawing, MapService)
            ModeService.init(projDrawing)

        }

        function changeDrawingFormat(format) {
            // first, we set the initial state, center & zoom
            MapService.resetView(center, zoom)
            DrawingService.layers.overlay.setFormat(format);
            DrawingService.layers.background.setFormat(format);
            MapService.setMinimumSize(SettingsService.FORMATS[format].width / SettingsService.ratioPixelPoint,
                                        SettingsService.FORMATS[format].height / SettingsService.ratioPixelPoint);
            MapService.resizeFunction();
            center = DrawingService.layers.overlay.getCenter();
            MapService.resetView(center, zoom);
        }

        function changeLegendFormat(format) {
            LegendService.setFormat(SettingsService.FORMATS[format].width / SettingsService.ratioPixelPoint,
                               SettingsService.FORMATS[format].height / SettingsService.ratioPixelPoint);
        }

        /**
         * @ngdoc method
         * @name  insertOSMData
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Retrieve data from nominatim (via MapService) for a specific 'query'
         *
         */
        function insertOSMData(query, _warningCallback, _errorCallback, _infoCallback, _currentParametersFn) {

            MapService.changeCursor('progress');
            _infoCallback('Récupération des données cartographiques en cours...');

            var currentParameters = _currentParametersFn(),
            styleChosen = SettingsService.ALL_STYLES.find(function(element, index, array) {
                return element.id === currentParameters.style.id;
            }),
            colorChosen = SettingsService.ALL_COLORS.find(function(element, index, array) {
                return element.name === currentParameters.color.name;
            }),
            queryChosen = SettingsService.QUERY_LIST.find(function(element, index, array) {
                return element.id === query.id;
            }),
            checkboxModel = { contour: currentParameters.contour }

            MapService
                .retrieveData(MapService.getBounds(), query)
                .then(function successCallback(osmGeojson) {
                    if (!osmGeojson) {
                        _errorCallback('Erreur lors de la récupération des données cartographiques... Merci de recommencer.')
                    }

                    if (osmGeojson.features && osmGeojson.features.length > 0) {
                        DrawingService.layers.geojson.geojsonToSvg(osmGeojson,
                                null,
                                'node_' + osmGeojson.features[0].properties.id,
                                false,
                                queryChosen,
                                styleChosen,
                                SettingsService.STYLES[queryChosen.type],
                                colorChosen, checkboxModel, null)
                    } else {
                        _warningCallback('Aucune donnée cartographique trouvée... Merci de chercher autre chose !?')
                    }

                })
                .catch(_errorCallback)
                .finally(function finallyCallback() {
                    MapService.resetCursor();
                })
        }

        /**
         * @ngdoc method
         * @name  rotateMap
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Rotate all '.rotable' elements
         *
         * @param  {Object} angle
         * Angle in degree of the rotation
         */
        function rotateMap(angle) {
            var size = MapService.getMap().getSize();

            $('.leaflet-layer').css('transform', 'rotate(' + angle + 'deg)');
            //' ' + size.x / 2 + ' ' + size.y / 2 + ')');
            d3.selectAll('.rotable').attr('transform', 'rotate(' + angle + ')');
            //' ' + _width / 2 + ' ' + _height / 2 + ')');
        }

        /**
         * @ngdoc method
         * @name  searchAndDisplayAddress
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Search via nominatim & display the first result in d3 drawing
         *
         * Could be more clever by displaying all the results
         * and allow the user to choose the right one...
         *
         * In a future version maybe !
         *
         * @param  {String} address
         * Address to search & display
         *
         * @return {Promise}
         * The promise of the search... could be successful, or not !
         */
        function searchAndDisplayAddress(address, id, label, style, color) {
            var deferred = $q.defer();
            MapService.searchAddress(address)
                .then(function(results) {
                    // if (results.length >= 1) {
                    // display something to allow user choose an option ?
                    // } else {
                    if (results.length > 0)
                        DrawingService.layers.geojson.drawAddress(results[0], id, label, style, color);
                    // }
                    deferred.resolve(results[0]);
                })
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name  importBackground
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Import a file (SVG/PNG/JPEG/PDF) as a background of the current drawing
         *
         * Add it in the background layer
         *
         * @param  {Object} element
         * Input file to be uploaded & imported in the background
         */
        function importBackground(element) {

            UtilService.uploadFile(element)
                .then(function(data) {
                    switch (data.type) {
                        case 'image/svg+xml':
                        case 'image/png':
                        case 'image/jpeg':
                            DrawingService.layers.background.appendImage(data.dataUrl,
                                                                        MapService.getMap().getSize(),
                                                                        MapService.getMap().getPixelOrigin(),
                                                                        MapService.getMap().getPixelBounds().min);
                            break;

                        case 'application/pdf':
                            appendPdf(data.dataUrl);
                            break;

                        default:
                            console.error('Mauvais format');
                    }
                })

        }

        /**
         * @ngdoc method
         * @name  importImage
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Import an image file (SVG/PNG/JPEG) in the drawing layer, image group
         *
         * @param  {Object} element
         * Input file to be uploaded & imported in the drawing layer
         */
        function importImage(element) {

            UtilService.uploadFile(element)
                .then(function(data) {
                    switch (data.type) {
                        case 'image/svg+xml':
                        case 'image/png':
                        case 'image/jpeg':
                            DrawingService.layers.drawing.appendImage(data.dataUrl,
                                                                        MapService.getMap().getSize(),
                                                                        MapService.getMap().getPixelOrigin(),
                                                                        MapService.getMap().getPixelBounds().min);
                            break;

                        default:
                            console.error('Mauvais format');
                    }
                })

        }

        /**
         * @ngdoc method
         * @name  appendPdf
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Append the first page of a pdf in the background layer
         *
         * @param  {dataUrl} image
         * dataUrl (could be png, jpg, ...) to insert in the background
         *
         */
        function appendPdf(dataURI) {
            var BASE64_MARKER = ';base64,',
                base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
                base64 = dataURI.substring(base64Index),
                raw = window.atob(base64),
                rawLength = raw.length,
                array = new Uint8Array(new ArrayBuffer(rawLength));

            for (var i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            PDFJS.getDocument(array)
            .then(function(pdf) {
                pdf.getPage(1).then(function(page) {
                    var scale = 1.5,
                        viewport = page.getViewport(scale),
                        canvas = document.createElement('canvas'), //document.getElementById('pdf-canvas'),
                        context = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext).then(function() {
                        DrawingService.layers.background.appendImage(canvas.toDataURL(), MapService.getMap().getSize(),
                            MapService.getMap().getPixelOrigin(), MapService.getMap().getPixelBounds().min);
                    });
                });
            });
        }

        function appendSvg(path) {

            d3.xml(path, function(xml) {
                // adapt the format of the drawing
                $(xml.documentElement).data('format')

                // Load polygon fill styles taht will be used on common map
                var originalSvg = d3.select(xml.documentElement),
                    children = originalSvg[0][0].children,
                    returnChildren = function() {
                        return children[i];
                    };

                for (var i = 0; i < children.length; i++) {
                    var id = d3.select(children[i]).attr('id'),
                        element = d3.select(children[i]);

                    if (id !== 'margin-layer'
                        && id !== 'frame-layer'
                        && id !== 'background-layer') {
                        d3.select(children[i]).classed('sourceDocument', true);
                        DrawingService.layers.background.append(returnChildren);
                    }
                }

            });
        }

        function importDER(element) {

            var deferred = $q.defer();

            function initUpload() {

                MapService.resetView(center, zoom);

                initWorkspace();

                // empty the svg:g
                // var currentGeoJSONLayer = DrawingService.layers.geojson.getLayer().node(),
                //     currentDrawingLayer = DrawingService.layers.drawing.getLayer().node(),
                //     currentBackgroundLayer = DrawingService.layers.background.getLayer().node();
                //
                // // if map displayed, display it and center on the right place
                // function removeChildren(node) {
                //     var children = node.children,
                //         length = children.length;
                //
                //     for (var i = 0; i < length; i++) {
                //         node.removeChild(children[0]); // children list is live, removing a child change the list...
                //     }
                // }
                //
                // removeChildren(currentGeoJSONLayer);
                // removeChildren(currentDrawingLayer);
                // removeChildren(currentBackgroundLayer);

                DrawingService.layers.geojson.resetFeatures();

            }

            UtilService.uploadFile(element)
                .then(function(data) {

                    switch (data.type) {
                        case 'image/svg+xml':
                            initUpload();
                            d3.xml(data.dataUrl, function loadDrawingFromSVG(svgElement) {
                                var model = ImportService.getModelFromSVG(svgElement);
                                ImportService.importDrawing(svgElement);
                                freezeMap();
                                deferred.resolve(model);
                            })
                            break;

                        case 'application/zip':
                        case 'application/x-zip-compressed':
                        case 'application/binary':
                        case 'binary/octet-stream':
                            initUpload();
                            JSZip.loadAsync(element.files[0]).then(function loadDrawingFromZip(zip) {

                                var commentairesPath,
                                    legendPath,
                                    drawingPath,
                                    interactionPath,
                                    legendElement, svgElement, interactionData;

                                zip.forEach(function getPath(relativePath, zipEntry) {

                                    if (relativePath.indexOf("carte_sans_source.svg") >= 0) {
                                        drawingPath = relativePath;
                                    }

                                    if (relativePath.indexOf("interactions.xml") >= 0) {
                                        interactionPath = relativePath;
                                    }
                                });

                                var parser = new DOMParser();

                                if (drawingPath) {
                                    zip.file(drawingPath).async("string").then(function importDrawing(data) {

                                        var svgElement = parser.parseFromString(data, "text/xml"),
                                            model = ImportService.getModelFromSVG(svgElement);

                                        changeDrawingFormat(model.mapFormat)

                                        if (model.isMapVisible) {
                                            MapService.showMapLayer(model.mapIdVisible);
                                        }

                                        if (model.center !== null && model.zoom !== null) {
                                            center = model.center;
                                            zoom = model.zoom;

                                            MapService.resetView(center, zoom);
                                            freezeMap();
                                        }

                                        ImportService.importDrawing(svgElement)
                                        // DrawingService.toolbox.addRadialMenus();
                                        ModeService.enableDefaultMode();
                                        deferred.resolve(model);

                                    })
                                } else {
                                    deferred.reject('Fichier carte_sans_source.svg non trouvé dans l\'archive')
                                }

                                if (interactionPath) {
                                    zip.file(interactionPath).async("string")
                                    .then(function importInteraction(data) {
                                        ImportService.importInteraction(parser.parseFromString(data, "text/xml"));
                                    })
                                }

                                // TODO: make a Promise.all to manage the import time

                            });

                            break;

                        default:
                            deferred.reject('Fichier au mauvais format !...' + data.type)
                    }

                })

            return deferred.promise;

        }

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['$q',
                            'SettingsService',
                            'MapService',
                            'DrawingService',
                            'LegendService',
                            'DefsService',
                            'InteractionService',
                            'ExportService',
                            'UtilService',
                            'ImportService',
                            'FeatureService',
                            'ModeService',
                            'RadialMenuService',
                            ];

})();
