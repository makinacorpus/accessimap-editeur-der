
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.svgicon
 * @requires  accessimapEditeurDerApp.settings
 * @description  Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function svgicon(settings) {

        /**
         * @ngdoc method
         * @name  featureIcon
         * @methodOf accessimapEditeurDerApp.svgicon
         *
         * @param  {Object} item [description]
         * @param  {Object} type [description]
         * @return {string}      [description]
         */
        var featureIcon = function(item, type) {
            var iconSvg = document.createElement('svg'),
                iconContainer = d3.select(iconSvg).attr('height', 40).append('g'),
                symbol;

            switch(type) {
                case 'line':
                    symbol = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');

                    var symbolInner = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');
                        
                    angular.forEach(item.styleInner, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbolInner.attr(k, v);
                    });
                    break;

                case 'point':
                    symbol = iconContainer.append('path')
                            .attr('d', function() {
                                return item.path(20, 20, item.radius);
                            });
                    break;

                case 'polygon':
                case 'editpolygon':
                case 'circle':
                    symbol = iconContainer.append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('width', 250)
                                .attr('height', 30)
                                .attr('fill', 'red');
                    break;
            }

            angular.forEach(item.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            return (new XMLSerializer()).serializeToString(iconSvg);
        };

        return {
            featureIcon: featureIcon
        };

    }
    
    angular.module('accessimapEditeurDerApp')
        .service('svgicon', svgicon);
    
    svgicon.$inject = ['settings'];
})();