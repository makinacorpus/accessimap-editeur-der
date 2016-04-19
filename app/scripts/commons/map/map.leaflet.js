/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MapLeafletService
 * 
 * @requires accessimapEditeurDerApp.settings
 * 
 * @description
 * Service used for initializing leaflet maps
 */
(function() {
    'use strict';

    function MapLeafletService(settings) {

        var selectorDOM = '',
            map = {}, 
            overlay = null;

        this.getMap              = getMap;
        this.getBounds           = getBounds;
        this.initMap             = initMap;
        this.resizeFunction      = resizeFunction;
        this.addClickListener    = addClickListener;
        this.removeClickListener = removeClickListener;
        this.changeCursor        = changeCursor;
        this.resetCursor         = resetCursor;
        this.projectPoint        = projectPoint;

        /**
         * @ngdoc method
         * @name  initMap
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * 
         * @description 
         * Init a map with leaflet library
         * 
         * @param  {string} selector 
         * Id of the leaflet's map container
         */
        function initMap(_selectorDOM, _resizeFunction, _) {

            selectorDOM = _selectorDOM;

            map = L.map(selectorDOM).setView(settings.leaflet.GLOBAL_MAP_CENTER, settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
            // map = L.map(selectorDOM, {center: [37.8, -96.9], zoom: 4});
            var access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw"
            , layerMapBox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(map)
            
            // , layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);

            // Use Leaflet to implement a D3 geometric transformation.
            $(window).on("resize", _resizeFunction).trigger("resize");
        }

        /**
         * @ngdoc method
         * @name  projectPoint
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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

        /**
         * @ngdoc method
         * @name  resizeFunction
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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
                mapHeightAvailable = parentHeight - siblingHeight;

            $("#" + selectorDOM).height(mapHeightAvailable);
            map.invalidateSize();

        }

        /**
         * @ngdoc method
         * @name  addClickListener
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * 
         * @description 
         * Add a listener to the click event
         * 
         * @param {function} listener 
         * function executed when click event is fired
         */
        function addClickListener(listener) {
            map.on('click', listener);
        }

        /**
         * @ngdoc method
         * @name  removeClickListener
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * 
         * @description 
         * Remove the listener to the click event
         */
        function removeClickListener() {
            map.off('click');
        }

        /**
         * @ngdoc method
         * @name  changeCursor
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * 
         * @description Getter for the map property
         * 
         * @return {Object} Leaflet map
         */
        function getMap() {
            return map;
        }
    }

    angular.module(moduleApp)
    .service('MapLeafletService', MapLeafletService);

    MapLeafletService.$inject = ['settings'];
})()