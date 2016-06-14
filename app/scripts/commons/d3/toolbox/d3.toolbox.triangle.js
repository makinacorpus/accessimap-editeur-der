/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxTriangleService
 * 
 * @description
 * Service to draw a triangle
 */
(function() {
    'use strict';

    function ToolboxTriangleService(RadialMenuService, GeneratorService, UtilService) {

        this.drawTriangle   = drawTriangle;
        this.updateTriangle = updateTriangle;
        this.init           = init;

        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        /**
         * @ngdoc method
         * @name  drawCircle
         * @methodOf accessimapEditeurDerApp.ToolboxTriangleService
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
        function drawTriangle(x, y, style, color, contour) {

            var drawingLayer = svgDrawing.select('g[data-name="polygons-layer"]'),
                feature;

            if (d3.select('.edition')[0][0]) { 

                // second click
                feature = d3.select('.edition');
                feature.attr('e-style', style.id)
                    .attr('e-color', color.color)
                    .classed('edition', false)

            } else { 

                // first click
                var iid = UtilService.getiid(),
                feature = drawingLayer
                        .append('path')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('data-origin-x', x)
                        .attr('data-origin-y', y)
                        .classed('link_' + iid, true)
                        .attr('data-link', iid)
                        .attr('data-type', 'triangle')
                        .attr('data-from', 'drawing')
                        .classed('edition', true)

                applyStyle(feature, style.style, color);

                if (contour && !feature.attr('stroke')) {
                    feature.attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }
            }
        }

        /**
         * @ngdoc method
         * @name  updateCircleRadius
         * @methodOf accessimapEditeurDerApp.ToolboxTriangleService
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
         * @param  {boolean} shiftKeyPressed     
         * Whether or not the shift key is pressed
         * 
         */
        function updateTriangle(x, y, shiftKeyPressed) {
            var feature = d3.select('.edition');

            if (feature[0][0]) {

                var originX = parseFloat(feature.attr('data-origin-x')),
                    originY = parseFloat(feature.attr('data-origin-y')),
                    
                    width = Math.abs(x - originX),
                    height = Math.abs(y - originY),

                // calc the three points of the triangle
                    firstPoint  = [ x < originX ? x + width / 2 : originX + width / 2, y < originY ? y : originY ],
                    secondPoint = [ x < originX ? originX : x, y < originY ? originY : y ],
                    thirdPoint  = [ x < originX ? x : originX, y < originY ? originY : y ];

                feature.attr('d', GeneratorService.pathFunction.polygon([ firstPoint, secondPoint, thirdPoint ]))
            }
        }

    }
    
    angular.module(moduleApp).service('ToolboxTriangleService', ToolboxTriangleService);

    ToolboxTriangleService.$inject = ['RadialMenuService', 'GeneratorService', 'UtilService'];

})();