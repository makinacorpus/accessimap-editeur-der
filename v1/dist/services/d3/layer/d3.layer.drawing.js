/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerDrawingService
 * @requires accessimapEditeurDerApp.LayerService
 *
 * @description
 * Service providing drawing functions
 * Provide functions to
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function LayerDrawingService() {

        var _target,
            _g;

        this.createLayer = createLayer;
        this.appendImage = appendImage;
        this.appendSvg   = appendSvg;
        this.clean       = clean;

        function createLayer(target) {

            _target = target;

            _g = _target.attr("data-name", "drawing-layer")
                        .attr("id", "drawing-layer");

            createDrawing();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerDrawingService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayerDrawingService
         *
         * @param  {Object} target  [description]
         */
        function createDrawing() {
            _g.append('g').attr('data-name', 'images-layer');
            _g.append('g').attr('data-name', 'polygons-layer');
            _g.append('g').attr('data-name', 'lines-layer');
            _g.append('g').attr('data-name', 'points-layer');
            _g.append('g').attr('data-name', 'texts-layer');
        }

        function appendImage(dataUrl, size, pixelOrigin, pixelBoundMin) {

            var img = new Image();

            img.src = dataUrl;
            img.onload = function() { // need to load the image to obtain width & height
                var width = this.width,
                    height = this.height,
                    ratio = height / width,

                // calculate coordinates
                x =
                    // to get x, we calc the space between left and the overlay
                    ( ( size.x - width) / 2 )
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    - (pixelOrigin.x - pixelBoundMin.x),

                y =
                    // to get y, we calc the space between the middle axe and the top of the overlay
                    height / -2
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    - (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

                _g.select('[data-name="images-layer"]')
                    .append('image')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', width)
                    .attr('height', height)
                    .attr('xlink:href', dataUrl);

            };

        }

        function appendSvg(svgElement) {
            var children = svgElement.childNodes;

            for (var i = 0; i < children.length; i++) {
                if (children[i].localName === 'svg')
                    _g.select('[data-name="images-layer"]').node().appendChild(children[i])
            }
        }

        function clean() {
            _g.select('[data-name="images-layer"]').selectAll('*').remove()
            _g.select('[data-name="polygons-layer"]').selectAll('*').remove()
            _g.select('[data-name="lines-layer"]').selectAll('*').remove()
            _g.select('[data-name="points-layer"]').selectAll('*').remove()
            _g.select('[data-name="texts-layer"]').selectAll('*').remove()
        }
    }

    angular.module(moduleApp).service('LayerDrawingService', LayerDrawingService);

    LayerDrawingService.$inject = [];

})();
