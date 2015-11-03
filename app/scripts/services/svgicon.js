'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.svgicon
 * @description
 * # svgicon
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('svgicon', ['settings', function(settings) {
        var featureIcon = function(item, type) {
            var iconSvg = document.createElement('svg');
            var iconContainer = d3.select(iconSvg).attr('height', 40).append('g');
            var symbol;
            if (type === 'line') {
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
                        var k = attribute.k;
                        var v = attribute.v;
                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbolInner.attr(k, v);
                    });
            }
            if (type === 'point') {
                symbol = iconContainer.append('path')
                        .attr('d', function() {
                            return item.path(20, 20, item.radius);
                        });
            }
            if (type === 'polygon' || type === 'editpolygon' || type === 'circle') {
                symbol = iconContainer.append('rect')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', 250)
                            .attr('height', 30)
                            .attr('fill', 'red');
            }

            angular.forEach(item.style, function(attribute) {
                var k = attribute.k;
                var v = attribute.v;
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

    }]);
