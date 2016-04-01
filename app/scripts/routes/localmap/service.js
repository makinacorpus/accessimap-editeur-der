
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LocalmapService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.svgicon
 * @requires accessimapEditeurDerApp.shareSvg
 * @requires accessimapEditeurDerApp.initSvg
 * @description
 * # LocalmapService
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function LocalmapService($rootScope, $http, $q, usSpinnerService, settings, initSvg, shareSvg, svgicon) {

        /**
         * @ngdoc property
         * @name  _geojson
         * @propertyOf accessimapEditeurDerApp.LocalmapService
         * @type {Array}
         * @description 
         * Arrays of features, representing poi or areas of interest (buildings, roads, ...) on the map
         */
        var _geojson = [],

        /**
         * @ngdoc property
         * @name  _tile
         * @propertyOf accessimapEditeurDerApp.LocalmapService
         * @type {Array}
         * @description 
         *
         * ?
         */
        _tile = null,

        _zoom = null,

        _projection = null,

        _raster = null,

        _path = null,

        _width = null,
        _height = null,
        _margin = 40,

        /**
         * @ngdoc property
         * @name  _mapSelector
         * @propertyOf accessimapEditeurDerApp.LocalmapService
         * @type {String}
         * @description selector CSS to get the DOM element containing the map
         */
        _mapSelector = '#map',
        _map = null,

        /**
         * @ngdoc property
         * @name  _legendSelector
         * @propertyOf accessimapEditeurDerApp.LocalmapService
         * @type {String}
         * @description selector CSS to get the DOM element containing the legend
         */
        _legendSelector = '#legend',


        _legendContainer = null;

        /**
         * @ngdoc method
         * @name zoomed
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description Event function triggered when a zoom is made on the map (mousewheel, dbl click, ...)
         */
        function zoomed() {

            var tiles = _tile
                        .scale(_zoom.scale())
                        .translate(_zoom.translate())();

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
                            return _projection(d.geometry.coordinates)[0];
                        })
                        .attr('cy', function(d) {
                            return _projection(d.geometry.coordinates)[1];
                        })
                        .attr('d', function(d) {
                            var coords = _projection(d.geometry.coordinates);

                            return geojson.style.path(coords[0], coords[1], geojson.style.radius);
                        })
                        .attr('transform', function(d) {
                            if (this.transform.baseVal.length > 0) {
                                var coords = _projection(d.geometry.coordinates);

                                return 'rotate(' + geojson.rotation + ' ' + coords[0] + ' ' + coords[1] + ')';
                            }
                        });
            });

            _projection
                .scale(_zoom.scale() / 2 / Math.PI)
                .translate(_zoom.translate());

            var image = _raster
                    .attr('transform', 'scale(' + tiles.scale + ')translate(' + tiles.translate + ')')
                    .selectAll('image')
                    .data(tiles, function(d) { return d; });

            image.exit()
                    .remove();

            image
                .enter()
                .append('image')
            .attr('xlink:href', function(d) {
                var url = 'http://' + ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
                url += '.tile.openstreetmap.org/' + d[2] + '/' + d[0] + '/' + d[1] + '.png';

                return url;
            })
            .attr('width', 1)
            .attr('height', 1)
            .attr('x', function(d) { return d[0]; })
            .attr('y', function(d) { return d[1]; });

        }

        /**
         * @ngdoc method
         * @name  addToLegend
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description Add a text in the legend,
         * @param {Object} query    [description]
         * @param {Object} style    [description]
         * @param {Object} position [description]
         */
        function addToLegend(query, style, position, colorChosen, checkboxModel) {
            var legendGroup = _legendContainer.append('g')
                    .attr('class', 'legend')
                    .attr('id', query.id),
                symbol;

            switch(query.type) {
                case 'line':
                    symbol = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');

                    var symbolInner = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('class', 'inner')
                        .attr('fill', 'red');

                    angular.forEach(style.style, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbol.attr(k, v);
                    });

                    if (style.styleInner) {
                        angular.forEach(style.styleInner, function(attribute) {
                            var k = attribute.k,
                                v = attribute.v;

                            if (typeof(v) === 'function') {
                                v = v.url();
                            }
                            symbolInner.attr(k, v);
                        });
                    }
                    break;

                case 'point':
                    symbol = legendGroup.append('path')
                        .attr('cx',_margin * 2 + 20)
                        .attr('cy', position * 40 +_margin * 2 + style.radius / 2)
                        .attr('d', function() {
                            var x = parseFloat(d3.select(this).attr('cx')),
                                    y = parseFloat(d3.select(this).attr('cy'));

                            return style.path(x, y, style.radius);
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;

                case 'polygon':
                    symbol = legendGroup.append('rect')
                        .attr('x', function() {
                            return _margin * 2;
                        })
                        .attr('y', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('width', function() {
                            return 40;
                        })
                        .attr('height', function() {
                            return 15;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;
            }

            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            if (checkboxModel && checkboxModel.contour && !symbol.attr('stroke')) {
                symbol
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            legendGroup
                .append('text')
                .attr('x', function() {
                    return _margin * 2 + 50;
                })
                .attr('y', function() {
                    return position * 40 +_margin * 2 + 20;
                })
                .attr('font-family', 'Braille_2007')
                .attr('font-size', '35px')
                .attr('class', 'braille')
                .text(function() {
                    return query.name;
                });
        }

        /**
         * @ngdoc method
         * @name  storeMapAndLegend
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description store in a share service the current map & legend
         * @return {Promise} Promise resolved when map & legend are stored
         * 
         */
        function storeMapAndLegend() {
            
            var deferred = $q.defer(),
                svg    = d3.select(_mapSelector).select('svg').node(),
                legend = d3.select(_legendSelector).select('svg').node();
            
            // disable zoom event
            _zoom.on('zoom', null)
                 .on('zoomend', null);

            var transform = d3.select('#drawing-layer').attr('transform'),
                rotation = null;

            if (transform) {
                rotation = transform.replace('rotate(', 'rotate(-');
            }

            shareSvg
                .setMap(svg)
                .then(function() {
                    shareSvg
                        .setLegend(legend)
                        .then(function() {
                            deferred.resolve();
                        });
                });

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name  removeFeature
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description  remove a 'feature' = item of '_geojson' collection.
         *
         * Remove it from the array and from the map / legend
         * @param  {Object} id id of the feature
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
         * @name  updateFeature
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description  update the style of a 'feature' = item of '_geojson' collection.
         *
         * @param  {Object} id id of the feature
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
         * @name  simplifyFeatures
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description simplify... ?
         * @param  {Object} feature       [description]
         * @param  {Object} queryChosen   [description]
         * @param  {Object} styleChosen   [description]
         * @param  {Object} styleChoices  [description]
         * @param  {Object} colorChosen   [description]
         * @param  {Object} checkboxModel [description]
         */
        function simplifyFeatures(feature, queryChosen, styleChosen, styleChoices, 
            colorChosen, checkboxModel, rotationAngle) {
            //if (feature.simplification > 0) {
            d3.select('.vector#' + feature.id).remove();

            if (d3.select('.vector.inner#' + feature.id)) {
                d3.select('.vector.inner#' + feature.id).remove();
            }

            var data = $.extend(true, {}, feature.originallayer);
            geojsonToSvg(data, 
                        feature.simplification / 100000, 
                        feature.id, 
                        null, 
                        queryChosen, 
                        styleChosen, 
                        styleChoices, 
                        colorChosen, 
                        checkboxModel, 
                        rotationAngle);
            //}
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
        function drawFeature(data, feature, optionalClass, styleChosen, colorChosen, 
            checkboxModel, rotationAngle) {
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
                .append('svg:title')
                    .text(function(d) { return d.properties.tags.name; })
                .attr('d', _path)
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
                    return _projection(d.geometry.coordinates)[0];
                })
                .attr('cy', function(d) {
                    return _projection(d.geometry.coordinates)[1];
                })
                .attr('d', function(d) {
                    var coords = _projection(d.geometry.coordinates);

                    return feature[0].style.path(coords[0], coords[1], feature[0].style.radius);
                });

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

            if (checkboxModel.contour && !d3.select('#' + feature[0].id).attr('stroke')) {
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

            // Update the uid so to ensure this will be unique
            angular.forEach(data.features, function(f) {
                if ($rootScope.uid < f.properties.id) {
                    $rootScope.uid = f.properties.id;
                }
            });

            rotate(rotationAngle);
        }

        /**
         * @ngdoc method
         * @name  rotateFeature
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description rotate a feature element (feature.id) of a feature.rotation
         * @param  {Object} feature       Object with id & rotation properties
         */
        function rotateFeature(feature) {
            var features = d3.selectAll('.' + feature.id);
            angular.forEach(features[0], function(featurei) {
                var cx = d3.select(featurei).attr('cx'),
                    cy = d3.select(featurei).attr('cy');
                d3.select(featurei).attr('transform', 'rotate(' + feature.rotation + ' ' + cx + ' ' + cy + ')');
            });
        };

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
                data.features.forEach(function(feature, index) {
                    if (simplification) {
                        data.features[index] = turf.simplify(feature, simplification, false);
                    }
                });
                var featureExists;

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
                    var obj;

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
                        addToLegend({'type': 'point', 'name': name, 'id': id}, 
                                    styleChosen, 
                                    _geojson.length, 
                                    colorChosen, 
                                    checkboxModel);
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
                        addToLegend(queryChosen, styleChosen, _geojson.length, colorChosen, checkboxModel);
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

                _map.call(_zoom);
                zoomed();
            }
        }

        /**
         * @ngdoc method
         * @name  downloadPoi
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description Add an event to the click on the svg dom element
         * @param  {Object} queryChosen   [description]
         * @param  {Object} styleChosen   [description]
         * @param  {Object} styleChoices  [description]
         * @param  {Object} colorChosen   [description]
         * @param  {Object} checkboxModel [description]
         * @param  {Object} rotationAngle [description]
         */
        function downloadPoi(queryChosen, styleChosen, styleChoices, colorChosen, checkboxModel, rotationAngle) {
            $(_mapSelector).css('cursor', 'crosshair');
            d3.select('svg')
                .on('click', function() {
                    var coordinates = d3.mouse(this),
                        point = _projection.invert(coordinates);
                    downloadData(point, 
                            queryChosen, 
                            styleChosen, 
                            styleChoices, 
                            colorChosen, 
                            checkboxModel, 
                            rotationAngle);
                });
        }

        /**
         * @ngdoc method
         * @name  downloadData
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description 
         * Retrieve data from OSM for a specific point, and display the information on the svg element
         * @param  {Object} point         [description]
         * @param  {Object} queryChosen   [description]
         * @param  {Object} styleChosen   [description]
         * @param  {Object} styleChoices  [description]
         * @param  {Object} colorChosen   [description]
         * @param  {Object} checkboxModel [description]
         * @param  {Object} rotationAngle [description]
         */
        function downloadData(point, queryChosen, styleChosen, styleChoices, colorChosen, 
            checkboxModel, rotationAngle) {
            usSpinnerService.spin('spinner-1');
            var mapS,
                    mapW,
                    mapN,
                    mapE;

            if (point) {
                mapS = parseFloat(point[1]) - 0.00005;
                mapW = parseFloat(point[0]) - 0.00005;
                mapN = parseFloat(point[1]) + 0.00005;
                mapE = parseFloat(point[0]) + 0.00005;
            } else {
                $(_mapSelector).css('cursor', 'auto');
                var boundsNW = _projection.invert([0, 0]),
                    boundsSE = _projection.invert([_width, _height]);
                mapS = boundsSE[1];
                mapW = boundsNW[0];
                mapN = boundsNW[1];
                mapE = boundsSE[0];
            }
            var url = settings.XAPI_URL + '[out:xml];(';

            for (var i = 0; i < queryChosen.query.length; i++) {
                url += queryChosen.query[i];
                url += '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + ');';
            }
            url += ');out body;>;out skel qt;';
            $http.get(url)
                .success(function successDownload(data) {
                    var osmGeojson = osmtogeojson(new DOMParser().parseFromString(data, 'text/xml'));

                    // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
                    // Polygon coordinates need therefore to be reversed

                    osmGeojson.features.forEach(function(feature, index) {

                        if (feature.geometry.type === 'Polygon') {
                            var n = feature.geometry.coordinates.length;
                            feature.geometry.coordinates[0].reverse();

                            if (n > 1) {
                                for (var i = 1; i < n; i++) {
                                    var reversedCoordinates = feature.geometry.coordinates[i].slice().reverse();
                                    osmGeojson.features[index].geometry.coordinates[i] = reversedCoordinates;
                                }
                            }
                        }

                        if (feature.geometry.type === 'MultiPolygon') {
                            // Split it in simple polygons
                            feature.geometry.coordinates.forEach(function(coords) {
                                var n = coords.length;
                                coords[0].reverse();

                                if (n > 1) {
                                    for (var i = 1; i < n; i++) {
                                        coords[i] = coords[i].slice().reverse();
                                    }
                                }
                                osmGeojson.features.push({'type': 'Feature',
                                                        'properties': osmGeojson.features[index].properties,
                                                        'geometry': {'type': 'Polygon', 'coordinates': coords
                                                       }});
                            }
                       );
                        }
                    });

                    if (queryChosen.id === 'poi') {
                        osmGeojson.features = [osmGeojson.features[0]];

                        if (osmGeojson.features[0]) {
                            geojsonToSvg(osmGeojson, 
                                            undefined, 
                                            'node_' + osmGeojson.features[0].properties.id, 
                                            true, 
                                            queryChosen, 
                                            styleChosen, 
                                            styleChoices, 
                                            colorChosen, 
                                            checkboxModel, 
                                            rotationAngle);
                        }

                    } else {
                        geojsonToSvg(osmGeojson, 
                                    undefined, 
                                    undefined, 
                                    null, 
                                    queryChosen, 
                                    styleChosen, 
                                    styleChoices, 
                                    colorChosen, 
                                    checkboxModel, 
                                    rotationAngle);
                    }

                    usSpinnerService.stop('spinner-1');
                })
                .error(function(e) {
                    usSpinnerService.stop('spinner-1');
                    console.error(e);
                });
        }

        /**
         * @ngdoc method
         * @name  zoomOnPlace
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description  
         * Locate addresses, add POI on the map, and zoom on it.
         * @param  {Object} address Contains two sub objects, start & stop, representing two places to locate
         */
        function zoomOnPlace(address, styleChosen, colorChosen, checkboxModel, rotationAngle) {
            var start = address.start !== '' && address.start,
                stop = address.stop !== '' && address.stop;

            if (start && stop) {
                var urlStart = 'http://nominatim.openstreetmap.org/search/' + start + '?format=json&limit=1';
                $http.get(urlStart).success(function(dataStart) {
                    if (dataStart[0]) {
                        var urlStop = 'http://nominatim.openstreetmap.org/search/' + stop + '?format=json&limit=1';
                        $http.get(urlStop).success(function(dataStop) {
                            if (dataStop[0]) {
                                var p = d3.geo.mercator()
                                        .scale(_zoom.scale() / 2 / Math.PI)
                                        .translate([_width / 2, _height / 2]),
                                    lonStart = parseFloat(dataStart[0].lon),
                                    latStart = parseFloat(dataStart[0].lat),
                                    lonStop = parseFloat(dataStop[0].lon),
                                    latStop = parseFloat(dataStop[0].lat),
                                    locationStart = p([lonStart, latStart]),
                                    locationStop = p([lonStop, latStop]),
                                    pointStart = turf.point([lonStart, latStart]),
                                    pointStop = turf.point([lonStop, latStop]),

                                // Calculate the new map scale
                                    s = ( _zoom.scale() / 
                                            Math.max(Math.abs(locationStart[0] - locationStop[0]) / _width, 
                                                    Math.abs(locationStart[1] - locationStop[1]) / _height) / 1.2 );
                                
                                p = d3.geo.mercator()
                                        .scale(s / 2 / Math.PI)
                                        .translate([_width / 2, _height / 2]);
                                
                                var coordinates = [(lonStart + lonStop) / 2, (latStart + latStop) / 2],
                                    location = p(coordinates),
                                    translateX = _width - location[0],
                                    translateY = _height - location[1];

                                _zoom.translate([translateX, translateY])
                                    .scale(s);

                                if (d3.select('#startPoint').node()) {
                                    d3.select('#startPoint').remove();
                                }

                                if (d3.select('#stopPoint').node()) {
                                    d3.select('#stopPoint').remove();
                                }
                                var objStart = {
                                    id: 'startPoint',
                                    name: 'Point de départ',
                                    geometryType: 'point',
                                    layer: $.extend(true, {}, pointStart), //deep copy,
                                    originallayer: $.extend(true, {}, pointStart), //deep copy
                                    style: settings.STYLES.point[2],
                                    styleChoices: settings.STYLES.point,
                                    rotation: 0
                                },
                                objStop = {
                                    id: 'stopPoint',
                                    name: 'Point d\'arrivée',
                                    geometryType: 'point',
                                    layer: $.extend(true, {}, pointStop), //deep copy,
                                    originallayer: $.extend(true, {}, pointStop), //deep copy
                                    style: settings.STYLES.point[2],
                                    styleChoices: settings.STYLES.point,
                                    rotation: 0
                                };
                                zoomed();

                                _geojson.push(objStart);
                                var featuresStart = turf.featurecollection([pointStart]);
                                drawFeature(featuresStart, 
                                            [objStart], 
                                            null, 
                                            styleChosen, 
                                            colorChosen, 
                                            checkboxModel, 
                                            rotationAngle);
                                _geojson.push(objStop);
                                var featuresStop = turf.featurecollection([pointStop]);
                                drawFeature(featuresStop, 
                                            [objStop], 
                                            null, 
                                            styleChosen, 
                                            colorChosen, 
                                            checkboxModel, 
                                            rotationAngle);
                            }
                        });
                    }
                });
            } else {
                var place = start || stop,
                    url = 'http://nominatim.openstreetmap.org/search/' + place + '?format=json&limit=1';
                $http.get(url).
                    success(function(data) {
                        if (data[0]) {
                            var s = Math.pow(2, 24),
                                p = d3.geo.mercator()
                                    .scale(s / 2 / Math.PI)
                                    .translate([_width / 2, _height / 2]),
                                lon = data[0].lon,
                                lat = data[0].lat,
                                point = turf.point([lon, lat]),
                                location = p([lon, lat]),
                                t = [_width - location[0], _height - location[1]];

                            // Draw a point
                            if (d3.select('#uniquePoint').node()) {
                                d3.select('#uniquePoint').remove();
                            }
                            var obj = {
                                id: 'uniquePoint',
                                name: 'Point de départ',
                                geometryType: 'point',
                                layer: $.extend(true, {}, point), //deep copy,
                                originallayer: $.extend(true, {}, point), //deep copy
                                style: settings.STYLES.point[0],
                                styleChoices: settings.STYLES.point,
                                rotation: 0
                            };
                            _zoom.scale(s)
                                .translate(t);
                            zoomed();

                            _geojson.push(obj);
                            var features = turf.featurecollection([point]);
                            drawFeature(features, [obj], null, styleChosen, colorChosen, checkboxModel, rotationAngle);
                        }
                    });
            }
        }
        
        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LocalmapService.initMap
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description 
         *
         * Init the dom element _mapSelector by :
         * - createDefs ?
         * - 
         * @param  {settings.FORMATS} mapFormat    Format of the map (A4, A3, ...)
         * @param  {settings.FORMATS} legendFormat Format of the legend (A4, A3, ...)
         */
        function init(mapFormat, legendFormat) {

            var widthMm        = settings.FORMATS[mapFormat].width,
                legendWidthMm  = settings.FORMATS[legendFormat].width,
                heightMm       = settings.FORMATS[mapFormat].height,
                legendHeightMm = settings.FORMATS[legendFormat].height,

                mapsvg    = initSvg.createMap(widthMm, heightMm),
                legendsvg = initSvg.createLegend(widthMm, heightMm);

            _width  = widthMm / settings.ratioPixelPoint,
            _height = heightMm / settings.ratioPixelPoint;

            var legendWidth  = legendWidthMm / settings.ratioPixelPoint,
                legendHeight = legendHeightMm / settings.ratioPixelPoint;

            initSvg.createDefs(mapsvg);

            _tile = d3.geo.tile().size([_width, _height]);

            _projection = d3.geo.mercator()
                    .scale(Math.pow(2, 22) / 2 / Math.PI)
                    .translate([_width / 2, _height / 2]);

            _path = d3.geo.path().projection(_projection);

            var center = _projection(settings.leaflet.GLOBAL_MAP_CENTER);
            _zoom = d3.behavior.zoom()
                    .scale(_projection.scale() * 2 * Math.PI)
                    .scaleExtent([Math.pow(2, 11), Math.pow(2, 27)])
                    .translate([_width - center[0], _height - center[1]])
                    .on('zoom', zoomed)
                    .on('zoomend', zoomed);

            // Load polygon fill styles, defined in settings
            angular.forEach(settings.POLYGON_STYLES, function(key) {
                mapsvg.call(key);
                legendsvg.call(key);
            });

            _map = initSvg.createMapLayer(mapsvg, _width, _height);
            _map.attr('transform', 'rotate(0)');

            initSvg.createSource(_map);
            initSvg.createDrawing(_map);
            initSvg.createMargin(mapsvg, _width, _height);
            initSvg.createFrame(mapsvg, _width, _height);
            initSvg.createMargin(legendsvg, legendWidth, legendHeight);

            var sourceLayer = d3.select('#source-layer');
            _raster = sourceLayer.append('g')
                    .attr('class', 'tiles');

            _legendContainer = legendsvg.append('g')
                    .attr('width', legendWidth)
                    .attr('height', legendHeight);

            initSvg.createLegendText(_legendContainer,_margin);

            _map.call(_zoom);

            zoomed();

        }

        /**
         * @ngdoc method
         * @name  rotate
         * @methodOf accessimapEditeurDerApp.LocalmapService
         * @description rotate all '.rotable' elements 
         * @param  {Object} angle [description]
         */
        function rotate(angle) {
            d3.selectAll('.rotable')
                .attr('transform', 'rotate(' + angle + ' ' + _width / 2 + ' ' + _height / 2 + ')');
        }

        return {
            downloadData: downloadData,
            downloadPoi:  downloadPoi,
            removeFeature: removeFeature,
            updateFeature: updateFeature,
            simplifyFeatures: simplifyFeatures,
            rotateFeature: rotateFeature,
            storeMapAndLegend: storeMapAndLegend,
            zoomOnPlace: zoomOnPlace,
            rotate: rotate,
            init: init,
            featureIcon: svgicon.featureIcon,
            settings: settings,
            geojson: _geojson
        }
    }

    angular.module('accessimapEditeurDerApp')
        .service('LocalmapService', LocalmapService);

    LocalmapService.$inject = 
        ['$rootScope', '$http', '$q', 'usSpinnerService', 'settings', 'initSvg', 'shareSvg', 'svgicon'];

})();