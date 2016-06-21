/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EventsService
 * 
 * @description
 * Manage events (map, d3) in the editor
 * 
 */
(function() {
    'use strict';

    function EventsService(MapService, DrawingService, SettingsService) {

        this.init                    = init;
        this.initMode                = initMode;
        this.enablePointMode         = enablePointMode;
        this.enableCircleMode        = enableCircleMode;
        this.enableSquareMode        = enableSquareMode;
        this.enableTriangleMode      = enableTriangleMode;
        this.enableTextMode          = enableTextMode;
        this.enableLineOrPolygonMode = enableLineOrPolygonMode;
        this.enableAddPOI            = enableAddPOI;
        this.disableAddPOI           = disableAddPOI;

        var projection ;

        function init(_projection) {
            projection    = _projection;
        }

        
        function initMode() {
            MapService.changeCursor('crosshair');
            MapService.removeEventListeners();

            MapService.addEventListener([ 'click', 'contextmenu', 'mousemove', 'mousedown', 'mouseup' ], function(e) {
                e.originalEvent.stopImmediatePropagation();
            })

        }
        

        function enablePointMode(getDrawingParameter) {

            initMode();

            // MapService.addClickListener(function(e) {
            MapService.addEventListener([ 'mouseup' ] , function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawPoint(p.x, p.y, drawingParameters.style, drawingParameters.color);
            })

        }

        function enableCircleMode(getDrawingParameter) {

            initMode();

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

            MapService.addClickListener(function(e) {
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

            MapService.addMouseMoveListener(function(e) {
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

            MapService.addDoubleClickListener(function(e) {
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

            MapService.addClickListener(function(e) {
                var p = projection.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();

                DrawingService.toolbox.writeText(p.x, p.y, drawingParameters.font, drawingParameters.fontColor)
                    .then(function addAgainClickListener(element) {
                        MapService.addClickListener(function(e) {
                            enableTextMode(getDrawingParameter)
                        })
                    })

                // to prevent the draw of a new text feature
                MapService.removeEventListener(['click']);
            })

        }

        /**
         * @ngdoc method
         * @name  enableAddPOI
         * @methodOf accessimapEditeurDerApp.EventsService
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

            initMode();

            MapService.addClickListener(function(e) {

                var currentParameters = _currentParametersFn(),
                styleChosen = SettingsService.ALL_STYLES.find(function(element, index, array) {
                    return element.id === currentParameters.style.id;
                }),
                colorChosen = SettingsService.ALL_COLORS.find(function(element, index, array) {
                    return element.id === currentParameters.color.id;
                })
                // TODO: prevent any future click 
                // user has to wait before click again
                MapService.changeCursor('progress');
                
                MapService
                    .retrieveData([e.latlng.lng,  e.latlng.lat], SettingsService.QUERY_LIST[0])
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
                                    colorChosen, null, null)
                        } else {
                            _warningCallback('Aucun POI trouvé à cet endroit... Merci de cliquer ailleurs !?')
                        }
                    })
                    .catch(_errorCallback)
                    .finally(function finallyCallback() {
                        MapService.changeCursor('crosshair');
                    })
            })
        }

        /**
         * @ngdoc method
         * @name  disableAddPOI
         * @methodOf accessimapEditeurDerApp.EventsService
         * 
         * @description 
         * Disable the 'Add POI' mode by resetting CSS cursor.
         * 
         */
        function disableAddPOI() {
            MapService.resetCursor();
        }

    }

    angular.module(moduleApp).service('EventsService', EventsService);

    EventsService.$inject = ['MapService', 'DrawingService', 'SettingsService'];

})()