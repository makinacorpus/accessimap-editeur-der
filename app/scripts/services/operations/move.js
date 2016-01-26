'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.move
 * @description
 * # move
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('move', ['geometryutils',
        function(geometryutils) {
            this.movePath = function(feature, scope) {
                var el = feature.node();
                var temporaryPath = el.cloneNode(true);
                var bbox = el.getBBox();
                d3.select(temporaryPath)
                    .attr('id', 'temporaryPath')
                    .attr('opacity', 0.5);
                d3.select('#points-layer').node().appendChild(temporaryPath);

                d3.select('svg')
                    .on('click', function() {
                        if (d3.select(temporaryPath).classed('moved')) {
                            var coordinates = d3.mouse(this);
                            var realCoordinates = geometryutils.realCoordinates(coordinates);
                            var transX = realCoordinates[0] - bbox.x,
                                transY = realCoordinates[1] - bbox.y;

                            feature.attr('transform', 'translate(' + [transX, transY] + ')');

                            d3.select('svg').on('click', null);
                            d3.select('svg').on('mousemove', null);

                            d3.select(temporaryPath).remove();
                        }
                    })
                    .on('mousemove', function() {
                        var coordinates = d3.mouse(this);
                        var realCoordinates = geometryutils.realCoordinates(coordinates);
                        var transX = realCoordinates[0] - bbox.x,
                            transY = realCoordinates[1] - bbox.y;

                        d3.select(temporaryPath)
                            .classed('moved', true)
                            .attr('transform', 'translate(' + [transX, transY] + ')');
                    });
            };

    }]);
