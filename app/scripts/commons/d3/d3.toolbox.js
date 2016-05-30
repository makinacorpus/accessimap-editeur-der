/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxService(generators, RadialMenuService, settings, UtilService) {

        this.init                          = init;
        
        this.addRadialMenus                = addRadialMenus;
        this.hideRadialMenu                = RadialMenuService.hideRadialMenu;
        
        this.drawPoint                     = drawPoint;
        
        this.writeText                     = writeText;
        
        this.beginLineOrPolygon            = beginLineOrPolygon;
        this.drawHelpLineOrPolygon         = drawHelpLineOrPolygon;
        this.finishLineOrPolygon           = finishLineOrPolygon;
        
        this.drawCircle                    = drawCircle;
        this.updateCircleRadius            = updateCircleRadius;
        
        this.changeTextColor               = changeTextColor;
        this.updateBackgroundStyleAndColor = updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = updateFeatureStyleAndColor;
        this.updateMarker                  = updateMarker;

        this.featureIcon                   = featureIcon;

        this.drawing = {
            drawPoint                     : drawPoint,
            writeText                     : writeText,
            beginLineOrPolygon            : beginLineOrPolygon,
            drawHelpLineOrPolygon         : drawHelpLineOrPolygon,
            finishLineOrPolygon           : finishLineOrPolygon,
            
            drawCircle                    : drawCircle,
            updateCircleRadius            : updateCircleRadius,
            
            changeTextColor               : changeTextColor,
            updateBackgroundStyleAndColor : updateBackgroundStyleAndColor,
            updateFeatureStyleAndColor    : updateFeatureStyleAndColor,
            updateMarker                  : updateMarker,
        }

        var _svgDrawing;
        
        function init(svgDrawing, svgMenu, getCurrentZoom) {
            RadialMenuService.init(svgMenu, getCurrentZoom);
            _svgDrawing = svgDrawing;
        }

        /**
         * @ngdoc method
         * @name  addRadialMenus
         * @methodOf accessimapEditeurDerApp.ToolboxService
         * @description
         *
         * Add radial menus to d3 for differents elements :
         * - path
         * - circle
         * - text
         *
         * Then users can edit these shapes by right-clicking on it
         *
         * @param {Object} model [description]
         */
        function addRadialMenus() {
            RadialMenuService.addRadialMenu(d3.selectAll('path:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('circle:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('text:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('image:not(.notDeletable)'));
        }
        
        /**
         * @ngdoc method
         * @name  drawPoint
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Draw a point (circle, arrow,...) at specific coordinates
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         * @param  {Object} style 
         * settings.STYLE of the point
         * 
         * @param  {Object} color 
         * settings.COLOR of the point
         * 
         */
        function drawPoint(x, y, style, color) {

            var iid = UtilService.getiid(),

                feature = d3.select(_svgDrawing).node().select('g[data-name="points-layer"]')
                    .append('path')
                    .classed('link_' + iid, true)
                    .attr('d', style.path(x,y,style.radius))
                    .attr('data-link', iid)
                    .attr('data-type', 'point');
            
            applyStyle(feature, style.style, color);

            RadialMenuService.addRadialMenu(feature);
        }

        /**
         * @ngdoc method
         * @name  drawCircle
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Draw a circle at specific coordinates 
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         * @param  {Object} style 
         * settings.STYLE of the point
         * 
         * @param  {Object} color 
         * settings.COLOR of the point
         * 
         * @param  {boolean} contour
         * If true add a shape to the circle
         * 
         */
        function drawCircle(x, y, style, color, contour) {
            var feature;

            if (d3.select('.edition')[0][0]) { // second click
                feature = d3.select('.edition');
                var xOffset = x - feature.attr('cx'),
                    yOffset = y - feature.attr('cy'),
                    r = Math.sqrt(Math.pow(xOffset, 2) 
                                + Math.pow(yOffset, 2));
                feature.attr('r', r)
                    .attr('e-style', style.id)
                    .attr('e-color', color.color);
                feature.classed('edition', false);
            } else { // first click
                var iid = UtilService.getiid();
                feature = d3.select(_svgDrawing).node().select('g[data-name="polygons-layer"]') 
                    .append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid)
                    .attr('data-type', 'circle')
                    .classed('edition', true);

                applyStyle(feature, style.style, color);

                if (contour && !feature.attr('stroke')) {
                    feature
                        .attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }
            }
            RadialMenuService.addRadialMenu(feature);
        }

        /**
         * @ngdoc method
         * @name  updateCircleRadius
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Update the radius of a feature circle
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         */
        function updateCircleRadius(x, y) {
            var feature = d3.select('.edition');

            if (feature[0][0]) {
                var xOffset = x - feature.attr('cx'),
                    yOffset = y - feature.attr('cy'),
                    r = Math.sqrt(Math.pow(xOffset, 2) 
                                + Math.pow(yOffset, 2));
                feature.attr('r', r);
            }
        }

        function beginLineOrPolygon(x, y, style, color, contour, mode, lastPoint, lineEdit) {
            var drawingLayer = d3.select(_svgDrawing).node().select('g[data-name="' + mode + 's-layer"]'),
                path,
                pathInner;

            // follow the line / polygon
            if (d3.select('.edition')[0][0]) {
                path = d3.select('.edition');

                if (mode === 'line') {
                    pathInner = d3.select('.edition.inner');
                }
            } else {
                // first click
                // lineEdit = [];
                path = drawingLayer
                        .append('path')
                        .attr({'class': 'edition'});
                applyStyle(path, style.style, color);

                if (contour && !path.attr('stroke')) {
                    path.attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }

                if (mode === 'line') {
                    pathInner = drawingLayer
                                .append('path')
                                .attr({'class': 'edition inner'});
                    applyStyle(pathInner, style.styleInner, color);
                }
            }

            if (lastPoint) {
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }
            }

            lineEdit.push([x, y]);
            path.attr({
                d: generators.pathFunction[mode](lineEdit)
            });

            if (mode === 'line') {
                pathInner.attr({
                    d: generators.pathFunction[mode](lineEdit)
                });
            }
            applyStyle(path, style.style, color);

            if (contour && !path.attr('stroke')) {
                path.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            if (mode === 'line') {
                applyStyle(pathInner, style.styleInner, color);
            }
        }

        function drawHelpLineOrPolygon(x, y, style, color, contour, mode, lastPoint) {
            if (lastPoint) {
                var drawingLayer = d3.select(_svgDrawing).node().select('g[data-name="' + mode + 's-layer"]'),
                    line;

                if (d3.select('.ongoing')[0][0]) {
                    line = d3.select('.ongoing');
                } else {
                    line = drawingLayer
                        .append('line')
                        .attr({'class': 'ongoing'});
                    applyStyle(line, style.style, color);

                    if (contour && !line.attr('stroke')) {
                        line.attr('stroke', 'black')
                            .attr('stroke-width', '2');
                    }
                }
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }

                line.attr('x1', lastPoint.x)
                    .attr('y1', lastPoint.y)
                    .attr('x2', x)
                    .attr('y2', y);
            }
        }

        function finishLineOrPolygon(x, y, style, color, mode) {
            var iid = UtilService.getiid();
            
            RadialMenuService.addRadialMenu(d3.select('.edition'));

            if (mode === 'line') {
                d3.select('.edition.inner')
                    .classed('edition', false)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid);
            }

            d3.select('.edition').attr('e-style', style.id)
                .attr('e-color', color.color);

            d3.select('.edition')
                .classed('edition', false)
                .classed('link_' + iid, true)
                .attr('data-type', mode)
                .attr('data-link', iid);

            d3.select('.ongoing').remove();
            
        }

        // TODO: Fréd, ça sert à quoi ?
        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function writeText(x, y, font, color) {
            // the previously edited text should not be edited anymore
            d3.select('.edition').classed('edition', false);

            var d = 'Texte',
                iid = UtilService.getiid();

            d3.select(_svgDrawing).node().select('g[data-name="text-layer"]') // d3.select('#text-layer')
                .append('text')
                .attr('x', x)
                .attr('y', y - 35)
                .attr('font-family', font.family)
                .attr('font-size', font.size)
                .attr('font-weight', function() {
                    return font.weight;
                })
                .attr('fill', color.color)
                .attr('id', 'finalText')
                .classed('edition', true)
                .classed('link_' + iid, true)
                .attr('data-type', 'text')
                .attr('data-link', iid)
                .text('');

            d3.select(_svgDrawing).node().select('g[data-name="text-layer"]') // d3.select('#text-layer')
                .selectAll('foreignObject#textEdition')
                .data([d])
                .enter()
                .append('foreignObject')
                .attr('id', 'textEdition')
                .attr('x', x)
                .attr('y', y - 35)
                .attr('height', 500)
                .attr('width', 500)
                .attr('font-family', font.family)
                .attr('font-size', font.size)
                .attr('font-weight', function() {
                    return font.weight;
                })
                .attr('fill', color.color)
                .classed('edition', true)
                .append('xhtml:p')
                .attr('contentEditable', 'true')
                .text(d)
                .on('mousedown', function() {
                    d3.event.stopPropagation();
                })
                .on('keydown', function() {
                    d3.event.stopPropagation();

                    if (d3.event.keyCode === 13 && !d3.event.shiftKey) {
                        this.blur();
                    }
                })
                .on('blur', function() {
                    angular.forEach(this.childNodes, function(node) {
                        var data = node.data;

                        if (data) {
                            data = data.replace(/(\d+)/g, '¤$1');
                            d3.select('#finalText')
                                .attr('text-anchor', 'start')
                                .append('tspan')
                                .attr('text-anchor', 'start')
                                /*.attr('x', function() {
                                    return d3.select(this.parentNode).attr('x');
                                })*/
                                .attr('dy', 35)
                                .text(data);
                        }
                    });
                    d3.select(this.parentElement).remove();

                    RadialMenuService.addRadialMenu(d3.select('.edition'));

                    d3.select('.edition').classed('edition', false);
                    d3.select('#finalText').attr('id', null);
                });

            selectElementContents(
                d3.selectAll('foreignObject#textEdition')
                    .selectAll('p')
                    .node());

        }

        function changeTextColor(model) {
            model.fontColorChosen = model.fontColors[model.fontChosen.color][0];
        };

        function updateBackgroundStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('#svgContainer'), style, color)
        }

        function updateFeatureStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('.styleEdition'), style, color)
        }

        function updateStyleAndColor(path, style, color) {
            var currentStyleId = path.attr('e-style'),
                currentColorName = path.attr('e-color');

            if (style) {
                path.attr('e-style', style.id);
            } else {
                // no style, we just find the current style of the feature
                settings.STYLES.polygon.forEach(function (item, index, array) {
                    if (item.id === currentStyleId) {
                        style = item;
                    }
                })
            }

            if (color) {
                path.attr('e-color', color.color);
            } else {
                // no color, we just find the current color of the feature
                var arrayColors = settings.COLORS.black.concat(settings.COLORS.transparent.concat(settings.COLORS.other));

                arrayColors.forEach(function (item, index, array) {
                    if (item.color === currentColorName) {
                        color = item;
                    }
                })
                
            }

            applyStyle(path, style.style, color);
        };

        function updateMarker(markerStart, markerStop) {
            var path = d3.select('.styleEdition');

            if (markerStart) {
                path.attr('marker-start', 'url(#' + markerStart.id + ')');
            }

            if (markerStop) {
                path.attr('marker-end', 'url(#' + markerStop.id + ')');
            }
        };

        function applyStyle(path, style, colorChosen) {
            angular.forEach(style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    path.style('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    path.style(k, v);
                }
            });
        };

        /**
         * @ngdoc method
         * @name  featureIcon
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @param  {Object} item [description]
         * @param  {Object} type [description]
         * @return {string}      [description]
         */
        function featureIcon(item, type) {
            var iconSvg = document.createElement('svg'),
                iconContainer = d3.select(iconSvg)
                                .attr('height', 40).append('g'),
                symbol;

            switch(type) {
                case 'line':
                    symbol = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');

                    var symbolInner = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');
                        
                    angular.forEach(item.styleInner, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbolInner.attr(k, v);
                    });
                    break;

                case 'point':
                    symbol = iconContainer.append('path')
                            .attr('d', function() {
                                return item.path(20, 20, item.radius);
                            });
                    break;

                case 'polygon':
                case 'editpolygon':
                case 'circle':
                    symbol = iconContainer.append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('width', 250)
                                .attr('height', 30)
                                .attr('fill', 'red');
                    break;
            }

            angular.forEach(item.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            return (new XMLSerializer()).serializeToString(iconSvg);
        };

    }
    
    angular.module(moduleApp).service('ToolboxService', ToolboxService);

    ToolboxService.$inject = ['generators', 'RadialMenuService', 'settings', 'UtilService'];

})();