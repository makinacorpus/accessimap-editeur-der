/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MapService
 * 
 * @requires accessimapEditeurDerApp.SettingsService
 * @requires accessimapEditeurDerApp.SearchService
 * 
 * @description
 * Service used for initializing leaflet maps
 */
(function() {
    'use strict';

    function MapService($q, SettingsService, SearchService) {

        var _selectorDOM = '',
            _isMapVisible,
            map = {}, 
            overlay = null,
            layer,
            layerGroup,
            minHeight,
            minWidth;

        this.isMapVisible           = function() { return _isMapVisible }

        this.getMap                 = getMap;
        this.getTileLayer           = getTileLayer;
        this.getBounds              = getBounds;
        this.initMap                = initMap;
        this.resizeFunction         = resizeFunction;
        
        this.addEventListener       = addEventListener;
        this.addClickListener       = addClickListener;
        this.addMouseMoveListener   = addMouseMoveListener;
        this.addDoubleClickListener = addDoubleClickListener;
        this.removeEventListeners   = removeEventListeners;
        this.removeEventListener    = removeEventListener;

        this.addMoveHandler         = addMoveHandler;
        this.removeMoveHandler      = removeMoveHandler;
        this.addViewResetHandler    = addViewResetHandler;
        this.removeViewResetHandler = removeViewResetHandler;
        
        this.changeCursor           = changeCursor;
        this.resetCursor            = resetCursor;
        this.projectPoint           = projectPoint;
        this.latLngToLayerPoint     = latLngToLayerPoint;
        
        this.showMapLayer           = showMapLayer;
        this.hideMapLayer           = hideMapLayer;
        
        this.freezeMap              = freezeMap;
        this.unFreezeMap            = unFreezeMap;
        
        this.searchAddress          = SearchService.searchAddress
        this.resetZoom              = resetZoom;
        this.setMinimumSize         = setMinimumSize;

        /**
         * @ngdoc method
         * @name  retrieveData
         * @methodOf accessimapEditeurDerApp.MapService
         *
         * @description 
         * alias of accessimapEditeurDerApp.SearchService:retrieveData
         */
        this.retrieveData = SearchService.retrieveData;

        /**
         * @ngdoc method
         * @name  initMap
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Init a map with leaflet library
         * 
         * @param  {string} selector 
         * Id of the leaflet's map container
         */
        function initMap(selectorDOM, format, _ratioPixelPoint, _resizeFunction) {

            _selectorDOM = selectorDOM;
            _isMapVisible = false;

            setMinimumSize(SettingsService.FORMATS[format].width / _ratioPixelPoint, 
                            SettingsService.FORMATS[format].height / _ratioPixelPoint)

            map = L.map(_selectorDOM).setView(SettingsService.leaflet.GLOBAL_MAP_CENTER, 
                                                SettingsService.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
            var access_token = 
                "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw";
            
            layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            })

            // , layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);
            // 

            // Use Leaflet to implement a D3 geometric transformation.
            $(window).on("resize", _resizeFunction).trigger("resize");
        }

        function setMinimumSize(width, height) {
            minWidth = width;
            minHeight = height;
            $('#' + _selectorDOM).css('min-height', minHeight)
            $('#' + _selectorDOM).css('min-width', minWidth)

        }

        /**
         * @ngdoc method
         * @name  projectPoint
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Project a geographical point to a layer map point
         * Useful for d3 projections
         * 
         * @param  {integer} x 
         * Latitude
         * 
         * @param  {integer} y 
         * Longitude
         * 
         * @return {Array}    
         * Point with projected coordinates
         */
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));

            if (this && this.stream) {
                this.stream.point(point.x, point.y);
            } else {
                return point;
            }
        }

        function latLngToLayerPoint(point) {
            return map.latLngToLayerPoint(point);
        }

        /**
         * @ngdoc method
         * @name  resizeFunction
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Get the current size of the container
         * 
         * Calc the available space for the map by substracting siblings height
         * 
         * Change the height of the leaflet map and apply for changes
         * 
         * @param  {string} selector 
         * Id of the leaflet's map container
         */
        function resizeFunction() {
            
            var parentHeight = $('#' + _selectorDOM).parent().height(),
                parentWidth = $('#' + _selectorDOM).parent().width(),
                siblingHeight = $($('#' + _selectorDOM).siblings()[0]).outerHeight(true),
                mapHeight = ( ( parentHeight - siblingHeight ) > minHeight ) 
                            ? ( parentHeight - siblingHeight ) 
                            : minHeight,
                mapWidth = ( parentWidth > minWidth ) ? 'auto' : minWidth;

            // $("#" + _selectorDOM).height('calc(100vh - 80px)');
            // $("#" + _selectorDOM).width(mapWidth);
            map.invalidateSize();

        }

        var listeners = [];

        function addEventListener(events, listener) {
            events.forEach(function(event) {
                listeners.push({event: event, function: listener})
                map.addEventListener(event, listener)
            })
        }

        /**
         * @ngdoc method
         * @name  addClickListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the click event
         * 
         * @param {function} listener 
         * function executed when click event is fired
         */
        function addClickListener(listener) {
            addEventListener([ 'click' ], listener)
        }

        /**
         * @ngdoc method
         * @name  addMouseMoveListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the mousemove event
         * 
         * @param {function} listener 
         * function executed when mousemove event is fired
         */
        function addMouseMoveListener(listener) {
            addEventListener([ 'mousemove' ], listener)
        }

        /**
         * @ngdoc method
         * @name  addDoubleClickListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the doubleclick event
         * 
         * @param {function} listener 
         * function executed when doubleclick event is fired
         */
        function addDoubleClickListener(listener) {
            addEventListener([ 'contextmenu' ], listener)
        }

        /**
         * @ngdoc method
         * @name  removeEventListeners
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Remove all the listeners to the map
         */
        function removeEventListeners() {
            listeners.forEach(function(currentValue) {
                map.removeEventListener(currentValue.event, currentValue.function)
            })
        }

        /**
         * @ngdoc method
         * @name  removeEventListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Remove one or several listeners
         *
         * @param {Array} events
         * Array of string representing events : [ 'click', 'mousemove' ] for example
         */
        function removeEventListener(events) {
            events.forEach(function(event) {
                map.removeEventListener(event)
            })
        }

        /**
         * @ngdoc method
         * @name  changeCursor
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Change the CSS appearance of the cursor on the map
         * 
         * @param  {string} style 
         * CSS style for cursor property : 'crosshair', '...' 
         * 
         * https://developer.mozilla.org/fr/docs/Web/CSS/cursor
         */
        function changeCursor(style) {
            document.getElementById(_selectorDOM).style.setProperty('cursor', style)
        }

        /**
         * @ngdoc method
         * @name  resetCursor
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Reset to 'default' the cursor on the map
         */
        function resetCursor() {
            document.getElementById(_selectorDOM).style.removeProperty('cursor')
        }

        /**
         * @ngdoc method
         * @name  getBounds
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Returns the LatLngBounds of the current map view
         * 
         * http://leafletjs.com/reference.html#map-getbounds
         *
         * @return {LatLngBounds} 
         * LatLngBounds of the current map view
         */
        function getBounds() {
            return map.getBounds();
        }

        /**
         * @ngdoc method
         * @name  getMap
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description Getter for the map property
         * 
         * @return {Object} Leaflet map
         */
        function getMap() {
            return map;
        }

        function getTileLayer() {
            return layer;
        }

        function showMapLayer() {
            _isMapVisible = true;
            map.addLayer(layer);
        }

        function hideMapLayer() {
            _isMapVisible = false;
            map.removeLayer(layer);
        }

        function freezeMap() {
            map.setMaxBounds(map.getBounds());
        }

        function unFreezeMap() {
            map.setMaxBounds(null);
        }

        function addMoveHandler(callback) {
            map.on('move', function(event) {
                callback(map.getSize(), map.getPixelOrigin(), map.getPixelBounds().min);
            })
            map.fire('move');
        }

        function removeMoveHandler() {
            map.off('move');
        }

        function addViewResetHandler(callback) {
            map.on('viewreset', function(event) {
                callback(event, map.getPixelOrigin(), map.getZoom());
            })
            map.fire('viewreset');
        }

        function removeViewResetHandler() {
            map.off('viewreset');
        }

        function resetZoom() {
            map.setZoom(SettingsService.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
        }

    }

    angular.module(moduleApp).service('MapService', MapService);

    MapService.$inject = ['$q', 'SettingsService', 'SearchService'];

})();