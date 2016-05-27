/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MapService
 * 
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.SearchService
 * 
 * @description
 * Service used for initializing leaflet maps
 */
(function() {
    'use strict';

    function MapService(settings, SearchService, $q) {

        var selectorDOM = '',
            map = {}, 
            overlay = null,
            layer,
            layerGroup,
            minHeight,
            minWidth;

        this.getMap                 = getMap;
        this.getTileLayer           = getTileLayer;
        this.getBounds              = getBounds;
        this.initMap                = initMap;
        this.resizeFunction         = resizeFunction;
        
        this.addClickListener       = addClickListener;
        this.addMouseMoveListener   = addMouseMoveListener;
        this.addDoubleClickListener = addDoubleClickListener;
        this.removeEventListeners   = removeEventListeners;
        
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
        function initMap(_selectorDOM, _minWidthMM, _minHeightMM, _ratioPixelPoint, _resizeFunction) {

            selectorDOM = _selectorDOM;
            setMinimumSize(_minWidthMM / _ratioPixelPoint, _minHeightMM / _ratioPixelPoint)

            map = L.map(selectorDOM).setView(settings.leaflet.GLOBAL_MAP_CENTER, settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
            var access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw";
            
            layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            })

            L.control.coordinates({
                position:"topright", //optional default "bootomright"
                enableUserInput:true, //optional default true
                useLatLngOrder: true, //ordering of labels, default false-> lng-lat
            }).addTo(map);
            
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
            $('#' + selectorDOM).css('min-height', minHeight)
            $('#' + selectorDOM).css('min-width', minWidth)

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
            var parentHeight = $('#' + selectorDOM).parent().height(),
                parentWidth = $('#' + selectorDOM).parent().width(),
                siblingHeight = $($('#' + selectorDOM).siblings()[0]).outerHeight(true),
                mapHeight = ( ( parentHeight - siblingHeight ) > minHeight ) ? ( parentHeight - siblingHeight ) : minHeight,
                mapWidth = ( parentWidth > minWidth ) ? 'auto' : minWidth;

            // $("#" + selectorDOM).height('calc(100vh - 80px)');
            // $("#" + selectorDOM).width(mapWidth);
            map.invalidateSize();

        }

        var listeners = [];

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
            listeners.push({event: 'click', function: listener})
            map.addEventListener('click', listener);
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
            listeners.push({event: 'mousemove', function: listener})
            map.addEventListener('mousemove', listener);
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
            listeners.push({event: 'contextmenu', function: listener})
            map.addEventListener('contextmenu', listener);
        }

        /**
         * @ngdoc method
         * @name  removeEventListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Remove all the listener to the map
         */
        function removeEventListeners() {
            listeners.forEach(function(currentValue) {
                console.log('removing ' + currentValue.event + ' listener from map')
                map.removeEventListener(currentValue.event, currentValue.function)
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
            $('#' + selectorDOM).css('cursor', style);
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
            changeCursor('default');
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
            map.addLayer(layer);
        }

        function hideMapLayer() {
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
            map.setZoom(settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
        }


    }

    angular.module(moduleApp)
    .service('MapService', MapService);

    MapService.$inject = ['settings', 'SearchService', '$q'];
})()