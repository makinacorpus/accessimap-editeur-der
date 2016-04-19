/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditService
 * 
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.MapLeafletService
 * @requires accessimapEditeurDerApp.NominatimService
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

    function EditService(settings, svgicon, MapLeafletService, NominatimService, DrawingService, LegendService, ProjectionService) {

        this.init          = init;
        this.settings      = settings;
        this.featureIcon   = svgicon.featureIcon;
        this.enableAddPOI  = enableAddPOI;
        this.insertOSMData = insertOSMData;
        this.disableAddPOI = disableAddPOI;
        this.geojsonToSvg  = DrawingService.geojsonToSvg;

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

            MapLeafletService.initMap('drawing', MapLeafletService.resizeFunction);

            DrawingService.initDrawing(MapLeafletService.getMap().getPanes().overlayPane /*'#drawing'*/, 
                            drawingFormat.width, 
                            drawingFormat.height, 
                            settings.margin, 
                            settings.ratioPixelPoint,
                            MapLeafletService.projectPoint,
                            MapLeafletService.getMap(),
                            settings.POLYGON_STYLES)
            
            MapLeafletService.getMap().on('move', DrawingService.mapMoved)
            MapLeafletService.getMap().on('viewreset', DrawingService.resetView)

            MapLeafletService.getMap().fire('move');
            MapLeafletService.getMap().fire('viewreset');

            ProjectionService.init();

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
            MapLeafletService.changeCursor('crosshair');
            MapLeafletService.addClickListener(function(e) {
                // TODO: prevent any future click 
                // user has to wait before click again
                MapLeafletService.changeCursor('progress');
                
                NominatimService
                    .retrieveData([e.latlng.lng,  e.latlng.lat], settings.QUERY_LIST[0])
                    .then(_successCallback)
                    .catch(_errorCallback)
                    .finally(function finallyCallback() {
                        MapLeafletService.changeCursor('crosshair');
                    })
            })
        }

        function disableAddPOI() {
            MapLeafletService.resetCursor();
        }

        /**
         * @ngdoc method
         * @name  insertOSMData
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Retrieve data from NominatimService for a specific 'query'
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

            MapLeafletService.changeCursor('progress');
            
            NominatimService
                .retrieveData(MapLeafletService.getBounds(), query)
                .then(_successCallback)
                .catch(_errorCallback)
                .finally(function finallyCallback() {
                    MapLeafletService.resetCursor();
                })
        }

        /**
         * @ngdoc method
         * @name  rotate
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description rotate all '.rotable' elements 
         * 
         * @param  {Object} angle [description]
         */
        function rotate(angle) {
            d3.selectAll('.rotable')
                .attr('transform', 'rotate(' + angle + ' ' + _width / 2 + ' ' + _height / 2 + ')');
        }

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['settings', 
                            'svgicon', 
                            'MapLeafletService', 
                            'NominatimService', 
                            'DrawingService', 
                            'LegendService', 
                            'ProjectionService'];

})();