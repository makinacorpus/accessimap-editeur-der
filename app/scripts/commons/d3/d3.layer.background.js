/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerBackgroundService
 * 
 * @description
 * Service providing the management of background layer
 */
(function() {
    'use strict';

    function LayerBackgroundService(settings) {

        this.createLayer = createLayer;
        this.append      = append;
        this.appendImage = appendImage;

        var _width,
            _height,
            _target, 
            _projection,
            _g;


        function createLayer(target, format, projection) {
            _width      = settings.FORMATS[format].width / settings.ratioPixelPoint;
            _height     = settings.FORMATS[format].height / settings.ratioPixelPoint;
            _target     = target;
            _projection = projection;
            
            _g = _target.attr("data-name", "background-layer")
                    .attr('id', 'background-layer')

        }

        function append(element) {
            _g.append(d3.select(element).node());
        }

        function appendImage(dataUrl, size, pixelOrigin, pixelBoundMin) {

            var ratioSvg = _height / _width,
                img = new Image();

            img.src = dataUrl;
            img.onload = function() { // need to load the image to obtain width & height
                var width = this.width,
                    height = this.height,
                    ratio = height / width,
                    w, 
                    h;

                if (ratio > ratioSvg) {
                    h = _height;
                    w = h / ratio;
                } else {
                    w = _width;
                    h = w * ratio;
                }

                // calculate coordinates
                var x = 
                    // to get x, we calc the space between left and the overlay
                    ( ( size.x - w) / 2 ) 
                    // and we substract the difference between the original point of the map 
                    // and the actual bounding topleft point
                    - (pixelOrigin.x - pixelBoundMin.x),

                y = 
                    // to get y, we calc the space between the middle axe and the top of the overlay
                    h / -2 
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    - (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

                _g.selectAll('*').remove();

                _g.append('image')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('xlink:href', dataUrl);

            };

        }

    }

    angular.module(moduleApp).service('LayerBackgroundService', LayerBackgroundService);

    LayerBackgroundService.$inject = ['settings'];

})();