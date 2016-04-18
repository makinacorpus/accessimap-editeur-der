/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MapLeafletService
 * @requires accessimapEditeurDerApp.settings
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
         * @description 
         * Init a map with leaflet library
         * @param  {string} selector Id of the leaflet's map container
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


            // map.on('move', drawOverlay) ;
            // map.fire('move');
            

            /*svg = d3.select(map.getPanes().overlayPane).append("svg"),
            
            g = svg.append("g").attr("class", "leaflet-zoom-hide"),

            collection = {
                "type":"FeatureCollection",
                "features":[
                    {"type":"Feature",
                    "id":"node/455444970",
                    "properties":
                        {"type":"node",
                        "id":"455444970",
                        "tags":
                            {"amenity":"pub",
                            "name":"Ô Boudu Pont"},
                            "relations":[],
                            "meta":{}},
                            "geometry":
                                {"type":"Point",
                                "coordinates":[1.4363842,43.5989145]
                                }
                    }]
            },

            transform = d3.geo.transform({point: MapLeafletService.projectPoint}),
                path = d3.geo.path().projection(transform),

                feature = g.selectAll("path")
                .data(collection.features)
              .enter().append("path");

            map.on("viewreset", reset);
            reset();

            // Reposition the SVG to cover the features.
            function reset() {
                var bounds = path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg .attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");

                g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                feature.attr("d", path);
            }
            */
            // Use Leaflet to implement a D3 geometric transformation.
            // map.on('move', drawOverlay);
            $(window).on("resize", _resizeFunction).trigger("resize");
        }

        /**
         * @ngdoc method
         * @name  projectPoint
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description 
         * Project a geographical point to a layer map point
         * Useful for d3 projections
         * 
         * @param  {integer} x Latitude
         * @param  {integer} y Longitude
         * @return {Array}    Point with projected coordinates
         */
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));

            if (this.stream) {
                this.stream.point(point.x, point.y);
            } else {
                return point;
            }
        }

        /**
         * Change the bounds of the 'overlay'
         * @param {enum} _mapFormat_ A3, A4, it's the map format used for printing purposes
         * @return {[type]} [description]
         */
        function drawOverlay(_mapFormat_) {

            // first, get the size of the map
            // TODO : center the overlay if screen allow it
            var size  = /* map.getSize() */ {x: 270 / settings.ratioPixelPoint, y: 210 / settings.ratioPixelPoint },
                addonX = ( map.getSize().x - size.x ) / 2,
                addonY = ( map.getSize().y - size.y ) / 2,
                extNW = map.containerPointToLatLng([0 + addonX, 0 + addonY]),
                extNE = map.containerPointToLatLng([size.x + addonX, 0 + addonY]),
                extSE = map.containerPointToLatLng([size.x + addonX, size.y + addonY]),
                extSW = map.containerPointToLatLng([0 + addonX, size.y + addonY]),
                intNW = map.containerPointToLatLng([50 + addonX, 50 + addonY]),
                intNE = map.containerPointToLatLng([size.x - 50 + addonX, 50 + addonY]),
                intSE = map.containerPointToLatLng([size.x - 50 + addonX, size.y - 50 + addonY]),
                intSW = map.containerPointToLatLng([50 + addonX, size.y - 50 + addonY]),
                latLngs = [[extNW, extNE, extSE, extSW], [intNW, intNE, intSE, intSW]];
            
            if (overlay !== null) {
                overlay.setLatLngs(latLngs)
            } else {
                overlay = L.polygon(latLngs, 
                        {
                            fillColor: '#ffffff',
                            smoothFactor: 10,
                            noClip: true,
                            stroke: true,
                            color: '#000',
                            weight: 2,
                            fillOpacity: .75
                        })
                    .addTo(map)
            }

            var FormatLayer = L.Class.extend({

                initialize: function (latlng) {
                    // save position of the layer or any options from the constructor
                    this._latlng = latlng;
                },

                onAdd: function (map) {
                    this._map = map;

                    // create a DOM element and put it into one of the map panes
                    this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
                    map.getPanes().overlayPane.appendChild(this._el);

                    // add a viewreset event listener for updating layer's position, do the latter
                    map.on('viewreset', this._reset, this);
                    this._reset();
                },

                onRemove: function (map) {
                    // remove layer's DOM elements and listeners
                    map.getPanes().overlayPane.removeChild(this._el);
                    map.off('viewreset', this._reset, this);
                },

                _reset: function () {
                    // update layer's position
                    console.log('_reset')
                    var pos = this._map.latLngToLayerPoint(this._latlng);
                    L.DomUtil.setPosition(this._el, pos);
                }
            });

            map.addLayer(new FormatLayer(map.layerPointToLatLng([0, 0])));
        }

        /**
         * @ngdoc method
         * @name  resizeFunction
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description 
         * Get the current size of the container
         * 
         * Calc the available space for the map by substracting siblings height
         * 
         * Change the height of the leaflet map and apply for changes
         * @param  {string} selector Id of the leaflet's map container
         */
        function resizeFunction() {
            var parentHeight = $('#' + selectorDOM).parent().height(),
                parentWidth = $('#' + selectorDOM).parent().width(),
                siblingHeight = $($('#' + selectorDOM).siblings()[0]).outerHeight(true),
                mapHeightAvailable = parentHeight - siblingHeight;

            $("#" + selectorDOM).height(mapHeightAvailable);
            map.invalidateSize();

            // drawOverlay();
        }

        /**
         * @ngdoc method
         * @name  addClickListener
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description 
         * Add a listener to the click event
         * @param {function} listener function executed when click event is fired
         */
        function addClickListener(listener) {
            map.on('click', listener);
        }

        /**
         * @ngdoc method
         * @name  removeClickListener
         * @methodOf accessimapEditeurDerApp.MapLeafletService
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
         * @description 
         * Change the CSS appearance of the cursor on the map
         * @param  {string} style CSS style for cursor property : 'crosshair', '...' https://developer.mozilla.org/fr/docs/Web/CSS/cursor
         */
        function changeCursor(style) {
            $('#' + selectorDOM).css('cursor', style);
        }

        /**
         * @ngdoc method
         * @name  resetCursor
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description 
         * Reset to 'default' the cursor on the map
         */
        function resetCursor() {
            changeCursor('default');
        }

        /**
         * @ngdoc method
         * @name  getMap
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description Getter for the map property
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