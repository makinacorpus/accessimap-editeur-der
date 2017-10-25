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

    function MapService($q, SettingsService, SearchService, LayerOverlayService) {

        var _selectorDOM = '',
            _isMapVisible,
            map = {},
            overlay = null,
            layerMapBox,
            layerMapBoxId = 'mapbox.streets',
            layerOSM,
            layerOSMId = 'osm',
            layerControl,
            minHeight,
            minWidth,
            currentLayer;

        this.isMapVisible           = function() { return _isMapVisible }

        this.getMap                 = getMap;
        this.getBaseLayer           = getBaseLayer;
        this.getBaseLayerId         = getBaseLayerId;
        this.getBounds              = getBounds;
        this.init                   = init;
        this.resizeFunction         = resizeFunction;

        this.addEventListener       = addEventListener;
        this.addClickListener       = addClickListener;
        this.addMouseMoveListener   = addMouseMoveListener;
        this.addDoubleClickListener = addDoubleClickListener;
        this.removeEventListeners   = removeEventListeners;
        this.removeEventsListener   = removeEventsListener;
        this.removeEventListener    = removeEventListener;

        this.addMoveHandler         = addMoveHandler;
        this.removeMoveHandler      = removeMoveHandler;
        this.addClickHandler        = addClickHandler;
        this.removeClickHandler     = removeClickHandler;
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
        this.resetView              = resetView;
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
         * @name  init
         * @methodOf accessimapEditeurDerApp.MapService
         *
         * @description
         * Init a map with leaflet library
         *
         * @param  {string} selector
         * Id of the leaflet's map container
         */
        function init(selectorDOM, format, _ratioPixelPoint, _resizeFunction) {

            _selectorDOM = selectorDOM;
            _isMapVisible = false;

            // setMinimumSize(SettingsService.FORMATS[format].width / _ratioPixelPoint,
            //                 SettingsService.FORMATS[format].height / _ratioPixelPoint)

            map = L.map(_selectorDOM).setView(SettingsService.leaflet.GLOBAL_MAP_CENTER,
                                                SettingsService.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
            var access_token =
                "pk.eyJ1IjoibWRhcnRpYyIsImEiOiJjaXpqenNkcHcwMDVlMnF0OWFocTJ6ZWYxIn0.HaUGbDl8wwePzrZ-4pQBmA";

            layerMapBox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='
                + access_token, {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: layerMapBoxId
            });

            layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                id: layerOSMId
            });

            currentLayer = layerOSM;

            layerControl = L.control.layers({ 'Open Street Map': layerOSM, 'MapBox Street': layerMapBox})

            // Use Leaflet to implement a D3 geometric transformation.
            $(window).on("resize", _resizeFunction).trigger("resize");

            map.on('baselayerchange', function(layerEvent) {
                currentLayer = layerEvent.layer;
            })

            createResetViewButton(currentLayer);
            console.log('map initialize')
        }

        function createResetViewButton (layer) {
            /**
             * Create and attach the map control button allowing to reset pan/zoom to the main loaded content
             * @return {Oject} Map object
             */
            L.Control.Resetview = L.Control.extend({
                options: {
                    position: 'topright'
                },
    
                onAdd: function (map) {
                    this.map = map;
    
                    var container = L.DomUtil.create('div', 'leaflet-control-resetview leaflet-bar');
                    var button    = L.DomUtil.create('a',   'leaflet-control-resetview-button', container);
                    var span    = L.DomUtil.create('span',   'fa fa-arrows-alt', button);
                    button.title  = 'Reset view';
    
                    L.DomEvent.disableClickPropagation(button);
                    L.DomEvent.on(button, 'click', this._resetViewButtonClick, this);
    
                    return container;
                },
    
                _resetViewButtonClick: function () {
                    var center       = LayerOverlayService.getCenter();
                    var zoom         = zoom   ? zoom   : getMap().getZoom();

                    resetView(center, zoom);
                },
            });
    
            L.control.resetview = function resetview () {
                return new L.Control.Resetview();
            };
    
            L.control.resetview().addTo(map);
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
        function removeEventsListener(events) {
            events.forEach(function(event) {
                map.removeEventListener(event)
            })
        }

        function removeEventListener(event, listener) {
            console.log(listeners);
            console.log(map.hasEventListeners(event));
            map.removeEventListener(event, listener);
            console.log(map.hasEventListeners(event));
            listeners = listeners.filter(function(value) { return value !== listener });
            console.log(listeners);
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

        function getBaseLayer() {
            return currentLayer;
        }

        function getBaseLayerId() {
            return currentLayer ? currentLayer.options.id : undefined;
        }

        function showMapLayer(layerId) {
            if (! _isMapVisible) {
                _isMapVisible = true;
                layerControl.addTo(map)
                if (layerId === layerOSMId) {
                    map.addLayer(layerOSM);
                } else if (layerId === layerMapBoxId) {
                    map.addLayer(layerMapBox)
                } else {
                    map.addLayer(currentLayer);
                }
            }
        }

        function hideMapLayer() {
            if (_isMapVisible) {
                _isMapVisible = false;
                layerControl.removeFrom(map)
                map.removeLayer(currentLayer);
            }
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

        function addClickHandler() {
            map.on('click', function(event) {
                $(document).click();
            })
        }

        function removeClickHandler() {
            map.off('click');
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

        /**
         * @ngdoc method
         * @name  resetView
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * If a center of the drawing is defined,
         * we pan / zoom to the initial state of the drawing.
         *
         * @param {function} callback
         * Optional, function to be called when the setView is finished
         */
        function resetView(center, zoom, callback) {

            if (center !== null && zoom !== null) {
                // if the tile layer don't zoom, we're not going to load tiles
                // we have to detect if we are going to change the zoom level or not
                var zoomWillChange = ( map.getZoom() !== zoom );

                if (zoomWillChange) {
                    if (_isMapVisible) {
                        getBaseLayer().once('load', function() {
                            if (callback) callback();
                        })
                    }
                }

                map.setView(center, zoom, {animate:false})

                if ( callback && ( ( ! zoomWillChange ) || ( zoomWillChange && ! _isMapVisible ) ) ) {
                    callback();
                }

            } else {
                if (callback) callback();
            }

        }

    }

    angular.module(moduleApp).service('MapService', MapService);

    MapService.$inject = ['$q', 'SettingsService', 'SearchService', 'LayerOverlayService'];

})();
