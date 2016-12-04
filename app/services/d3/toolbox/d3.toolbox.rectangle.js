/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxRectangleService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxRectangleService(RadialMenuService, GeneratorService, UtilService) {

        this.init         = init;
        this.drawSquare   = drawSquare;
        this.updateSquare = updateSquare;

        var svgDrawing,
            applyStyle ;

        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        /**
         * @ngdoc method
         * @name  drawSquare
         * @methodOf accessimapEditeurDerApp.ToolboxRectangleService
         *
         * @description
         * Draw a square at specific coordinates
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
         * @param  {boolean} contour
         * If true add a shape to the circle
         *
         */
        function drawSquare(x, y, style, color, contour) {

            var feature;

            if (d3.select('.edition')[0][0]) { // second click
                feature = d3.select('.edition');

                var originX = parseFloat(feature.attr('data-origin-x')),
                    originY = parseFloat(feature.attr('data-origin-y')),
                    width = x - originX,
                    height = y - originY;

                if (width !== 0 && height !== 0) {

                    feature
                        .attr('data-origin-x', '')
                        .attr('data-origin-y', '')
                        .attr('e-style', style.id)
                        .attr('e-color', color.color)
                        .classed('edition', false)
                } else {
                    feature.remove()
                }

            } else { // first click
                var iid = UtilService.getiid();
                feature = svgDrawing.select('g[data-name="polygons-layer"]')
                    .append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('data-origin-x', x)
                    .attr('data-origin-y', y)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid)
                    .attr('data-type', 'rect')
                    .attr('data-from', 'drawing')
                    .classed('edition', true);

                applyStyle(feature, style.style, color);

                if (contour && !feature.attr('stroke')) {
                    feature
                        .attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }
            }
        }

        /**
         * @ngdoc method
         * @name  updateSquare
         * @methodOf accessimapEditeurDerApp.ToolboxRectangleService
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
        function updateSquare(x, y, shiftKeyPressed) {
            var feature = d3.select('.edition');

            if (feature[0][0]) {

                var originX = parseFloat(feature.attr('data-origin-x')),
                    originY = parseFloat(feature.attr('data-origin-y')),
                    width = Math.abs(x - originX),
                    height = Math.abs(y - originY),
                    newX = x < originX ? x : originX,
                    newY = y < originY ? y : originY;

                // if shift key, we draw a square, and not a rectangle
                // TODO: fix the coordinates
                if (shiftKeyPressed) {
                    if (width < height) {
                        width = height;
                        newY = y < originY ? originY - width : originY
                        newX = x < originX ? originX - height : originX

                    } else {
                        height = width;
                        newY = y < originY ? originY - width : originY
                        newX = x < originX ? originX - height : originX
                    }
                }

                feature.attr('width', width)
                       .attr('height', height)
                       .attr('x', newX)
                       .attr('y', newY)
            }
        }

    }

    angular.module(moduleApp).service('ToolboxRectangleService', ToolboxRectangleService);

    ToolboxRectangleService.$inject = ['RadialMenuService', 'GeneratorService', 'UtilService'];

})();
