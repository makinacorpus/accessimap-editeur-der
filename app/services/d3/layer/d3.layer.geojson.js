// jscs:disable maximumNumberOfLines
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

    function LayerGeoJSONService(SettingsService, LegendService, RadialMenuService) {

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
        this.clean         = clean;

        this.getFeatures   = function() {
            return _geojson.slice(0)
        }
        this.setFeatures   = function(features) {
            _geojson = features ;
        }
        this.resetFeatures   = function() {
            _geojson = [] ;
        }

        this.refresh     = refresh;

        function createLayer(target, projectPoint) {
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
            _g.append('g').attr('data-name', 'texts-layer');
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
        function refresh(projectPoint) {

            if (projectPoint) _projection = projectPoint;

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
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                d.geometry.coordinates[0])).x;
                        })
                        .attr('cy', function(d) {
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                d.geometry.coordinates[0])).y;
                        })
                        .attr('d', function(d) {
                            var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                d.geometry.coordinates[0]));

                            return geojson.style.path(coords.x, coords.y, geojson.style.radius / _projection.scale);
                        })
                        .attr('transform', function(d) {
                            var result = '';

                            if (this.transform.baseVal.length > 0) {
                                var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                                d.geometry.coordinates[0]));

                                result += 'rotate(' + geojson.rotation + ')';//' ' + coords.x + ' ' + coords.y + ');';
                            }

                            return result;
                        });
            });

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
                        LegendService.addItem(id,
                                              name,
                                              'point',
                                              styleChosen,
                                              colorChosen,
                                              checkboxModel.contour);
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
                        LegendService.addItem(queryChosen.id,
                                              queryChosen.name,
                                              queryChosen.type,
                                              styleChosen,
                                              colorChosen,
                                              checkboxModel.contour);
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
         * data returned by a nominatim server,
         * containing geometry & other stuff
         * to display the poi
         *
         * @param  {string} id
         * specific string identifying this address
         * useful to erase the d3 node
         *
         * @param  {SettingsService.STYLES} style
         * style of the point ... ?
         *
         * @param  {SettingsService.COLORS} color
         * Color of the POI
         *
         */
        function drawAddress(data, id, label, style, color) {
            var lon = data.lon,
                lat = data.lat,
                point = turf.point([lon, lat]);

            // Draw a point
            if (d3.select('#' + id).node()) {
                d3.select('#' + id).remove();
            }

            // remove from the _geojson if exist
            var geojsonItemIndex = _geojson.findIndex(function(element, index) {
                return element.id === id
            });

            if (geojsonItemIndex !== -1) {
                _geojson.splice(geojsonItemIndex, 1);
            }

            var obj = {
                id: id,
                name: label,
                type: 'point',
                layer: $.extend(true, {}, point), //deep copy,
                originallayer: $.extend(true, {}, point), //deep copy
                style: SettingsService.STYLES.point[0],
                styleChoices: SettingsService.STYLES.point,
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
        function drawFeature(data, feature, optionalClass, styleChosen, colorChosen, checkboxModel, rotationAngle) {
            var featureGroup,
                type = feature[0].type,
                drawingLayer = d3.select(_g).node().select('[data-name="' + type + 's-layer"]') ;

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
                .attr('data-type', type)
                .attr('data-from', 'osm')
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
                // TODO: useful for lines ?
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
                .attr('data-type', type)
                .attr('data-from', 'osm')
                .attr('class', feature[0].id)
                .attr('name', function(d) {
                    if (d.properties.tags) {
                        return d.properties.tags.name;
                    }
                })
                // TODO: useful for lines ?
                // .attr('stroke-width', 2 / _projection.scale)
                .attr('cx', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                    d.geometry.coordinates[0])).x;
                })
                .attr('cy', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                    d.geometry.coordinates[0])).y;
                })
                .attr('d', function(d) {
                    var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1],
                                                                        d.geometry.coordinates[0]));

                    return feature[0].style.path(coords.x, coords.y, feature[0].style.radius);
                });

            // SettingsService style attributes
            angular.forEach(feature[0].style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    d3.select('#' + feature[0].id).attr('fill', SettingsService.POLYGON_STYLES[v].url());
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
                            .attr('fill', SettingsService.POLYGON_STYLES[v].url());
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
        function updateFeature(id, style, color) {

            var result = _geojson.filter(function(obj) {
                    return obj.id === id;
                }),
                objectId = _geojson.indexOf(result[0]);

            if(color) _geojson[objectId].color = color;

            if(style) _geojson[objectId].style = style;

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
                        .attr('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    d3.select('#' + id)
                        .attr(k, v);
                }
            })

            if (style.styleInner) {
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        d3.select('.inner#' + id).attr('fill', SettingsService.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('.inner#' + id).attr(k, v);
                    }
                })
            }

            if (style.path) {
                _geojson[objectId].style.path = style.path;
                refresh();
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
                    symbol.attr('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            })

            if (style.styleInner) {
                var symbolInner = d3.select('.legend#' + id).select('.inner');
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        symbol.attr('fill', SettingsService.POLYGON_STYLES[v].url());
                    } else {
                        symbolInner.attr(k, v);
                    }
                })
            }

            if (style.path) {
                symbol.attr('d', function() {
                    return style.path(symbol.attr('cx'), symbol.attr('cy'), style.radius);
                })
            }

            // update the legend
            LegendService.updateItem(id,
                                     _geojson[objectId].name,
                                     _geojson[objectId].type,
                                     _geojson[objectId].style,
                                     _geojson[objectId].color,
                                     _geojson[objectId].contour)

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

            LegendService.removeItem(id)

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
        }

        /**
         * @ngdoc method
         * @name clean
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         *
         * @description
         * clean the layer by removing all paths inside the GeoJSON layer
         */
        function clean() {
            _g.select('[data-name="polygons-layer"]').selectAll('*').remove()
            _g.select('[data-name="lines-layer"]').selectAll('*').remove()
            _g.select('[data-name="points-layer"]').selectAll('*').remove()
            _g.select('[data-name="texts-layer"]').selectAll('*').remove()

            // Remove object from _geojson
            _geojson.forEach(function(element, index, array) {
                LegendService.removeItem(element.id);
            })

            _geojson = [];

        }

    }

    angular.module(moduleApp).service('LayerGeoJSONService', LayerGeoJSONService);

    LayerGeoJSONService.$inject = ['SettingsService', 'LegendService', 'RadialMenuService'];

})();
