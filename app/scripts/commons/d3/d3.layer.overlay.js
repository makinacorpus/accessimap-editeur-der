/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerOverlayService
 * 
 * @description
 * Service providing the management of overlay layer
 */
(function() {
    'use strict';

    function LayerOverlayService() {

        this.createLayer = createLayer;
        this.refresh     = refresh;
        this.draw        = draw;
        this.getCenter   = getCenter;

        var marginGroup,
            frameGroup,
            _width,
            _height,
            _margin,
            _target, 
            _projection,
            _lastTranslationX,
            _lastTranslationY;


        function createLayer(target, width, height, margin, projection) {
            _width      = width;
            _height     = height;
            _margin     = margin;
            _target     = target;
            _projection = projection;
            
            marginGroup = _target.append('g').attr('id', 'margin-layer')
            frameGroup  = _target.append('g').attr('id', 'frame-layer');

            createMarginPath();
            createFramePath();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createMarginPath
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
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
         */
        function createMarginPath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            marginGroup.selectAll("*").remove();

            marginGroup.append('path')
                .attr('d', function() {
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
                .attr('style', 'fill:#ffffff;')
                .attr('id', 'svgWhiteBorder')
                .classed('notDeletable', true);

            marginGroup.append('path')
                .attr('d', function() {
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
                .attr('style', 'fill:#bbb;fill-opacity:.5;')
                .classed('notDeletable', true);

        };

        function getCenter() {
            return _projection.layerPointToLatLng([( _width / 2 ) + _lastTranslationX, ( _height / 2 ) + _lastTranslationY]);
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

            frameGroup.selectAll("*").remove();

            frameGroup.append('path')
                .attr('d', function() {
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
                .attr('id', 'svgContainer')
                .classed('notDeletable', true);
        };

        function draw(width, height) {

            _width = width;
            _height = height;

            createMarginPath();
            createFramePath();

        }

        /**
         * re draw the overlay with translate & scale
         *
         * do not use simultaneously with refresh...
         * 
         * @param  {[type]} event      [description]
         * @param  {[type]} projection [description]
         * @return {[type]}            [description]
         */
        function onZoom(event, projection, transform) {

            marginGroup.attr("transform", transform)
            frameGroup.attr("transform", transform)

        }

        /**
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

            // marginGroup.attr("transform", "translate(" + (_x ) +"," + (_y ) + ")")
            // frameGroup.attr("transform", "translate(" + (_x ) +"," + (_y ) + ")")
            _target.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }

    }

    angular.module(moduleApp).service('LayerOverlayService', LayerOverlayService);

    LayerOverlayService.$inject = [];

})();