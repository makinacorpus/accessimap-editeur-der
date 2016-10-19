/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerOverlayService
 *
 * @description
 * Service providing the management of overlay layer
 */
(function() {
    'use strict';

    function LayerOverlayService(SettingsService) {

        this.createLayer     = createLayer;
        this.refresh         = refresh;
        this.draw            = draw;
        this.getCenter       = getCenter;
        this.getTranslation  = getTranslation;
        this.getSize         = getSize;
        this.setFormat       = setFormat;

        this.getFormat       = function() { return _format }
        this.getTranslationX = function() { return _lastTranslationX }
        this.getTranslationY = function() { return _lastTranslationY }

        var _marginGroup,
            _frameGroup,
            _format,
            _width,
            _height,
            _margin,
            _target,
            _projection,
            _lastTranslationX,
            _lastTranslationY,
            _framePath,
            _marginPath,
            _backgroundPath;


        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createLayer
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * create the overlay layer, with margin & frame groups
         *
         * @param  {Object} target
         * d3 area
         *
         * @param  {integer} width
         * Width of the d3 area
         *
         * @param  {integer} height
         * Height of the d3 area
         *
         * @param  {integer} margin
         * Margin wished
         *
         * @param  {function} projection
         * Projection function to use for conversion between GPS & layer point
         */
        function createLayer(target, format, projection) {
            _margin         = SettingsService.margin;
            _target         = target;
            _projection     = projection;

            _marginGroup    = _target.append('g').attr('id', 'margin-layer')
            _frameGroup     = _target.append('g').attr('id', 'frame-layer')

            _framePath      = _frameGroup.append('path')
            _marginPath     = _marginGroup.append('path')
            _backgroundPath = _marginGroup.append('path')

            setFormat(format)

        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createMarginPath
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * draw the margin path
         */
        function createMarginPath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            _marginPath.attr('d', function() {
                    var outer = 'M 0 0 L 0 '
                                    + _height
                                    + ' L '
                                    + _width
                                    + ' '
                                    + _height
                                    + ' L '
                                    + _width
                                    + ' 0 L 0 0 z ',
                        inner = 'M ' + _margin + ' ' + _margin + ' L '
                                    + w40
                                    + ' ' + _margin + ' L '
                                    + w40
                                    + ' '
                                    + h40
                                    + ' L ' + _margin + ' '
                                    + h40
                                    + ' L ' + _margin + ' ' + _margin + ' z';

                    return outer + inner;
                })
                .style('fill', '#ffffff')
                .style('pointer-events', 'none')
                .attr('id', 'svgWhiteBorder')
                .classed('notDeletable', true);

            _backgroundPath.attr('d', function() {
                    var outer = 'M -10000 -10000 L -10000 '
                                    + ( _height + 10000 )
                                    + ' L '
                                    + ( _width + 10000 )
                                    + ' '
                                    + ( _height + 10000 )
                                    + ' L '
                                    + ( _width + 10000 )
                                    + ' -10000 L -10000 -10000 z ',
                        inner = 'M 0 0 L '
                                    + _width
                                    + ' 0 L '
                                    + _width
                                    + ' '
                                    + _height
                                    + ' L ' + 0 + ' '
                                    + _height + ' z';

                    return outer + inner;
                })
                .style('pointer-events', 'none')
                .style('fill', '#bbb')
                .style('fill-opacity', '.5')
                .classed('notDeletable', true);

        };

        function getCenter() {
            return _projection.layerPointToLatLng([( _width / 2 ) + _lastTranslationX,
                                                    ( _height / 2 ) + _lastTranslationY]);
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
        function createFramePath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            _framePath.attr('d', function() {
                    return 'M ' + _margin + ' ' + _margin + ' L '
                                    + w40
                                    + ' ' + _margin + ' L '
                                    + w40
                                    + ' '
                                    + h40
                                    + ' L ' + _margin + ' '
                                    + h40
                                    + ' L ' + _margin + ' ' + _margin + ' z';
                })
                .attr('fill', 'none')
                .attr('opacity', '.75')
                .attr('stroke', '#000000')
                .attr('stroke-width', '2px')
                .attr('stroke-opacity', '1')
                .style('pointer-events', 'none')
                .classed('notDeletable', true)
        }

        /**
         * @ngdoc method
         * @name  draw
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * Draw margin & frame groups, id overlay.
         *
         * @param  {integer} width
         * Overlay's width
         *
         * @param  {integer} height
         * Overlay's height
         *
         */
        function draw() {

            createMarginPath();
            createFramePath();

        }

        function setFormat(format) {
            _format     = format;
            _width      = SettingsService.FORMATS[format].width / SettingsService.ratioPixelPoint;
            _height     = SettingsService.FORMATS[format].height / SettingsService.ratioPixelPoint;
            draw();
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

            _marginGroup.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
            _frameGroup.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }

        /**
         * @ngdoc method
         * @name  getTranslation
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * calc the translation of the margin-layer group (or frame-layer, it's the same)
         *
         * take in consideration the parent group
         *
         * @return {Object}
         * {x, y} representing the translation on x axis & y axis
         *
         */
        function getTranslation() {
            var translateScaleOverlayGroup = _target.attr('transform'),

                translateOverlayGroup = ( translateScaleOverlayGroup === null ) ? null
                    : translateScaleOverlayGroup.substring(translateScaleOverlayGroup.indexOf('(') + 1,
                                                            translateScaleOverlayGroup.indexOf(')')),

                translateOverlayGroupArray = ( translateOverlayGroup === null ) ? [0, 0]
                    : translateOverlayGroup.slice(0, translateOverlayGroup.length).split(','),

                translateOverlayArray = [ _lastTranslationX, _lastTranslationY ]

            return { x: ( parseInt(translateOverlayArray[0]) + parseInt(translateOverlayGroupArray[0]) ),
                     y: ( parseInt(translateOverlayArray[1]) + parseInt(translateOverlayGroupArray[1]) ) }
        }

        /**
         * @ngdoc method
         * @name  getSize
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @description
         * return the size of the layer, representing the size of the drawing
         *
         * @return {Object}
         * {width, height}
         *
         */
        function getSize() {
            return {width: _width, height: _height}
        }

    }

    angular.module(moduleApp).service('LayerOverlayService', LayerOverlayService);

    LayerOverlayService.$inject = ['SettingsService'];

})();
