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

            this.movePoint = function(feature, scope) {
                var el = feature.node();
                var pathSegList = el.pathSegList;

                // draw temporary node at all path breaks
                var features = [];

                var drag = d3.behavior.drag();

                angular.forEach(pathSegList, function(point, index) {
                    if (point.x && point.y) {
                        features.push([point.x, point.y, index]);
                        d3.select('#points-layer')
                            .append('circle')
                            .classed('tmpVertex', true)
                            .attr('id', 'n' + index)
                            .attr('cx', point.x)
                            .attr('cy', point.y)
                            .attr('r', 10)
                            .attr('fill', 'red')
                            .call(drag);
                    }
                });

                var nearest = null;

                drag.on('dragstart', function(e) {
                    d3.event.sourceEvent.stopPropagation(); // silence other listeners
                    nearest = geometryutils.nearest(d3.mouse(this), features);
                });

                drag.on('drag', function() {
                    var mousePosition = d3.mouse(this);
                    d3.select(this)
                        .attr('cx', mousePosition[0])
                        .attr('cy', mousePosition[1]);

                    var vertexNumber = parseInt(d3.select(this).attr('id').replace('n', ''));
                    pathSegList[vertexNumber].x = mousePosition[0];
                    pathSegList[vertexNumber].y = mousePosition[1];
                });


            };

    }]);
