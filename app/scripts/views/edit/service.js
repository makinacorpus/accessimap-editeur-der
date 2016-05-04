/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditService
 * 
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.MapService
 * @requires accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LegendService
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

    function EditService($q, settings, MapService, DrawingService, LegendService) {

        this.init          = init;
        this.settings      = settings;
        this.featureIcon   = DrawingService.toolbox.featureIcon;
        this.enableAddPOI  = enableAddPOI;
        this.insertOSMData = insertOSMData;
        this.disableAddPOI = disableAddPOI;

        // Drawing services
        // TODO : reset action has to work correctly for event...
        // we have to use map event or d3 event... not both (mea culpa)
        this.resetActions = function() {
            d3.selectAll('path:not(.menu-segment)')
                .on('click', function() {
                });
            d3.selectAll('svg')
                .on('click', function() {
                });
            d3.select('body')
                .on('keydown', function() {
                });
            d3.selectAll('path')
                .attr('marker-mid', null);
            //$('#der').css('cursor', 'auto');

            d3.selectAll('.ongoing').remove();

            d3.selectAll('.blink').classed('blink', false);
            d3.selectAll('.edition').classed('edition', false);
            d3.selectAll('.styleEdition').classed('styleEdition', false);
            d3.selectAll('.highlight').classed('highlight', false);


            MapService.removeEventListeners();
        }

        // Toolbox
        this.changeTextColor               = DrawingService.toolbox.changeTextColor;
        this.updateBackgroundStyleAndColor = DrawingService.toolbox.updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = DrawingService.toolbox.updateFeatureStyleAndColor;
        this.updateMarker                  = DrawingService.toolbox.updateMarker;
        this.addRadialMenus                = DrawingService.toolbox.addRadialMenus;
        this.isUndoAvailable               = DrawingService.isUndoAvailable;
        this.undo                          = DrawingService.undo;
        this.enablePointMode               = enablePointMode;
        this.drawPoint                     = DrawingService.toolbox.drawPoint;
        this.enableCircleMode              = enableCircleMode;
        this.drawCircle                    = DrawingService.toolbox.drawCircle;
        this.enableLineOrPolygonMode       = enableLineOrPolygonMode;
        this.enableTextMode                = enableTextMode;
        this.exportData                    = DrawingService.exportData;

        // Map services
        this.showMapLayer                  = MapService.showMapLayer;
        this.hideMapLayer                  = MapService.hideMapLayer;

        this.geojsonToSvg                  = DrawingService.layers.geojson.geojsonToSvg;
        this.getFeatures                   = DrawingService.layers.geojson.getFeatures;
        
        this.removeFeature                 = DrawingService.layers.geojson.removeFeature;
        this.updateFeature                 = DrawingService.layers.geojson.updateFeature;
        this.rotateFeature                 = DrawingService.layers.geojson.rotateFeature;
        
        this.searchAndDisplayAddress       = searchAndDisplayAddress;
        this.fitBounds                     = fitBounds;
        this.panTo                         = panTo;

        this.freezeMap                     = freezeMap;

        this.resetZoom                     = resetZoom;

        this.rotateMap                     = rotateMap;

        this.changeDrawingFormat = changeDrawingFormat;
        this.changeLegendFormat = changeLegendFormat;
        this.toggleLegendFontBraille = LegendService.toggleFontBraille;

        var d3Element = null, 
            overlayDrawing, 
            overlayGeoJSON, 
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
            if (scaleDefined!==true){
                scaleDefined = true;
            }

            overlay.unFreezeScaling();
            overlayGeoJSON.unFreezeScaling();
            overlayDrawing.unFreezeScaling();

            center = ( center === null ) ? MapService.getMap().getCenter() : center ;
            zoom = ( zoom === null ) ? MapService.getMap().getZoom() : zoom;

        }
        
        function initMode() {
            MapService.changeCursor('crosshair');
            MapService.removeEventListeners();
        }
        

        function enablePointMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawPoint(p.x, p.y, drawingParameters.style, drawingParameters.color);
            })

        }

        function enableCircleMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawCircle(p.x, 
                                        p.y, 
                                        drawingParameters.style, 
                                        drawingParameters.color, 
                                        drawingParameters.contour)
            })

            MapService.addMouseMoveListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.updateCircleRadius(p.x, p.y);
            })

        }

        function enableLineOrPolygonMode(getDrawingParameter) {

            initMode();

            var lastPoint = null,
                lineEdit = [];

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.beginLineOrPolygon(p.x, 
                                                p.y, 
                                                drawingParameters.style, 
                                                drawingParameters.color, 
                                                drawingParameters.contour, 
                                                drawingParameters.mode, 
                                                lastPoint, 
                                                lineEdit);
                lastPoint = p;
            })

            MapService.addMouseMoveListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawHelpLineOrPolygon(p.x, 
                                                    p.y, 
                                                    drawingParameters.style, 
                                                    drawingParameters.color, 
                                                    drawingParameters.contour, 
                                                    drawingParameters.mode, 
                                                    lastPoint);
            })

            MapService.addDoubleClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.finishLineOrPolygon(p.x, 
                                                    p.y, 
                                                    drawingParameters.style, 
                                                    drawingParameters.color, 
                                                    drawingParameters.mode);
                lastPoint = null;
                lineEdit = [];
            })

        }

        function enableTextMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.writeText(p.x, p.y, drawingParameters.font, drawingParameters.fontColor);
            })

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
        var selOverlay, selDrawing, selGeoJSON, 
                projOverlay, projDrawing, projGeoJSON ;

        function init(drawingFormat, legendFormat) {

            if (drawingFormat === undefined) 
                drawingFormat = settings.FORMATS[settings.DEFAULT_DRAWING_FORMAT];
            
            if (legendFormat === undefined) 
                legendFormat = settings.FORMATS[settings.DEFAULT_LEGEND_FORMAT];

            MapService.initMap('workspace', 
                            drawingFormat.width, 
                            drawingFormat.height, 
                            settings.ratioPixelPoint,
                            MapService.resizeFunction);


            overlayGeoJSON = L.d3SvgOverlay(function(sel, proj) {
                selGeoJSON = sel;
                projGeoJSON = proj;

                // if map is freezed, we just use the translate / zoom from d3svgoverlay
                // if not, we re draw the geojson features with reverse scaling
                if (mapFreezed !== true){
                    DrawingService.layers.geojson.refresh(proj);
                }

            }, { zoomDraw: true, zoomHide: false, name: 'geojson'});


            overlayGeoJSON.addTo(MapService.getMap())

            overlayGeoJSON.freezeScaling();

            overlayDrawing = L.d3SvgOverlay(function(sel, proj) {
                selDrawing = sel;
                projDrawing = proj;
            }, { zoomDraw: true, zoomHide: false, name: 'drawing'});

            overlayDrawing.addTo(MapService.getMap())
            
            overlayDrawing.freezeScaling();

            overlay = L.d3SvgOverlay(function(sel, proj) {
                selOverlay = sel;
                projOverlay = proj;
            }, { zoomDraw: false, zoomHide: false, name: 'overlay'});

            overlay.addTo(MapService.getMap())

            overlay.freezeScaling();

            DrawingService.initDrawing({
                            overlay: {sel: selOverlay, proj: projOverlay },
                            drawing: {sel: selDrawing, proj: projDrawing },
                            geojson: {sel: selGeoJSON, proj: projGeoJSON }
                        }, 
                        drawingFormat.width / settings.ratioPixelPoint, 
                        drawingFormat.height / settings.ratioPixelPoint, 
                        settings.margin)

            mapFreezed = false;
            MapService.addMoveHandler(function(size, pixelOrigin, pixelBoundMin) {
                // if scale is not defined, we have to re draw the overlay to keep the initial format
                if (scaleDefined!==true) {
                    DrawingService.layers.overlay.refresh(size, pixelOrigin, pixelBoundMin);
                }
            })

            LegendService.initLegend('#legend', 
                                    legendFormat.width, 
                                    legendFormat.height, 
                                    settings.margin, 
                                    settings.ratioPixelPoint);

        }

        function changeDrawingFormat(format) {
            resetZoom()
            DrawingService.layers.overlay.draw(settings.FORMATS[format].width / settings.ratioPixelPoint, 
                                                settings.FORMATS[format].height / settings.ratioPixelPoint);
            MapService.setMinimumSize(settings.FORMATS[format].width / settings.ratioPixelPoint,
                                        settings.FORMATS[format].height / settings.ratioPixelPoint);
            MapService.resizeFunction();
            center = DrawingService.layers.overlay.getCenter();
            console.log(center)
            resetZoom();
            // MapService.getMap().invalidateSize()
        }

        function changeLegendFormat(format) {
            
        }

        /**
         * @ngdoc method
         * @name  enableAddPOI
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Enable the 'Add POI' mode, 
         * allowing user to click on the map and retrieve data from OSM
         * 
         * @param {function} _successCallback 
         * Callback function called when data has been retrieved, data is passed in first argument
         * 
         * @param {function} _errorCallback 
         * Callback function called when an error occured, error is passed in first argument
         */
        function enableAddPOI(_successCallback, _errorCallback) {

            initMode();

            MapService.addClickListener(function(e) {
                // TODO: prevent any future click 
                // user has to wait before click again
                MapService.changeCursor('progress');
                
                MapService
                    .retrieveData([e.latlng.lng,  e.latlng.lat], settings.QUERY_LIST[0])
                    .then(_successCallback)
                    .catch(_errorCallback)
                    .finally(function finallyCallback() {
                        MapService.changeCursor('crosshair');
                    })
            })
        }

        /**
         * @ngdoc method
         * @name  disableAddPOI
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Disable the 'Add POI' mode by resetting CSS cursor.
         * 
         */
        function disableAddPOI() {
            MapService.resetCursor();
        }

        /**
         * @ngdoc method
         * @name  insertOSMData
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Retrieve data from nominatim (via MapService) for a specific 'query'
         * 
         * @param {function} query 
         * Query settings from settings.QUERY_LIST
         * 
         * @param {function} _successCallback 
         * Callback function called when data has been retrieved, data is passed in first argument
         * 
         * @param {function} _errorCallback 
         * Callback function called when an error occured, error is passed in first argument
         */
        function insertOSMData(query, _successCallback, _errorCallback) {

            MapService.changeCursor('progress');
            
            MapService
                .retrieveData(MapService.getBounds(), query)
                .then(_successCallback)
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

            $('.leaflet-layer').css('transform', 'rotate(' + angle + 'deg)'); //' ' + size.x / 2 + ' ' + size.y / 2 + ')');
            // d3.selectAll('.rotable')
                // .attr('transform', 'rotate(' + angle + ' ' + _width / 2 + ' ' + _height / 2 + ')');
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
        function searchAndDisplayAddress(address, id, style, color) {
            var deferred = $q.defer();
            MapService.searchAddress(address)
                .then(function(results) {
                    // if (results.length >= 1) {
                    // display something to allow user choose an option ?
                    // } else {
                    if (results.length > 0)
                        DrawingService.layers.geojson.drawAddress(results[0], id, style, color);
                    // }
                    deferred.resolve(results[0]);
                })
            return deferred.promise;
        }

        function fitBounds(points) {
            MapService.getMap().fitBounds(points);
        }

        function panTo(point) {
            MapService.getMap().panTo(point);
        }

        function resetZoom() {
            console.log(center)
            if (center !== null && zoom !== null)
                MapService.getMap().setView(center, zoom)
            // if (referenceBounds !== null && referenceBounds !== undefined) {
            //     MapService.getMap().fitBounds(referenceBounds);
            // }
        }

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['$q',
                            'settings', 
                            'MapService', 
                            'DrawingService', 
                            'LegendService',
                            ];

})();