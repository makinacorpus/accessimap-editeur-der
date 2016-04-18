/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LegendService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function LegendService() {

        this.initLegend = initLegend;
        this.addToLegend = addToLegend;
        this.removeFromLegend = removeFromLegend;

        var _width,
            _height,
            _margin,
            _ratioPixelPoint;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LegendService.initLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Create the legend svg in a dom element with specific size
         *
         * @param  {string} id     
         * id of element in which will be appended svg
         * 
         * @param  {integer} width  
         * width in millimeters of the svg created
         * 
         * @param  {integer} height 
         * height in millimeters of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         * @param  {integer} ratioPixelPoint 
         * ratioPixelPoint ? TODO please explain it...
         */
        function initLegend(id, width, height, margin, ratioPixelPoint) {
            
            _width = width;
            _height = height;
            _margin = margin;
            _ratioPixelPoint = ratioPixelPoint;
            
            return d3.select(id).append('svg')
                    .attr('width', _width + 'mm')
                    .attr('height', _height + 'mm')
                    .attr('viewBox', '0 0 ' 
                                + (_width / _ratioPixelPoint) 
                                + ' ' 
                                + (_height / _ratioPixelPoint))
                    .append('text')
                    .attr('x', function() {
                        return _margin;
                    })
                    .attr('y', function() {
                        return _margin * 2;
                    })
                    // .attr('class', 'braille')
                    // .attr('font-family', 'Braille_2007')
                    .attr('font-size', '35px')
                    .text(function() {
                        return 'Légende';
                    })
        }

        function addToLegend() {

        }

        function removeFromLegend() {

        }

    }

    angular.module(moduleApp).service('LegendService', LegendService);

    LegendService.$inject = [];

})();