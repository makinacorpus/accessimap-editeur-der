/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ModeService
 *
 * @description
 * Manage events (map, d3) in the editor
 *
 */
(function() {
    'use strict';

    function ModeService(MapService, DrawingService, SettingsService, SelectPathService, HistoryService) {

        this.init                    = init;

        this.resetState              = resetState;
        this.initMode                = initMode;
        this.initOSMMode             = initOSMMode;

        this.enableDefaultMode       = enableDefaultMode;
        this.enableSelectMode        = enableSelectMode;
        this.enablePointMode         = enablePointMode;
        this.enableCircleMode        = enableCircleMode;
        this.enableSquareMode        = enableSquareMode;
        this.enableTriangleMode      = enableTriangleMode;
        this.enableTextMode          = enableTextMode;
        this.enableImageMode         = enableImageMode;
        this.enableLineOrPolygonMode = enableLineOrPolygonMode;

        this.enableAddPOI            = enableAddPOI;
        this.disableAddPOI           = disableAddPOI;

        var projection ;

        function init(_projection) {
            projection    = _projection;
        }

        function initMode(stopImmediatePropagation, eventsToStop) {

            eventsToStop = eventsToStop || [ 'click', 'contextmenu', 'mousemove', 'mousedown', 'mouseup' ];
            MapService.resetCursor();
            MapService.removeEventListeners();

            if (stopImmediatePropagation !== false) {
                MapService.addEventListener(eventsToStop, function(e) {
                    e.originalEvent.stopImmediatePropagation();
                })
            }

            DrawingService.toolbox.hideContextMenus();
            DrawingService.toolbox.hideSelectPaths();

        }

        function resetState() {
            d3.selectAll('path:not(.menu-segment)').on('click', function() {});
            d3.selectAll('svg').on('click', function() {});
            d3.select('body').on('keydown', function() {});

            MapService.resetCursor();

            d3.selectAll('.ongoing').remove();

            // d3.selectAll('.blink').classed('blink', false);
            d3.selectAll('.edition').classed('edition', false);
            d3.selectAll('.styleEdition').classed('styleEdition', false);
            d3.selectAll('.highlight').classed('highlight', false);

            MapService.removeEventListeners();
        }


        /**
         * @ngdoc method
         * @name  enableSelectMode
         * @methodOf accessimapEditeurDerApp.ModeService
         *
         * @description

         * Enable the select mode :
         *
         * - user can select items and edit them
         *
         * - user can right click on an item and get a context menu
         */
        function enableSelectMode(callbackProperties) {

            initMode();

            MapService.changeCursor('default');

            DrawingService.toolbox.addContextMenus();
            DrawingService.toolbox.addSelectPaths(callbackProperties);

            MapService.removeEventsListener(['mousemove', 'mousedown', 'mouseup']);


        }

        /**
         * @ngdoc method
         * @name  enableDefaultMode
         * @methodOf accessimapEditeurDerApp.ModeService
         *
         * @description
         *
         * Enable the default mode :
         *
         * - user can pan & zoom the drawing
         *
         */
        function enableDefaultMode() {
            MapService.resetCursor();
            MapService.removeEventListeners();
            DrawingService.toolbox.hideContextMenus();
            DrawingService.toolbox.hideSelectPaths();
        }

        function enablePointMode(getDrawingParameter) {

            initMode();

            MapService.changeCursor('crosshair');
            // MapService.addClickListener(function(e) {
            MapService.addEventListener([ 'mouseup' ] , function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawPoint(p.x, p.y, drawingParameters.style, drawingParameters.color);
            })

        }

        function enableCircleMode(getDrawingParameter) {

            initMode();

            MapService.changeCursor('crosshair');
            MapService.addEventListener([ 'mousedown', 'mouseup' ] , function(e) {
                // only left click
                if (e.originalEvent.button === 0) {

                    e.originalEvent.stopImmediatePropagation()
                    var p = projection.latLngToLayerPoint(e.latlng),
                        drawingParameters = getDrawingParameter();

                    DrawingService.toolbox.drawCircle(p.x, p.y,
                                            drawingParameters.style,
                                            drawingParameters.color,
                                            drawingParameters.contour)

                    MapService.addMouseMoveListener(function(e) {
                        var p = projection.latLngToLayerPoint(e.latlng),
                            drawingParameters = getDrawingParameter();
                        DrawingService.toolbox.updateCircleRadius(p.x, p.y, e.originalEvent.shiftKey);
                    })

                }
            })


        }

        function enableSquareMode(getDrawingParameter) {

            initMode();

            MapService.changeCursor('crosshair');
            MapService.addEventListener([ 'mousedown' ] , function(e) {
                // only left click
                // e.originalEvent.stopImmediatePropagation()
                if (e.originalEvent.button === 0) {

                    var p = projection.latLngToLayerPoint(e.latlng),
                        drawingParameters = getDrawingParameter();

                    DrawingService.toolbox.drawSquare(p.x, p.y,
                                                    drawingParameters.style,
                                                    drawingParameters.color,
                                                    drawingParameters.contour)

                    MapService.addEventListener([ 'mousemove' ] , function(e) {

                        var p = projection.latLngToLayerPoint(e.latlng),
                            drawingParameters = getDrawingParameter();

                        DrawingService.toolbox.updateSquare(p.x, p.y, e.originalEvent.shiftKey);

                        MapService.addEventListener([ 'mouseup' ] , function(e) {
                            // only left click
                            e.originalEvent.stopImmediatePropagation()
                            if (e.originalEvent.button === 0) {
                                var p = projection.latLngToLayerPoint(e.latlng),
                                    drawingParameters = getDrawingParameter();
                                DrawingService.toolbox.drawSquare(p.x, p.y,
                                                                drawingParameters.style,
                                                                drawingParameters.color,
                                                                drawingParameters.contour)
                                enableSquareMode(getDrawingParameter)
                            }
                        })

                    })

                }

            })

        }

        function enableTriangleMode(getDrawingParameter) {

            initMode();

            MapService.changeCursor('crosshair');
            MapService.addEventListener([ 'mousedown' ] , function(e) {
                // only left click
                // e.originalEvent.stopImmediatePropagation()
                if (e.originalEvent.button === 0) {

                    var p = projection.latLngToLayerPoint(e.latlng),
                        drawingParameters = getDrawingParameter();

                    DrawingService.toolbox.drawTriangle(p.x, p.y,
                                                    drawingParameters.style,
                                                    drawingParameters.color,
                                                    drawingParameters.contour)

                    MapService.addEventListener([ 'mousemove' ] , function(e) {

                        var p = projection.latLngToLayerPoint(e.latlng),
                            drawingParameters = getDrawingParameter();

                        DrawingService.toolbox.updateTriangle(p.x, p.y, e.originalEvent.shiftKey);

                        MapService.addEventListener([ 'mouseup' ] , function(e) {
                            // only left click
                            e.originalEvent.stopImmediatePropagation()
                            if (e.originalEvent.button === 0) {
                                var p = projection.latLngToLayerPoint(e.latlng),
                                    drawingParameters = getDrawingParameter();
                                DrawingService.toolbox.drawTriangle(p.x, p.y,
                                                                drawingParameters.style,
                                                                drawingParameters.color,
                                                                drawingParameters.contour)
                                HistoryService.saveState();
                                enableTriangleMode(getDrawingParameter)
                            }
                        })

                    })

                }

            })

        }

        function enableLineOrPolygonMode(getDrawingParameter) {

            initMode();

            var lastPoint = null,
                lineEdit = [];

            MapService.changeCursor('crosshair');
            MapService.addEventListener([ 'click' ], function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
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

            MapService.addEventListener([ 'mousemove' ], function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawHelpLineOrPolygon(p.x,
                                                    p.y,
                                                    drawingParameters.style,
                                                    drawingParameters.color,
                                                    drawingParameters.contour,
                                                    drawingParameters.mode,
                                                    lastPoint);
            })

            MapService.addEventListener([ 'contextmenu' ], function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
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

            MapService.changeCursor('crosshair');
            MapService.addEventListener([ 'click' ], function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();

                DrawingService.toolbox.writeText(p.x, p.y, drawingParameters.font, drawingParameters.fontColor)
                    .then(function addAgainClickListener(element) {
                        MapService.addEventListener([ 'click' ], function(e) {
                            enableTextMode(getDrawingParameter)
                        })
                    })

                // to prevent the draw of a new text feature
                MapService.removeEventsListener(['click']);
            })

        }

        function enableImageMode(getDrawingParameter) {

            initMode();

        }

        /**
         * @ngdoc method
         * @name  enableAddPOI
         * @methodOf accessimapEditeurDerApp.ModeService
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
        function enableAddPOI(_warningCallback, _errorCallback, _currentParametersFn) {

            initMode(false);

            MapService.changeCursor('crosshair');

            MapService.addEventListener([ 'click' ], function(e) {
                clickHandlerForPOI(e, _warningCallback, _errorCallback, _currentParametersFn)
            })
        }

        function clickHandlerForPOI(event, _warningCallback, _errorCallback, _currentParametersFn) {
            var currentParameters = _currentParametersFn(),
                styleChosen = SettingsService.ALL_STYLES.find(function(element, index, array) {
                    return element.id === currentParameters.style.id;
                }),
                colorChosen = SettingsService.ALL_COLORS.find(function(element, index, array) {
                    return element.id === currentParameters.color.id;
                }),
                checkboxModel = { contour: currentParameters.contour };

            // TODO: prevent any future click
            // user has to wait before click again
            MapService.changeCursor('progress');

            MapService
                .retrieveData([event.latlng.lng,  event.latlng.lat], SettingsService.QUERY_LIST[0])
                .then(function successCallback(osmGeojson) {
                    if (!osmGeojson) {
                        _errorCallback('Erreur lors de la recherche de POI... Merci de recommencer.')
                    }

                    if (osmGeojson.features && osmGeojson.features.length > 0) {
                        DrawingService.layers.geojson.geojsonToSvg(osmGeojson,
                                null,
                                'node_' + osmGeojson.features[0].properties.id,
                                true,
                                SettingsService.QUERY_POI,
                                styleChosen,
                                SettingsService.STYLES[SettingsService.QUERY_POI.type],
                                colorChosen, checkboxModel, null)
                    } else {
                        _warningCallback('Aucun POI trouvé à cet endroit... Merci de cliquer ailleurs !?')
                    }
                })
                .catch(_errorCallback)
                .finally(function finallyCallback() {
                    MapService.changeCursor('crosshair');
                })
        }

        /**
         * @ngdoc method
         * @name  disableAddPOI
         * @methodOf accessimapEditeurDerApp.ModeService
         *
         * @description
         * Disable the 'Add POI' mode by resetting CSS cursor.
         *
         */
        function disableAddPOI() {
            MapService.resetCursor();
            MapService.removeEventListener('click', clickHandlerForPOI);
        }

        function initOSMMode() {
            initMode(false);
            MapService.resetCursor();
        }

    }

    angular.module(moduleApp).service('ModeService', ModeService);

    ModeService.$inject = ['MapService', 'DrawingService', 'SettingsService', 'SelectPathService', 'HistoryService'];

})();
