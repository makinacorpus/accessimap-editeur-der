/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerBackgroundService
 *
 * @description
 * Service providing the management of background layer
 */
(function() {
    'use strict';

    function LayerBackgroundService(SettingsService) {

        this.createLayer = createLayer;
        this.append      = append;
        this.appendImage = appendImage;
        this.refresh     = refresh;

        var _width,
            _height,
            _target,
            _projection,
            _g,
            _lastTranslationX,
            _lastTranslationY;


        function createLayer(target, format, projection) {
            _width      = SettingsService.FORMATS[format].width / SettingsService.ratioPixelPoint;
            _height     = SettingsService.FORMATS[format].height / SettingsService.ratioPixelPoint;
            _target     = target;
            _projection = projection;

            _g = _target.attr("data-name", "background-layer")
                        .attr('id', 'background-layer')
                        .append('g')

            createPath()

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
                    ( ( _width - w) / 2 )
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    /*- (pixelOrigin.x - pixelBoundMin.x) */,

                y =
                    // to get y, we calc the space between the middle axe and the top of the overlay
                    ( h - _height ) / -2
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    /*- (pixelOrigin.y - pixelBoundMin.y - size.y / 2)*/;

                _g.selectAll('image').remove();

                _g.append('image')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('xlink:href', dataUrl);

            };

        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createFramePath
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @param  {Object} target
         * [description]
         *
         * @param  {integer} width
         * [description]
         *
         * @param  {integer} height
         * [description]
         */
        function createPath() {

            _g.append('path').attr('d', function() {
                    return 'M 0 0 L '
                                    + _width
                                    + ' 0 L '
                                    + _width
                                    + ' '
                                    + _height
                                    + ' L 0 '
                                    + _height
                                    + ' L 0 0 z';
                })
                .attr('id', 'background-path')
                .style('pointer-events', 'none')
                .style('fill', 'none')
                .classed('notDeletable', true)
        }

        /**
         * @ngdoc method
         * @name  refresh
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * Function moving the overlay svg, thanks to map movements...
         *
         * This function has to be used only if we want the overlay be 'fixed'
         *
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function refresh(size, pixelOrigin, pixelBoundMin) {
            // x,y are coordinates to position overlay
            // coordinates 0,0 are not the top left, but the point at the middle left
            _lastTranslationX =
                // to get x, we calc the space between left and the overlay
                ( ( size.x - _width) / 2 )
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                - (pixelOrigin.x - pixelBoundMin.x),

            _lastTranslationY =
                // to get y, we calc the space between the middle axe and the top of the overlay
                _height / -2
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                - (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

            _g.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }

    }

    angular.module(moduleApp).service('LayerBackgroundService', LayerBackgroundService);

    LayerBackgroundService.$inject = ['SettingsService'];

})();
