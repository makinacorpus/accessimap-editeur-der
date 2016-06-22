/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxImageService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxImageService(UtilService) {

        this.init               = init;

        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        /**
         * @ngdoc method
         * @name  importImage
         * @methodOf accessimapEditeurDerApp.ToolboxImageService
         *
         * @description
         * 
         * Import a local image in the DER
         * 
         */
        function importImage(x, y, style, color, contour) {

            var feature;

            if (d3.select('.edition')[0][0]) { // second click
                feature = d3.select('.edition');
                var xOffset = x - feature.attr('cx'),
                    yOffset = y - feature.attr('cy'),
                    r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2))

                if (r > 0) {
                    
                    // RadialMenuService.addRadialMenu(feature)

                    feature.attr('r', r)
                        .attr('e-style', style.id)
                        .attr('e-color', color.color)
                        .attr('data-origin-x', '')
                        .attr('data-origin-y', '')
                        .classed('edition', false)
                } else {
                    feature.remove()
                }

            } else { // first click
                var iid = UtilService.getiid();
                feature = svgDrawing.select('g[data-name="polygons-layer"]') 
                    .append('ellipse')
                    .attr('cx', x)
                    .attr('cy', y)
                    .classed('link_' + iid, true)
                    .attr('data-origin-x', x)
                    .attr('data-origin-y', y)
                    .attr('data-link', iid)
                    .attr('data-type', 'circle')
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
         * @name  updateCircleRadius
         * @methodOf accessimapEditeurDerApp.ToolboxImageService
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
        function updateCircleRadius(x, y, shiftKeyPressed) {
            var feature = d3.select('.edition');

            if (feature[0][0]) {

                var originX = parseFloat(feature.attr('data-origin-x')),
                    originY = parseFloat(feature.attr('data-origin-y')),
                    deltaX = x - originX,
                    deltaY = y - originY,
                    newX = originX + ( deltaX / 2 ),
                    newY = originY + ( deltaY / 2 ),

                    xOffset = Math.abs(x - originX),
                    yOffset = Math.abs(y - originY);

                // if shift key, we draw a circle, and not an ellipse
                if (shiftKeyPressed) {
                    if (xOffset < yOffset) {
                        xOffset = yOffset
                        newX = originX + ( Math.abs(deltaY) / 2 * ( x < originX ? -1 : 1 ) )
                    } else {
                        yOffset = xOffset;
                        newY = originY + ( Math.abs(deltaX) / 2 * ( y < originY ? -1 : 1 ) )
                    }
                }

                feature.attr('rx', xOffset / 2)
                       .attr('ry', yOffset / 2)
                       .attr('cx', newX)
                       .attr('cy', newY);
            }
        }

    }
    
    angular.module(moduleApp).service('ToolboxImageService', ToolboxImageService);

    ToolboxImageService.$inject = ['UtilService'];

})();