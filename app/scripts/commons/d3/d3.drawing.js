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
 */
(function() {
    'use strict';

    function DrawingService(ProjectionService, LayerService, settings) {

        this.initDrawing  = initDrawing;
        this.resetView    = resetView;
        this.mapMoved     = mapMoved;
        this._path        = _path;
        this.geojsonToSvg = geojsonToSvg;

        var _width,
            _height,
            _margin,
            _ratioPixelPoint,
            _geojson = [],
            _path,
            _map,
            _drawingDOM,
            _feature,
            _projectPoint,
            _projection,
            _collection = {
                "type":"FeatureCollection",
                "features":[
                    {
                        "type":"Feature",
                        "id":"node/455444970",
                        "properties": {
                            "type":"node",
                            "id":"455444970",
                            "tags": {
                                "amenity":"pub",
                                "name":"Ô Boudu Pont"
                            },
                            "relations":[],
                            "meta":{}
                        },
                        "geometry":{
                            "type":"Point",
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
         * 
         * @param  {function} projectPoint 
         * Function used to project point's coordinates from LatLng to layer points
         * 
         * @param  {Object} map 
         * Reference to leaflet map... TODO please remove it !
         * 
         * @param  {Object} fillPatterns 
         * object providing patterns svg to add for filling purposes
         */
        function initDrawing(id, widthMM, heightMM, margin, ratioPixelPoint, projectPoint, map, fillPatterns) {
            
            _width           = widthMM / ratioPixelPoint;
            _height          = heightMM / ratioPixelPoint;
            _margin          = margin;
            _ratioPixelPoint = ratioPixelPoint;

            _projectPoint    = projectPoint;
            _projection      = projectPoint;

            _map = map;
            _svg = d3.select(id).append("svg")
                .attr("width", _map.getSize().x)
                .attr("height", _map.getSize().y)
            
            // Add defs to svg for fill patterns
            angular.forEach(fillPatterns, function(key) {
                _svg.call(key);
                // legendsvg.call(key);
            });

            _g = _svg.append("g")
                    .attr("class", "leaflet-zoom-hide")
                    .attr("id", "drawing-layer");

            _transform = d3.geo.transform({point: projectPoint}),
            _path = d3.geo.path().projection(_transform);

            // var _projection = d3.geo.mercator()
            //         .scale(Math.pow(2, 22) / 2 / Math.PI)
            //         .translate([_width / 2, _height / 2]);

            // _path = d3.geo.path().projection(_projection);

            _feature = _g.selectAll("path")
                        .data(_collection.features)
                        .enter().append("path");
            
            LayerService.createDefs(_svg);
            LayerService.createDrawing(_g);
            LayerService.createSource(_svg);
            
            _overlay = d3.select(id).append('svg')
                    .attr("width", _width)
                    .attr("height", _height);

            LayerService.createMargin(_overlay, _width, _height, _margin);
            LayerService.createFrame(_overlay, _width, _height);

        }

        /**
         * @ngdoc method
         * @name zoomed
         * @methodOf accessimapEditeurDerApp.DrawingService
         * @description 
         * Event function triggered when a zoom is made on the drawing 
         * (mousewheel, dbl click, ...)
         */
        function zoomed() {

            angular.forEach(_geojson, function(geojson) {
                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _path);

                d3.selectAll('path.inner.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _path);

                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type === 'Point'; })
                        .attr('cx', function(d) {
                            return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).x;
                        })
                        .attr('cy', function(d) {
                            return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).y;
                        })
                        .attr('d', function(d) {
                            var coords = _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]);

                            return geojson.style.path(coords.x, coords.y, geojson.style.radius);
                        })
                        .attr('transform', function(d) {
                            if (this.transform.baseVal.length > 0) {
                                var coords = _projection(d.geometry.coordinates);

                                return 'rotate(' + geojson.rotation + ' ' + coords[0] + ' ' + coords[1] + ')';
                            }
                        });
            });

            // _projection
            //     .scale(_zoom.scale() / 2 / Math.PI)
            //     .translate(_zoom.translate());

        }

        /**
         * Positioning correctly overlays & features
         * according to map size / pan / zoom
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function resetView() {

            var translationX = 0,
                translationY = ( _map.getSize().y / 2 ),
            
            x = 
                // to get x, we calc the space between left and the overlay
                // and we substract the difference between the original point of the map 
                // and the actual bounding topleft point
                - (_map.getPixelOrigin().x - _map.getPixelBounds().min.x),

                y = 
                // to get y, we calc the space between the middle axe and the top of the overlay
                _map.getSize().y / -2 
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                - (_map.getPixelOrigin().y - _map.getPixelBounds().min.y - _map.getSize().y / 2);

            _svg
                .style("left", x + "px")
                .style("top",  y + "px");
            
            // _g  .attr("transform", "translate(" + translationX + "," + translationY + ")");
            // _g  .attr("transform", "translate(0," + ( _map.getSize().y / -2 ) + ")");
            _g  .attr("transform", "translate(" + x*-1 + "," + y*-1 + ")");

            zoomed();

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

            x = - (_map.getPixelOrigin().x - _map.getPixelBounds().min.x);
            y = _map.getSize().y / -2 
                - (_map.getPixelOrigin().y - _map.getPixelBounds().min.y - _map.getSize().y / 2);

            _svg
                .style("left", x + "px")
                .style("top",  y + "px");

            _g  .attr("transform", "translate(" + x*-1 + "," + y*-1 + ")");
        }

        /**
         * @ngdoc method
         * @name  geojsonToSvg
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description simplify... ?
         * @param  {Object} data       [description]
         * @param  {Object} feature       [description]
         * @param  {Object} optionalClass [description]
         */
        function geojsonToSvg(data, simplification, id, poi, queryChosen, styleChosen, 
            styleChoices, colorChosen, checkboxModel, rotationAngle) {
            if (data) {
                // data.features.forEach(function(feature, index) {
                //     if (simplification) {
                //         data.features[index] = turf.simplify(feature, simplification, false);
                //     }
                // });

                var featureExists, obj;

                if (id) {
                    featureExists = _geojson.filter(function(obj) {
                        return obj.id === id;
                    });
                } else {
                    featureExists = _geojson.filter(function(obj) {
                        return obj.id === queryChosen.id;
                    });
                }

                if (featureExists.length === 0) {

                    if (poi) {
                        var tags = data.features[0].properties.tags,
                            name = tags.name || tags.amenity || tags.shop || 'POI';
                        obj = {
                            id: id,
                            name: name,
                            geometryType: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            rotation: 0
                        };
                        /*addToLegend({'type': 'point', 'name': name, 'id': id}, 
                                    styleChosen, 
                                    _geojson.length, 
                                    colorChosen, 
                                    checkboxModel);*/
                    } else {
                        obj = {
                            id: queryChosen.id,
                            name: queryChosen.name,
                            geometryType: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            contour: checkboxModel.contour,
                            color: colorChosen
                        };
                        // addToLegend(queryChosen, styleChosen, _geojson.length, colorChosen, checkboxModel);
                    }
                    _geojson.push(obj);
                    drawFeature(data, [obj], null, styleChosen, colorChosen, checkboxModel, rotationAngle);

                    if (styleChosen.styleInner) {
                        drawFeature(data, [obj], 'inner', styleChosen, colorChosen, checkboxModel, rotationAngle);
                    }

                } else {
                    drawFeature(data, featureExists, null, styleChosen, colorChosen, checkboxModel, rotationAngle);

                    if (styleChosen.styleInner) {
                        drawFeature(data, 
                            featureExists, 
                            'inner', 
                            styleChosen, 
                            colorChosen, 
                            checkboxModel, 
                            rotationAngle);
                    }
                }
            }
        }

        /**
         * @ngdoc method
         * @name  drawFeature
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description simplify... ?
         * @param  {Object} data       [description]
         * @param  {Object} feature       [description]
         * @param  {Object} optionalClass [description]
         */
        function drawFeature(data, feature, optionalClass, styleChosen, 
            colorChosen, checkboxModel, rotationAngle) {
            var featureGroup,
                geometryType = feature[0].geometryType,
                drawingLayer = d3.select('#' + geometryType + 's-layer');
            
            if (optionalClass) {
                if (d3.select('.vector.' + optionalClass + '#' + feature[0].id).empty()) {
                    featureGroup = drawingLayer.append('g')
                    .classed('vector', true)
                    .classed(optionalClass, true)
                    .classed('rotable', true)
                    .attr('id', feature[0].id);
                } else {
                    featureGroup = d3.select('.vector.' + optionalClass + '#' + feature[0].id);
                }
            } else {
                if (d3.select('.vector#' + feature[0].id).empty()) {
                    featureGroup = drawingLayer.append('g')
                    .classed('vector', true)
                    .classed('rotable', true)
                    .attr('id', feature[0].id);
                } else {
                    featureGroup = d3.select('.vector#' + feature[0].id);
                }
            }

            featureGroup
                .selectAll('path')
                // specific for every features except points
                .data(data.features.filter(function(d) {
                    return d.geometry.type !== 'Point';
                }))
                .enter().append('path')
                .attr('class', function(d) {
                    if (optionalClass) {
                        return feature[0].id + ' ' + optionalClass + ' link_' + d.properties.id;
                    } else {
                        return feature[0].id + ' link_' + d.properties.id;
                    }
                })
                .attr('data-link', function(d) {
                    return d.properties.id;
                })
                .attr('name', function(d) {
                    if (d.properties.tags) {
                        return d.properties.tags.name;
                    }
                })
                .attr('e-style', styleChosen.id)
                .attr('e-color', colorChosen.color)
                .attr('d', function(d) {
                    return _path(d);
                })
                .append('svg:title')
                .text(function(d) { 
                    return d.properties.tags.name; 
                })

                // specific for point's features
                .data(data.features.filter(function(d) {
                    return d.geometry.type === 'Point';
                }))
                .enter().append('path')
                .attr('class', feature[0].id)
                .attr('name', function(d) {
                    if (d.properties.tags) {
                        return d.properties.tags.name;
                    }
                })
                .attr('cx', function(d) {
                    return _projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).x;
                })
                .attr('cy', function(d) {
                    return _projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).y;
                })
                .attr('d', function(d) {
                    var coords = _projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]);

                    return feature[0].style.path(coords.x, coords.y, feature[0].style.radius);
                });

            // settings style attributes
            angular.forEach(feature[0].style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    d3.select('#' + feature[0].id).attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    d3.select('#' + feature[0].id).attr(k, v);
                }
            });

            if (optionalClass) {
                angular.forEach(feature[0].style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        if (colorChosen && colorChosen.color !== 'none') {
                            v += '_' + colorChosen.color;
                        }
                        d3.select('.' + optionalClass + '#' + feature[0].id)
                            .attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('.' + optionalClass + '#' + feature[0].id)
                            .attr(k, v);
                    }
                });
            }

            // if (checkboxModel.contour && !d3.select('#' + feature[0].id).attr('stroke')) {
            //     d3.select('#' + feature[0].id)
            //         .attr('stroke', 'black')
            //         .attr('stroke-width', '2');
            // }

            if (optionalClass) {
                angular.forEach(feature[0].style['style_' + optionalClass], function(attribute) {
                    d3.select('.' + optionalClass + '#' + feature[0].id)
                        .attr(attribute.k, attribute.v);
                });
            }

            // // Update the uid so to ensure this will be unique
            // angular.forEach(data.features, function(f) {
            //     if ($rootScope.uid < f.properties.id) {
            //         $rootScope.uid = f.properties.id;
            //     }
            // });

            // rotate(rotationAngle);
        }
        
 
    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['ProjectionService', 'LayerService', 'settings'];

})();