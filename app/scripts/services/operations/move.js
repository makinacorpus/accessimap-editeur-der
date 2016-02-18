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
                            var emptyCircle = d3.select('.c' + feature.attr('iid'));
                            var emptyCircleExists = emptyCircle.node();

                            var transformString = '';
                            var hasRotate = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform'));

                            if (hasRotate) {
                                transformString += 'rotate(' + [hasRotate[1], (parseFloat(hasRotate[2]) + transX), (parseFloat(hasRotate[3]) + transY)] + ')';
                            }
                            transformString += 'translate(' + [transX, transY] + ')';

                            feature.attr('transform', transformString);

                            if (emptyCircleExists) {
                                emptyCircle.attr('transform', transformString);
                            }

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
                        var transformString = '';
                        var hasRotate = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform'));

                        if (hasRotate) {
                            transformString += 'rotate(' + [hasRotate[1], (parseFloat(hasRotate[2]) + transX), (parseFloat(hasRotate[3]) + transY)] + ')';
                        }
                        transformString += 'translate(' + [transX, transY] + ')';

                        d3.select(temporaryPath)
                            .classed('moved', true)
                            .attr('transform', transformString);
                    });
            };

            this.movePoint = function(feature, scope) {
                var el = feature.node();
                //var pathSegList = el.pathSegList;
                var pathData = el.getPathData();

                console.log(el.getPathData())

                var featuresToUpdate = feature;
                if (feature.attr('data-link')) {
                    featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
                }

                // draw temporary node at all path breaks
                var features = [];

                var drag = d3.behavior.drag();

                angular.forEach(pathData, function(point, index) {
                        console.log(point)
                    var pointValues = point.values;
                    if (pointValues) {
                        var px = pointValues[0],
                            py = pointValues[1];
                        features.push([px, py, index]);
                        d3.select('#points-layer')
                            .append('circle')
                            .classed('ongoing', true)
                            .attr('id', 'n' + index)
                            .attr('cx', px)
                            .attr('cy', py)
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
                    featuresToUpdate.each(function(d, i) {
                        var pathDataToUpdate = this.getPathData();
                        pathDataToUpdate[vertexNumber].values[0] = mousePosition[0];
                        pathDataToUpdate[vertexNumber].values[1] = mousePosition[1];
                        this.setPathData(pathDataToUpdate)
                    });
                });

            };

            this.rotatePath = function(feature, scope) {
                var el = feature.node();
                var bbox = el.getBBox();
                var pathCenter = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
                var pathCenterTranslate = [];
                pathCenterTranslate[0] = pathCenter[0];
                pathCenterTranslate[1] = pathCenter[1];
                if (feature.attr('transform')) {
                    var pathHasTranslate = /translate\((.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform'));
                    if (pathHasTranslate) {
                        pathCenterTranslate[0] = pathCenter[0] + parseFloat(pathHasTranslate[1]);
                        pathCenterTranslate[1] = pathCenter[1] + parseFloat(pathHasTranslate[2]);
                    }
                }

                var drag = d3.behavior.drag();

                var rotationMarker = d3.select('#points-layer')
                    .append('g')
                    .classed('ongoing', true)
                    .attr('transform', 'translate(' + pathCenterTranslate[0] + ',' + (pathCenterTranslate[1] + bbox.height * 2) + ')')
                    .attr('pathCenter', pathCenter)
                    .attr('pathCenterTranslate', pathCenterTranslate)
                    .call(drag);

                rotationMarker.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 10)
                    .attr('fill', 'red')
                    .attr('stroke', 'none');
                rotationMarker.append('svg:image')
                    .attr('xlink:href', 'bower_components/material-design-icons/action/svg/production/ic_autorenew_48px.svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', -10)
                    .attr('y', -10);

                var initialAngle = 0;

                drag.on('dragstart', function() {
                    d3.event.sourceEvent.stopPropagation(); // silence other listeners
                    var mouse = d3.mouse(d3.select('#points-layer').node());
                    initialAngle = geometryutils.angle(pathCenterTranslate[0], pathCenterTranslate[1], mouse[0], mouse[1]);
                }).on('drag', function() {
                    var mouse = d3.mouse(d3.select('#points-layer').node());
                    var currentAngle = geometryutils.angle(pathCenterTranslate[0], pathCenterTranslate[1], mouse[0], mouse[1]);
                    var diffAngle = currentAngle - initialAngle;

                    var transformString = '';
                    var hasTranslate = /translate\((.*?)\)/.exec(feature.attr('transform'));

                    if (hasTranslate) {
                        transformString += hasTranslate[0];
                    }

                    transformString += 'rotate(' + diffAngle + ' ' + pathCenter[0] + ' ' + pathCenter[1] + ')';
                    feature.attr('transform', transformString);
                    rotationMarker.attr('transform', 'translate(' + mouse[0] + ',' + mouse[1] + ')');
                }).on('dragend', function() {
                    d3.select('#points-layer').on('mousedown.drag', null);
                    $('#der').css('cursor', 'auto');
                });
            };

    }]);
