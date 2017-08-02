/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxService
 *
 * @description
 * Expose different methods to draw on the d3 svg area
 *
 * The toolbox is a set of 'drawing tools', giving the user the ability to draw some specific shapes :
 *
 * - points
 * - ellipses, circles
 * - rectangles, squares
 * - text
 * - lines
 * - polygons
 */
(function() {
    'use strict';

    function ToolboxService(RadialMenuService,
            SettingsService,
            UtilService,
            ToolboxTriangleService,
            ToolboxRectangleService,
            ToolboxEllipseService,
            ToolboxTextService,
            ToolboxPolylineService,
            ToolboxImageService,
            SelectPathService,
            HistoryService,
            $sce) {

        this.init                          = init;

        this.addContextMenus               = addContextMenus;
        this.hideContextMenus              = hideContextMenus;

        this.addSelectPaths                = addSelectPaths;
        this.hideSelectPaths               = hideSelectPaths;

        this.drawPoint                     = drawPoint;

        this.writeText                     = ToolboxTextService.writeText;

        this.beginLineOrPolygon            = ToolboxPolylineService.beginLineOrPolygon;
        this.drawHelpLineOrPolygon         = ToolboxPolylineService.drawHelpLineOrPolygon;
        this.finishLineOrPolygon           = ToolboxPolylineService.finishLineOrPolygon;

        this.drawCircle                    = ToolboxEllipseService.drawCircle;
        this.updateCircleRadius            = ToolboxEllipseService.updateCircleRadius;

        this.drawSquare                    = ToolboxRectangleService.drawSquare;
        this.updateSquare                  = ToolboxRectangleService.updateSquare;

        this.drawTriangle                  = ToolboxTriangleService.drawTriangle;
        this.updateTriangle                = ToolboxTriangleService.updateTriangle;

        this.changeTextColor               = changeTextColor;
        this.updateBackgroundStyleAndColor = updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = updateFeatureStyleAndColor;
        this.updateMarker                  = updateMarker;

        this.featureIcon                   = featureIcon;

        var svgDrawing;

        function init(_svgDrawing, svgMenu, getCurrentZoom) {
            console.log('init')
            RadialMenuService.init(d3.select(_svgDrawing.node().parentNode.parentNode), getCurrentZoom);
            svgDrawing = _svgDrawing;

            HistoryService.init(_svgDrawing)
            HistoryService.saveState()
            ToolboxTriangleService.init(_svgDrawing, applyStyle)
            ToolboxRectangleService.init(_svgDrawing, applyStyle)
            ToolboxEllipseService.init(_svgDrawing, applyStyle)
            ToolboxPolylineService.init(_svgDrawing, applyStyle)
            ToolboxTextService.init(_svgDrawing, applyStyle)
        }

        /**
         * @ngdoc method
         * @name  addContextMenus
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
        var selectors = [
            'path:not(.notDeletable)',
            'circle:not(.notDeletable)',
            'ellipse:not(.notDeletable)',
            'rect:not(.notDeletable)',
            'text:not(.notDeletable)',
            'image:not(.notDeletable)',
        ]

        function addContextMenus() {
            selectors.forEach(function(currentSelector, index, array) {
                RadialMenuService.addRadialMenu(d3.selectAll(currentSelector), svgDrawing);
            })
        }

        function hideContextMenus() {
            selectors.forEach(function(currentSelector, index, array) {
                d3.selectAll(currentSelector).on('contextmenu', function() {});
            })
        }

        function addSelectPaths(callbackProperties) {
            selectors.forEach(function(selector, index) {
                SelectPathService.addTo(d3.selectAll(selector), callbackProperties)
            })
        }

        function hideSelectPaths() {
            selectors.forEach(function(selector, index) {
                SelectPathService.removeTo(d3.selectAll(selector))
            })
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
         * SettingsService.STYLE of the point
         *
         * @param  {Object} color
         * SettingsService.COLOR of the point
         *
         */
        function drawPoint(x, y, style, color) {

            var iid = UtilService.getiid(),

                feature = svgDrawing
                    .select('g[data-name="points-layer"]')
                    .append('path')
                        .classed('link_' + iid, true)
                        .attr('d', style.path(x,y,style.radius))
                        .attr('data-x', x)
                        .attr('data-y', y)
                        .attr('data-link', iid)
                        .attr('data-type', 'point')
                        .attr('data-from', 'drawing');

            applyStyle(feature, style.style, color);

        }



        function changeTextColor(model) {
            model.fontColorChosen = model.fontColors[model.fontChosen.color][0];
        };

        function updateBackgroundStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('#background-path'), style, color)
        }

        function updateFeatureStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('.styleEdition'), style, color)
        }

        function updateStyleAndColor(path, style, color) {
            var currentStyleId = path.attr('e-style') || SettingsService.DEFAULT_STYLE.id,
                currentColor = path.attr('e-color') || SettingsService.DEFAULT_COLOR.color;

            if (style) {
                path.attr('e-style', style.id);
            } else {
                // no style, we just find the current style of the feature
                SettingsService.ALL_STYLES.forEach(function (item, index, array) {
                    if (item.id === currentStyleId) {
                        style = item;
                    }
                })
            }

            if (color) {
                path.attr('e-color', color.color);
            } else {
                // no color, we just find the current color of the feature
                SettingsService.ALL_COLORS.forEach(function (item, index, array) {
                    if (item.color === currentColor) {
                        color = item;
                    }
                })
            }

            if (path.attr('data-type') === 'point') {
                var x = parseInt(path.attr('data-x')),
                    y = parseInt(path.attr('data-y'))
                path.attr('d', style.path(x,y,style.radius))
            }

            if (style && color) {
                applyStyle(path, style.style, color);
            }
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

                path.style('stroke-opacity', 1);
                path.style('fill-opacity', 1);

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    path.style('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    path.style(k, v);
                }
            })
            setTimeout(function() {
                HistoryService.saveState();
            }, 200);
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

                default:
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
                    symbol.style('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    symbol.style(k, v);
                }
            });

            return $sce.trustAsHtml((new XMLSerializer()).serializeToString(iconSvg));

        };

    }

    angular.module(moduleApp).service('ToolboxService', ToolboxService);

    ToolboxService.$inject = ['RadialMenuService', 'SettingsService', 'UtilService',
                            'ToolboxTriangleService',
                            'ToolboxRectangleService',
                            'ToolboxEllipseService',
                            'ToolboxTextService',
                            'ToolboxPolylineService',
                            'ToolboxImageService',
                            'SelectPathService',
                            'HistoryService',
                            '$sce'];

})();
