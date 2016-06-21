/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SelectPathService
 * 
 * @description
 * Provide function to calculate the 'select path' of a feature
 * 
 */
(function() {
    'use strict';

    function SelectPathService() {

        this.calcSelectPath   = calcSelectPath;

        /**
         * @ngdoc method
         * @name  calcSelectPath
         * @methodOf accessimapEditeurDerApp.SelectPathService
         *
         * @description 
         * Calculate the select path around an element.
         * It's a rect identical of the bbox.
         * 
         * @param  {Object} feature
         * d3 object
         * 
         * @return {DOMElement}
         * element to add to DOM representing the empty comfort
         */
        function calcSelectPath(feature) {

            var el = feature.node(),
                bbox = el.getBBox(),
                type = feature.attr('data-type'),
                selectPath,
                path = feature.attr('d'),
                transformString = null || feature.attr('transform');

            selectPath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

            d3.select(selectPath)
                .attr('x', bbox.x)
                .attr('y', bbox.y)
                .attr('width', bbox.width)
                .attr('height', bbox.height)
                .attr('data-type', 'select-path')
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('stroke-width', '2')
                .attr('transform', transformString);

            return selectPath;

        }

    }
    
    angular.module(moduleApp).service('SelectPathService', SelectPathService);

})();