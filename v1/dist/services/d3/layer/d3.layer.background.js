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
        this.setFormat   = setFormat;

        var _width,
            _height,
            _target,
            _projection,
            _g,
            _backgroundImage,
            _backgroundPath,
            _lastTranslationX,
            _lastTranslationY;


        function createLayer(target, format, projection) {
            _target     = target;
            _projection = projection;

            _g = _target.attr("data-name", "background-layer")
                        .attr('id', 'background-layer')
                        .append('g')

            _backgroundPath = _g.append('path')

            setFormat(format)

        }

        function append(element) {
            _g.append(d3.select(element).node());
        }

        function appendImage(dataUrl, size, pixelOrigin, pixelBoundMin) {

            var img = new Image();

            img.src = dataUrl;
            img.onload = function() { // need to load the image to obtain width & height
                _g.selectAll('image').remove();

                _backgroundImage = _g.append('image')
                    .attr('data-width', this.width)
                    .attr('data-height', this.height)
                    .attr('xlink:href', dataUrl);

                resizeBackgroundImage();

            };

        }

        function resizeBackgroundImage() {
            if (_backgroundImage) {
                var svgRatio = _height / _width,

                    imageWidth  = _backgroundImage.attr('data-width'),
                    imageHeight = _backgroundImage.attr('data-height'),
                    imageRatio  = imageHeight / imageWidth,

                    finalWidth, finalHeight;

                if (imageRatio > svgRatio) {
                    finalHeight = _height;
                    finalWidth = finalHeight / imageRatio;
                } else {
                    finalWidth = _width;
                    finalHeight = finalWidth * imageRatio;
                }

                // calculate coordinates
                var x = ( ( _width - finalWidth) / 2 ),
                    y = ( _height - finalHeight ) / 2 ;

                _backgroundImage
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', finalWidth)
                    .attr('height', finalHeight);
            }

        }

        /**
         * @ngdoc method
         * @name setFormat
         * @methodOf accessimapEditeurDerApp.LayerBackgroundService
         *
         * @description
         * Change the format of the current layer, and update the background Image if needed
         *
         * @param  {Object} format
         * Format of the drawing
         */
        function setFormat(format) {
            _width      = SettingsService.FORMATS[format].width / SettingsService.ratioPixelPoint;
            _height     = SettingsService.FORMATS[format].height / SettingsService.ratioPixelPoint;
            resizeBackgroundImage();
            resizePath();
        }

        /**
         * @ngdoc method
         * @name  createPath
         * @methodOf accessimapEditeurDerApp.LayerBackgroundService
         *
         * @description
         * Create an invisible path
         *
         * Could be useful later if user want a background pattern
         */
        function resizePath() {

            _backgroundPath.attr('d', function() {
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
