/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerGeoJSONService
 * @requires accessimapEditeurDerApp.LayerService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function LayerGeoJSONService(settings, LegendService) {

        var _geojson = [],
            _projection,
            _g,
            _lastTranslationX,
            _lastTranslationY;

        this.createLayer   = createLayer;
        
        this.geojsonToSvg  = geojsonToSvg;
        this.removeFeature = removeFeature;
        this.updateFeature = updateFeature;
        this.rotateFeature = rotateFeature;
        this.drawAddress   = drawAddress;
        this.transform     = transform;
        
        this.getFeatures   = function() { 
            return _geojson.slice(0)
        }
        this.setFeatures   = function(features) { 
            _geojson = features ;
        }

        this.refresh     = refresh;
        this.translate     = translate;

        function createLayer(target, width, height, margin, projectPoint) {
            _projection = projectPoint;

            _g = target
                    .attr("data-name", "geojson-layer")
                    .attr("id", "geojson-layer");

            createDrawing();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerGeoJSONService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         */
        function createDrawing() {
            _g.append('g').attr('data-name', 'polygons-layer');
            _g.append('g').attr('data-name', 'lines-layer');
            _g.append('g').attr('data-name', 'points-layer');
            _g.append('g').attr('data-name', 'text-layer');
        };

        function transform(transform) {
            _g.attr('transform', transform)
        }

        /**
         * @ngdoc method
         * @name refresh
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * Project all paths from _geojson
         */
        function refresh(_projection) {
            
            _geojson.forEach(function (geojson) {

                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _projection.pathFromGeojson)
                        .attr('stroke-width', 2 / _projection.scale)

                d3.selectAll('path.inner.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _projection.pathFromGeojson)
                        .attr('stroke-width', 2 / _projection.scale)

                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type === 'Point'; })
                        .attr('stroke-width', 2 / _projection.scale)
                        .attr('cx', function(d) {
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).x;
                        })
                        .attr('cy', function(d) {
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).y;
                        })
                        .attr('d', function(d) {
                            var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));

                            return geojson.style.path(coords.x, coords.y, geojson.style.radius / _projection.scale);
                        })
                        .attr('transform', function(d) {
                            var result = '';

                            if (this.transform.baseVal.length > 0) {
                                var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                                // var coords = _projection(d.geometry.coordinates);

                                // result += 'rotate(' + geojson.rotation + ' ' + coords[0] + ' ' + coords[1] + ');';
                                result += 'rotate(' + geojson.rotation + ')';//' ' + coords.x + ' ' + coords.y + ');';
                            }

                            return result;
                        });
            });
            
        }

        /**
         * Function moving the overlay svg, thanks to map movements...
         *
         * This function has to be used only if we want the overlay be 'fixed'
         * 
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function translate(size, pixelOrigin, pixelBoundMin) {

            // x,y are coordinates to position overlay
            // coordinates 0,0 are not the top left, but the point at the middle left
            _lastTranslationX = 
                // to get x, we calc the space between left and the overlay
                ( ( size.x ) / 2 ) 
                // and we substract the difference between the original point of the map 
                // and the actual bounding topleft point
                - (pixelOrigin.x - pixelBoundMin.x),

            _lastTranslationY = 
                // to get y, we calc the space between the middle axe and the top of the overlay
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                -1 * (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

            _g.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }
        /**
         * @ngdoc method
         * @name  geojsonToSvg
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * simplify... ?
         * 
         * @param  {Object} data       
         * [description]
         * 
         * @param  {Object} feature       
         * [description]
         * 
         * @param  {Object} optionalClass 
         * [description]
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
                            type: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            rotation: 0
                        };
                        LegendService.addToLegend({'type': 'point', 'name': name, 'id': id}, 
                                    styleChosen, 
                                    _geojson.length, 
                                    colorChosen, 
                                    checkboxModel);
                    } else {
                        obj = {
                            id: queryChosen.id,
                            name: queryChosen.name,
                            type: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            contour: checkboxModel.contour,
                            color: colorChosen
                        };
                        LegendService.addToLegend(queryChosen, styleChosen, _geojson.length, colorChosen, checkboxModel);
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
         * @name  drawAddress
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         *
         * @description 
         * draw a circle for an address
         * 
         * @param  {Object} data
         * data returned by a nominatim server, containing geometry & other stuff
         * to display the poi
         * 
         * @param  {string} id
         * specific string identifying this address
         * useful to erase the d3 node
         * 
         * @param  {settings.STYLES} style
         * style of the point ... ?
         * 
         * @param  {settings.COLORS} color 
         * Color of the POI
         * 
         */
        function drawAddress(data, id, style, color) {
            var lon = data.lon,
                lat = data.lat,
                point = turf.point([lon, lat]);

            // Draw a point
            if (d3.select(id).node()) {
                d3.select(id).remove();
            }

            var obj = {
                id: id,
                name: id,
                type: 'point',
                layer: $.extend(true, {}, point), //deep copy,
                originallayer: $.extend(true, {}, point), //deep copy
                style: settings.STYLES.point[0],
                styleChoices: settings.STYLES.point,
                rotation: 0
            };

            _geojson.push(obj);

            var features = turf.featurecollection([point]);
            drawFeature(features, [obj], null, style, color, null, 0);

        }

        /**
         * @ngdoc method
         * @name  drawFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * Draw the features
         * 
         * @param  {Object} data       
         * [description]
         * 
         * @param  {Object} feature       
         * [description]
         * 
         * @param  {Object} optionalClass 
         * [description]
         * 
         * @param  {Object} styleChosen 
         * [description]
         * 
         * @param  {Object} colorChosen 
         * [description]
         * 
         * @param  {Object} checkboxModel 
         * [description]
         * 
         * @param  {Object} rotationAngle 
         * [description]
         */
        function drawFeature(data, feature, optionalClass, styleChosen, 
            colorChosen, checkboxModel, rotationAngle) {
            var featureGroup,
                type = feature[0].type,
                drawingLayer = d3.select(_g).node().select('[data-name="' + type + 's-layer"]') ; /* d3.select('#' + type + 's-layer') ;*/
            
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
                // .attr('stroke-width', 2 / _projection.scale)
                .attr('d', function(d) {
                    return _projection.pathFromGeojson(d);
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
                // .attr('stroke-width', 2 / _projection.scale)
                .attr('cx', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).x;
                    // return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).x;
                })
                .attr('cy', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).y;
                    // return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).y;
                })
                .attr('d', function(d) {
                    var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                    // var coords = _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]);

                    return feature[0].style.path(coords.x, coords.y, feature[0].style.radius /* / _projection.scale */);
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

            if (checkboxModel 
                && checkboxModel.contour 
                && !d3.select('#' + feature[0].id).attr('stroke')) {
                d3.select('#' + feature[0].id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

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
        
        /**
         * @ngdoc method
         * @name  updateFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description  
         * update the style of a 'feature' = item of '_geojson' collection.
         *
         * @param  {Object} id 
         * id of the feature
         */
        function updateFeature(id, style) {

            var result = _geojson.filter(function(obj) {
                    return obj.id === id;
                }),
                objectId = _geojson.indexOf(result[0]);

            if (_geojson[objectId].contour) {
                d3.select('#' + id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            } else {
                d3.select('#' + id)
                    .attr('stroke', null)
                    .attr('stroke-width', null);
            }

            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (_geojson[objectId].color && _geojson[objectId].color.color !== 'none') {
                        v += '_' + _geojson[objectId].color.color;
                    }
                    d3.select('#' + id)
                        .attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    d3.select('#' + id)
                        .attr(k, v);
                }
            });

            if (style.styleInner) {
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        d3.select('.inner#' + id).attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('.inner#' + id).attr(k, v);
                    }
                });
            }

            if (style.path) {
                _geojson[objectId].style.path = style.path;
                zoomed();
            }

            var symbol = d3.select('.legend#' + id).select('.symbol');

            if (_geojson[objectId].contour) {
                symbol
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            } else {
                symbol
                    .attr('stroke', null)
                    .attr('stroke-width', null);
            }
            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (_geojson[objectId].color && _geojson[objectId].color.color !== 'none') {
                        v += '_' + _geojson[objectId].color.color;
                    }
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            if (style.styleInner) {
                var symbolInner = d3.select('.legend#' + id).select('.inner');
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        symbolInner.attr(k, v);
                    }
                });
            }

            if (style.path) {
                symbol.attr('d', function() {
                    return style.path(symbol.attr('cx'), symbol.attr('cy'), style.radius);
                });
            }
        }
 
        /**
         * @ngdoc method
         * @name  removeFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description  
         * remove a 'feature' = item of '_geojson' collection.
         *
         * Remove it from the array and from the map / legend
         * 
         * @param  {Object} id 
         * id of the feature
         */
        function removeFeature(id) {
            // Remove object from _geojson
            var result = _geojson.filter(function(obj) {
                    return obj.id === id;
                }),
                index = _geojson.indexOf(result[0]);
            _geojson.splice(index, 1);

            // Remove object from map
            d3.select('.vector#' + id).remove();

            if (d3.select('.vector.inner#' + id)) {
                d3.select('.vector.inner#' + id).remove();
            }

            // Remove object from legend
            d3.select('.legend#' + id).remove();
        }

        /**
         * @ngdoc method
         * @name  rotateFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * rotate a feature element (feature.id) of a feature.rotation
         * 
         * @param  {Object} feature       
         * Object with id & rotation properties
         */
        function rotateFeature(feature) {
            var features = d3.selectAll('.' + feature.id);
            angular.forEach(features[0], function(featurei) {
                var cx = d3.select(featurei).attr('cx'),
                    cy = d3.select(featurei).attr('cy');
                d3.select(featurei).attr('transform', 'rotate(' + feature.rotation + ' ' + cx + ' ' + cy + ')');
            });
        };

    }

    angular.module(moduleApp).service('LayerGeoJSONService', LayerGeoJSONService);

    LayerGeoJSONService.$inject = ['settings', 'LegendService'];

})();