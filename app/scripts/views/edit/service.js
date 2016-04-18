/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.MapLeafletService
 * @requires accessimapEditeurDerApp.NominatimService
 * @requires accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LegendService
 * @description
 * Service used for the 'EditController', and the 'edit' view
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function EditService(settings, svgicon, MapLeafletService, NominatimService, DrawingService, LegendService, ProjectionService) {

        this.init          = init;
        this.settings      = settings;
        this.featureIcon   = svgicon.featureIcon;
        this.enableAddPOI  = enableAddPOI;
        this.disableAddPOI = disableAddPOI;
        this.drawFeature   = drawFeature;
        this.geojsonToSvg  = geojsonToSvg;

        var _geojson = [];

        function init(drawingFormat, legendFormat) {

            if (drawingFormat === undefined) 
                drawingFormat = settings.FORMATS[settings.DEFAULT_DRAWING_FORMAT];
            
            if (legendFormat === undefined) 
                legendFormat = settings.FORMATS[settings.DEFAULT_LEGEND_FORMAT];

            MapLeafletService.initMap('drawing', MapLeafletService.resizeFunction);

            DrawingService.initDrawing(MapLeafletService.getMap().getPanes().overlayPane /*'#drawing'*/, 
                            drawingFormat.width, 
                            drawingFormat.height, 
                            settings.margin, 
                            settings.ratioPixelPoint,
                            MapLeafletService.projectPoint,
                            MapLeafletService.getMap())
            
            MapLeafletService.getMap().on('move', DrawingService.mapMoved)
            MapLeafletService.getMap().on('viewreset', DrawingService.resetView)

            MapLeafletService.getMap().fire('move');
            MapLeafletService.getMap().fire('viewreset');

            ProjectionService.init();

            LegendService.initLegend('#legend', 
                                    legendFormat.width, 
                                    legendFormat.height, 
                                    settings.margin, 
                                    settings.ratioPixelPoint);

        }

        /**
         * @ngdoc method
         * @name  enableAddPOI
         * @methodOf accessimapEditeurDerApp.MapLeafletService
         * @description 
         * Enable the 'Add POI' mode, 
         * allowing user to click on the map and retrieve data from OSM
         * @param {function} _successCallback 
         * Callback function called when data has been retrieved, data is passed in first argument
         * @param {function} _errorCallback 
         * Callback function called when an error occured, error is passed in first argument
         */
        function enableAddPOI(_successCallback, _errorCallback) {
            MapLeafletService.changeCursor('crosshair');
            MapLeafletService.addClickListener(function(e) {
                // TODO: prevent any future click 
                // user has to wait before click again
                
                MapLeafletService.changeCursor('progress');
                
                NominatimService
                    .retrieveData([e.latlng.lng,  e.latlng.lat], settings.QUERY_LIST[0])
                    .then(_successCallback)
                    .catch(_errorCallback)
                    .finally(function finallyCallback() {
                        MapLeafletService.changeCursor('crosshair');
                    })
            })
        }

        function disableAddPOI() {
            MapLeafletService.resetCursor();
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

                // _map.call(_zoom);
                // zoomed();
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
                drawingLayer = d3.select('#' + geometryType + 's-layer'),
            
                _path = DrawingService._path ; // d3.geo.path().projection(ProjectionService.project);

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
                    console.log('featureGroup path !' + d.id)

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
                .text(function(d) { 
                    return d.properties.tags.name; 
                })
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
                    // return ProjectionService.project(d.geometry.coordinates)[0];
                    return MapLeafletService.projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).x;
                })
                .attr('cy', function(d) {
                    // return ProjectionService.project(d.geometry.coordinates)[1];
                    return MapLeafletService.projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).y;
                })
                .attr('d', function(d) {
                    var coords = MapLeafletService.projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]);

                    return feature[0].style.path(coords.x, coords.y, feature[0].style.radius);
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

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['settings', 
                            'svgicon', 
                            'MapLeafletService', 
                            'NominatimService', 
                            'DrawingService', 
                            'LegendService', 
                            'ProjectionService'];

})();