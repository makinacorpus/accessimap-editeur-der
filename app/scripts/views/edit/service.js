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

    function EditService($q, settings, svgicon, MapService, DrawingService, LegendService) {

        this.init          = init;
        this.settings      = settings;
        this.featureIcon   = svgicon.featureIcon;
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
        this.changeTextColor               = DrawingService.changeTextColor;
        this.updateBackgroundStyleAndColor = DrawingService.updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = DrawingService.updateFeatureStyleAndColor;
        this.updateMarker                  = DrawingService.updateMarker;
        this.addRadialMenus                = DrawingService.addRadialMenus;
        this.isUndoAvailable               = DrawingService.isUndoAvailable;
        this.undo                          = DrawingService.undo;
        this.enablePointMode               = enablePointMode;
        this.drawPoint                     = DrawingService.drawPoint;
        this.enableCircleMode              = enableCircleMode;
        this.drawCircle                    = DrawingService.drawCircle;
        this.enableLineOrPolygonMode       = enableLineOrPolygonMode;
        this.enableTextMode                = enableTextMode;
        this.exportData                    = DrawingService.exportData;

        // Map services
        this.showMapLayer                  = MapService.showMapLayer;
        this.hideMapLayer                  = MapService.hideMapLayer;

        this.geojsonToSvg                  = DrawingService.geojsonToSvg;
        this.getFeatures                   = DrawingService.getFeatures;
        
        this.removeFeature                 = DrawingService.removeFeature;
        this.updateFeature                 = DrawingService.updateFeature;
        this.rotateFeature                 = DrawingService.rotateFeature;
        
        this.searchAndDisplayAddress       = searchAndDisplayAddress;
        this.fitBounds                     = fitBounds;
        this.panTo                         = panTo;

        this.freezeMap                     = freezeMap;
        this.unFreezeMap                   = unFreezeMap;

        this.resetZoom                     = resetZoom;

        function freezeMap() {
            MapService.removeMoveHandler();
            DrawingService.enableZoomHandler();
            // MapService.removeViewResetHandler();
        }

        function unFreezeMap() {
            MapService.addMoveHandler(DrawingService.mapMoved)
        }
        
        function initMode() {
            MapService.changeCursor('crosshair');
            MapService.removeEventListeners();
        }

        function enablePointMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.drawPoint(p.x, p.y, drawingParameters.style, drawingParameters.color);
            })

        }

        function enableCircleMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.drawCircle(p.x, 
                                        p.y, 
                                        drawingParameters.style, 
                                        drawingParameters.color, 
                                        drawingParameters.contour)
            })

            MapService.addMouseMoveListener(function(e) {
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.updateCircleRadius(p.x, p.y);
            })

        }

        function enableLineOrPolygonMode(getDrawingParameter) {

            initMode();

            var lastPoint = null,
                lineEdit = [];

            MapService.addClickListener(function(e) {
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.beginLineOrPolygon(p.x, 
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
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.drawHelpLineOrPolygon(p.x, 
                                                    p.y, 
                                                    drawingParameters.style, 
                                                    drawingParameters.color, 
                                                    drawingParameters.contour, 
                                                    drawingParameters.mode, 
                                                    lastPoint);
            })

            MapService.addDoubleClickListener(function(e) {
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.finishLineOrPolygon(p.x, 
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
                var p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.writeText(p.x, p.y, drawingParameters.font, drawingParameters.fontColor);
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
        function init(drawingFormat, legendFormat) {

            if (drawingFormat === undefined) 
                drawingFormat = settings.FORMATS[settings.DEFAULT_DRAWING_FORMAT];
            
            if (legendFormat === undefined) 
                legendFormat = settings.FORMATS[settings.DEFAULT_LEGEND_FORMAT];

            MapService.initMap('drawing', 
                            drawingFormat.width, 
                            drawingFormat.height, 
                            settings.ratioPixelPoint,
                            MapService.resizeFunction);

            MapService.showMapLayer();

            var d3Element = null, d3Proj,
                overlay = L.d3SvgOverlay(function(sel, proj) {
                d3Element = sel;
                d3Proj = proj;
                // var upd = sel.selectAll('path').data(countries);
                // upd.enter()
                //   .append('path')
                //   .attr('d', proj.pathFromGeojson)
                //   .attr('stroke', 'black')
                //   .attr('fill', function() { return d3.hsl(Math.random() * 360, 0.9, 0.5) })
                //   .attr('fill-opacity', '0.5');

                // upd.attr('stroke-width', 1 / proj.scale);
            });

            overlay.addTo(MapService.getMap())

            DrawingService.initDrawing(MapService.getMap().getPanes().overlayPane, 
                        d3Element, 
                        drawingFormat.width / settings.ratioPixelPoint, 
                        drawingFormat.height / settings.ratioPixelPoint, 
                        settings.margin, 
                        MapService.projectPoint,
                        settings.POLYGON_STYLES)
            

            unFreezeMap();
            MapService.addViewResetHandler(DrawingService.resetView)

            LegendService.initLegend('#legend', 
                                    legendFormat.width, 
                                    legendFormat.height, 
                                    settings.margin, 
                                    settings.ratioPixelPoint);

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
            MapService.changeCursor('crosshair');
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
         * @name  rotate
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Rotate all '.rotable' elements 
         * 
         * @param  {Object} angle 
         * Angle in degree of the rotation
         */
        function rotate(angle) {
            d3.selectAll('.rotable')
                .attr('transform', 'rotate(' + angle + ' ' + _width / 2 + ' ' + _height / 2 + ')');
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
                        DrawingService.drawAddress(results[0], id, style, color);
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
            DrawingService.resetZoom();
            MapService.resetZoom();
        }

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['$q',
                            'settings', 
                            'svgicon', 
                            'MapService', 
                            'DrawingService', 
                            'LegendService',
                            ];

})();