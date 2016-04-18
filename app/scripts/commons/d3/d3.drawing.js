/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.ProjectionService
 * @requires accessimapEditeurDerApp.LayerService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function DrawingService(ProjectionService, LayerService) {

        this.initDrawing = initDrawing;
        this.resetView = resetView;
        this.mapMoved = mapMoved;
        this._path = _path;

        var _width,
            _height,
            _margin,
            _ratioPixelPoint,
            _geojson,
            _path,
            _map,
            _drawingDOM,
            _feature,
            _collection = {
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
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                            [
                              [
                                1.43633633852005,
                                43.598928233215055
                              ],
                              [
                                1.4362987875938416,
                                43.59889132732073
                              ],
                              [
                                1.4363336563110352,
                                43.59887190315674
                              ],
                              [
                                1.4363658428192139,
                                43.5988971545687
                              ],
                              [
                                1.43633633852005,
                                43.598928233215055
                              ]
                            ]
                          ]
                        }
                    }]
            },
            _svg,
            _overlay,
            _g,
            _transform;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.DrawingService.initDrawing
         * @methodOf accessimapEditeurDerApp.DrawingService
         *
         * @description
         * Create the drawing svg in a dom element with specific size
         *
         * @param  {string} id     
         * id of element in which will be appended svg
         * 
         * @param  {integer} widthMM
         * width in millimeters of the svg created
         * 
         * @param  {integer} heightMM
         * height in millimeters of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         * @param  {integer} ratioPixelPoint 
         * ratioPixelPoint ? TODO please explain it...
         */
        function initDrawing(id, widthMM, heightMM, margin, ratioPixelPoint, projectPoint, map) {
            
            _width = widthMM / ratioPixelPoint;
            _height = heightMM / ratioPixelPoint;
            _margin = margin;
            _ratioPixelPoint = ratioPixelPoint;

            _map = map;
            _svg = d3.select(id).append("svg")
                .attr("width", _map.getSize().x)
                .attr("height", _map.getSize().y)
                .style("left", "0px")
                .style("top", "-" + ( _map.getSize().y / 2 ) + "px");
            
            _g = _svg.append("g")
                    // .attr("class", "leaflet-zoom-hide")
                    .attr("id", "drawing-layer");

            _transform = d3.geo.transform({point: projectPoint}),
            _path = d3.geo.path().projection(_transform);

            _feature = _g.selectAll("path")
                        .data(_collection.features)
                        .enter().append("path");
            
            /*_
            ProjectionService.init(widthMM, heightMM);
            
            _drawingDOM = d3.select(id).append('svg')
                    .attr('width', widthMM + 'mm')
                    .attr('height', heightMM + 'mm')
                    .attr('viewBox', '0 0 ' 
                                + (_width / _ratioPixelPoint) 
                                + ' ' 
                                + (_height / _ratioPixelPoint))

            // LayerService.createMapLayer(_drawingDOM, _width, _height);
            */
            LayerService.createDefs(_svg);
            LayerService.createDrawing(_g);
            LayerService.createSource(_svg);
            
            _overlay = d3.select(id).append('svg')
                    .attr("width", _width)
                    .attr("height", _height);

            LayerService.createMargin(_overlay, _width, _height, _margin);
            LayerService.createFrame(_overlay, _width, _height);

        }

        function drawFeature() {

        }

        function resetView() {
            console.log('d3.drawing:resetView')
            var bounds = _path.bounds(_collection),
                topLeft = bounds[0],
                mapWidth = _map.getSize().x,
                mapHeight = _map.getSize().y,
                bottomRight = bounds[1],
                width = bottomRight[0] - topLeft[0],
                height = bottomRight[1] - topLeft[1],
                translationX = 0,
                translationY = ( mapHeight / 2 )
                ;

            // _svg.attr("width", bottomRight[0] - topLeft[0])
            //     .attr("height", bottomRight[1] - topLeft[1])
            //     .style("left", topLeft[0] + "px")
            //     .style("top", topLeft[1] + "px");
            
            _g  .attr("transform", "translate(" + translationX + "," + translationY + ")");


            // _svg.attr("width", _map.getSize().x)
            //     .attr("height", _map.getSize().y)
            //     .style("left", "0px")
            //     .style("top", "-" + ( _map.getSize().y / 2 ) + "px" );

            // _g  .attr("transform", "translate(0," + ( _map.getSize().y / -2 ) + ")");

            _feature.attr("d", _path);
        }

        /**
         * Function moving the overlay svg, thanks to map movements...
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function mapMoved() {

            // x,y are coordinates to position overlay
            // coordinates 0,0 are not the top left, but the point at the middle left
            var x = 
                // to get x, we calc the space between left and the overlay
                ( ( _map.getSize().x - _width) / 2 ) 
                // and we substract the difference between the original point of the map 
                // and the actual bounding topleft point
                - (_map.getPixelOrigin().x - _map.getPixelBounds().min.x),

                y = 
                // to get y, we calc the space between the middle axe and the top of the overlay
                _height / -2 
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                - (_map.getPixelOrigin().y - _map.getPixelBounds().min.y - _map.getSize().y / 2);

            _overlay.style("left", x + "px")
                    .style("top", y + "px");

        }
    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['ProjectionService', 'LayerService'];

})();