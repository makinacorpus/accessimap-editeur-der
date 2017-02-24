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

        this.calcSelectPath = calcSelectPath;
        this.addTo          = addTo;
        this.removeTo       = removeTo;

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

        function addTo(nodes) {
            nodes.style('cursor', 'crosshair')
                .on('mouseover', function(event) {
                    var feature = d3.select(this),
                        selectPath = calcSelectPath(feature);
                    feature.node().parentNode.appendChild(selectPath);
                })
                .on('mouseout', function(event) {
                    var feature = d3.select(this),
                        selectPath = d3.select(feature.node().parentNode)
                                       .selectAll('[data-type="select-path"]')
                                       .remove();
                })
        }

        function removeTo(nodes) {
            nodes.style('cursor', '')
                 .on('mouseover', function() {})
                 .on('mouseout', function() {})
                 .on('click', function() {})
        }

    }
    
    angular.module(moduleApp).service('SelectPathService', SelectPathService);

})();