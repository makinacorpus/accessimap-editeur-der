/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EmptyConfortService
 * 
 * @description
 * 
 */
(function() {
    'use strict';

    function EmptyConfortService(SVGService, geometryutils) {

        this.calcEmptyComfort = calcEmptyComfort;

        /**
         * @ngdoc method
         * @name  calcEmptyComfort
         * @methodOf accessimapEditeurDerApp.EmptyConfortService
         *
         * @description 
         * Calculate the empty area around an element.
         * For a line path, we extend the path on the extremities,
         * For a text feature, we return a rect bigger than 7px of the original bounding box
         * 
         * @param  {Object} feature
         * d3 object
         * 
         * @return {DOMElement}
         * element to add to DOM representing the empty comfort
         */
        function calcEmptyComfort(feature) {

            var el = feature.node(),
                bbox = el.getBBox(),
                type = feature.attr('data-type'),
                emptyArea,
                path = feature.attr('d'),
                transformString = null || feature.attr('transform');

            switch (type) {
                case 'text':
                    var radius = Math.max(bbox.height, bbox.width) / 2 + 14;

                    emptyArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

                    d3.select(emptyArea)
                        .attr('x', bbox.x - 7)
                        .attr('y', bbox.y - 7)
                        .attr('width', bbox.width + 14)
                        .attr('height', bbox.height + 14)
                        .attr('fill', 'white');

                    break;

                default:
                    
                    emptyArea = el.cloneNode(true);

                    d3.select(emptyArea)
                        .attr('iid', null)
                        .attr('fill', 'none')
                        .attr('stroke', 'white')
                        .attr('style', '')
                        .attr('d', path)
                        .attr('stroke-width', '20');


                    if (type === 'line' || type === 'point')
                        d3.select(emptyArea)
                            .attr('stroke-linejoin', 'round')
                            .attr('stroke-linecap', 'round')

                    break;
            }

            d3.select(emptyArea)
                .attr('transform', transformString)
                .classed('c' + feature.attr('data-link'), true)
                .classed('link_' + feature.attr('data-link'), true)
                .classed('notDeletable', true);

            return emptyArea;

        }

    }
    
    angular.module(moduleApp).service('EmptyConfortService', EmptyConfortService);

    EmptyConfortService.$inject= ['SVGService', 'geometryutils'];

})();