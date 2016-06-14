/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxService(RadialMenuService, SettingsService, UtilService, 
            ToolboxTriangleService, ToolboxRectangleService, 
            ToolboxEllipseService, ToolboxTextService, ToolboxPolylineService) {

        this.init                          = init;
        
        this.addRadialMenus                = addRadialMenus;
        this.hideRadialMenu                = RadialMenuService.hideRadialMenu;
        
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
            RadialMenuService.init(svgMenu, getCurrentZoom);
            svgDrawing = _svgDrawing;

            ToolboxTriangleService.init(_svgDrawing, applyStyle)
            ToolboxRectangleService.init(_svgDrawing, applyStyle)
            ToolboxEllipseService.init(_svgDrawing, applyStyle)
            ToolboxPolylineService.init(_svgDrawing, applyStyle)
            ToolboxTextService.init(_svgDrawing, applyStyle)
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

            RadialMenuService.addRadialMenu(feature);
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
                    if (item.color === currentColorName) {
                        color = item;
                    }
                })
            }

            if (path.attr('data-type') === 'point') {
                var x = parseInt(path.attr('data-x')),
                    y = parseInt(path.attr('data-y'))
                path.attr('d', style.path(x,y,style.radius))
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
                    path.style('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    path.style(k, v);
                }
            })
            d3.select('.styleEdition')
                .classed('styleEdition', false)
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
                    symbol.attr('fill', SettingsService.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            return (new XMLSerializer()).serializeToString(iconSvg);
        };

    }
    
    angular.module(moduleApp).service('ToolboxService', ToolboxService);

    ToolboxService.$inject = ['RadialMenuService', 'SettingsService', 'UtilService',
                            'ToolboxTriangleService', 'ToolboxRectangleService', 'ToolboxEllipseService', 
                            'ToolboxTextService', 'ToolboxPolylineService'];

})();