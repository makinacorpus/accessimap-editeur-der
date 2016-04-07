
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.move
 * @description
 * # move
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function move(geometryutils) {

        this.movePath = function(feature, scope) {
            var el = feature.node(),
                temporaryPath = el.cloneNode(true),
                bbox = el.getBBox();

            d3.select(temporaryPath)
                .attr('id', 'temporaryPath')
                .attr('opacity', 0.5);
            d3.select('#points-layer').node().appendChild(temporaryPath);

            d3.select('svg')
                .on('click', function() {
                    if (d3.select(temporaryPath).classed('moved')) {
                        var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select('#map-layer')
                                            .attr('transform')),
                            realCoordinates = 
                                geometryutils.realCoordinates(transform, coordinates),
                            transX = realCoordinates[0] - bbox.x,
                            transY = realCoordinates[1] - bbox.y,
                            emptyCircle = 
                                d3.select('.c' + feature.attr('data-link')),
                            emptyCircleExists = emptyCircle.node(),

                            transformString = '',
                            hasRotate = 
                                /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                                .exec(feature.attr('transform'));

                        if (hasRotate) {
                            transformString += 
                                'rotate(' + [hasRotate[1], 
                                    (parseFloat(hasRotate[2]) + transX), 
                                    (parseFloat(hasRotate[3]) + transY)] + ')';
                        }
                        transformString += 
                            'translate(' + [transX, transY] + ')';

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
                    var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select('#map-layer')
                                            .attr('transform')),
                        realCoordinates = 
                            geometryutils.realCoordinates(transform, coordinates),
                        transX = realCoordinates[0] - bbox.x,
                        transY = realCoordinates[1] - bbox.y,
                        transformString = '',
                        hasRotate = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                            .exec(feature.attr('transform'));

                    if (hasRotate) {
                        transformString += 'rotate(' 
                            + [hasRotate[1], 
                            (parseFloat(hasRotate[2]) + transX), 
                            (parseFloat(hasRotate[3]) + transY)] + ')';
                    }
                    transformString += 'translate(' + [transX, transY] + ')';

                    d3.select(temporaryPath)
                        .classed('moved', true)
                        .attr('transform', transformString);
                });
        };

        this.movePoint = function(feature, scope) {
            var el = feature.node(),
                pathData = el.getPathData(),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = 
                    d3.selectAll('.link_' + feature.attr('data-link'));
            }

            // draw temporary node at all path breaks
            var features = [],
                drag = d3.behavior.drag();

            angular.forEach(pathData, function(point, index) {
                var pointValues = point.values;

                if (pointValues && pointValues.length === 2) {
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
                // silence other listeners
                d3.event.sourceEvent.stopPropagation();
                nearest = geometryutils.nearest(d3.mouse(this), features);
            });

            drag.on('drag', function() {
                var mousePosition = d3.mouse(this);
                d3.select(this)
                    .attr('cx', mousePosition[0])
                    .attr('cy', mousePosition[1]);

                var vertexNumber = 
                    parseInt(d3.select(this).attr('id').replace('n', ''));
                featuresToUpdate.each(function(d, i) {
                    var pathDataToUpdate = this.getPathData();
                    pathDataToUpdate[vertexNumber].values[0] = mousePosition[0];
                    pathDataToUpdate[vertexNumber].values[1] = mousePosition[1];
                    this.setPathData(pathDataToUpdate);
                });
            });

        };

        this.rotatePath = function(feature, scope) {
            var el = feature.node(),
                bbox = el.getBBox(),
                pathCenter = [bbox.x + bbox.width / 2, 
                                bbox.y + bbox.height / 2],
                pathCenterTranslate = [],
                emptyCircle = d3.select('.c' + feature.attr('data-link')),
                emptyCircleExists = emptyCircle.node();
            pathCenterTranslate[0] = pathCenter[0];
            pathCenterTranslate[1] = pathCenter[1];

            if (feature.attr('transform')) {
                var pathHasTranslate = /translate\((.*?)(?: |,)(.*?)\)/
                                    .exec(feature.attr('transform'));

                if (pathHasTranslate) {
                    pathCenterTranslate[0] = pathCenter[0] 
                                        + parseFloat(pathHasTranslate[1]);
                    pathCenterTranslate[1] = pathCenter[1] 
                                        + parseFloat(pathHasTranslate[2]);
                }
            }

            var drag = d3.behavior.drag(),

            rotationMarker = d3.select('#points-layer')
                .append('g')
                .classed('ongoing', true)
                .attr('transform', 'translate(' 
                                    + pathCenterTranslate[0] 
                                    + ',' 
                                    + (pathCenterTranslate[1] 
                                    + bbox.height * 2) 
                                    + ')')
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
                .attr('xlink:href', 'assets/icons/autorenew.svg')
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', -10)
                .attr('y', -10);

            var initialAngle = 0;

            drag.on('dragstart', function() {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation(); 
                var mouse = d3.mouse(d3.select('#points-layer').node());
                initialAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]);
            }).on('drag', function() {
                var mouse = d3.mouse(d3.select('#points-layer').node()),
                    currentAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]),
                    diffAngle = currentAngle - initialAngle,

                    transformString = '',
                    hasTranslate = /translate\((.*?)\)/
                                    .exec(feature.attr('transform'));

                if (hasTranslate) {
                    transformString += hasTranslate[0];
                }

                transformString += 'rotate(' 
                                + diffAngle 
                                + ' ' 
                                + pathCenter[0] 
                                + ' ' 
                                + pathCenter[1] 
                                + ')';

                feature.attr('transform', transformString);

                if (emptyCircleExists) {
                    emptyCircle.attr('transform', transformString);
                }

                rotationMarker.attr('transform', 'translate(' 
                                                    + mouse[0] 
                                                    + ',' 
                                                    + mouse[1] 
                                                    + ')');
            }).on('dragend', function() {
                d3.select('#points-layer').on('mousedown.drag', null);
                $('#der').css('cursor', 'auto');
            });
        };

    }

    angular.module('accessimapEditeurDerApp')
        .service('move', move);

    move.$inject = ['geometryutils'];

})();