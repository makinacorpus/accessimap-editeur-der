// jscs: disable maximumNumberOfLines
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.FeatureService
 * 
 * @description
 * Service providing actions to manage features
 * TODO: rename this service ? It's not clear about what it's doing
 */
(function() {
    'use strict';

    function FeatureService(InteractionService, EmptyComfortService, UtilService, 
                            GeometryUtilsService, GeneratorService) {
        
        this.duplicatePath                 = duplicatePath;
        this.movePath                      = movePath;
        this.movePoint                     = movePoint;
        this.rotatePath                    = rotatePath;
        this.skew                          = skew;
        
        this.removeObject                  = removeObject;

        this.undo                          = undo;
        this.isUndoAvailable               = isUndoAvailable;
        
        this.toggleStroke                  = toggleStroke;
        this.toggleArrow                   = toggleArrow;
        this.toggleEmptyComfortNearFeature = toggleEmptyComfortNearFeature;
        
        this.changeColor                   = changeColor;
        this.changePattern                 = changePattern;
        this.changePoint                   = changePoint;

        this.lineToCardinal                = lineToCardinal;
        
        this.init                          = init;
        
        // this var retain the last feature deleted
        // useful for cancel this deletion
        // TODO: need to be improved to integrate the history pattern (undo/redo)
        // Surely need a specific service for that
        var removedFeature = null,
            pointsLayer,
            polygonsLayer,
            linesLayer,
            textLayer,
            layer,
            projection,
            handlers;

        function init(_layer, _projection, _handlers) {
            layer         = _layer;
            projection    = _projection;
            handlers      = _handlers;
            
            pointsLayer   = layer.select('g[data-name="points-layer"]');
            polygonsLayer = layer.select('g[data-name="polygons-layer"]');
            linesLayer    = layer.select('g[data-name="lines-layer"]');
            textLayer     = layer.select('g[data-name="texts-layer"]');
        }

        function isUndoAvailable() {
            return removedFeature !== null;
        }

        function undo() {
            if (isUndoAvailable()) {
                
                var deletedElement = d3.select('#deletedElement').node(),
                    t = document.createElement('path');

                d3.select(t).attr('id', 'restoredElement');
                deletedElement.parentNode.insertBefore(t, deletedElement);
                d3.select('#restoredElement').node().outerHTML = removedFeature;
                d3.select('#deletedElement').remove();
                removedFeature = null;
            }
        }
        
        function removeFeature(feature) {
            var featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var el = featuresToUpdate.node(),
                t = document.createElement('foreignObject');

            removedFeature = new XMLSerializer().serializeToString(el),

            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            featuresToUpdate.remove();

        }

        function removeObject(feature) {

            // Some objects should not be deletable
            if (!d3.select(feature).node().classed('notDeletable')) {

                // Remove previous deleted Element placeholder if it exists
                d3.select('#deletedElement').remove();

                if (InteractionService.isFeatureInteractive(feature)) {
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        return removeFeature(feature);
                    } else {
                        return false;
                    }
                } else {
                    return removeFeature(feature);
                }

            }
        }

        function movePath(feature) {
            
            var el            = feature.node(),
            parentNode        = el.parentNode,
            temporaryPath     = el.cloneNode(true),

            emptyCircle       = d3.select('.c' + feature.attr('data-link')),
            emptyCircleExists = emptyCircle.node(),
            temporaryCircle   = emptyCircleExists ? emptyCircleExists.cloneNode(true) : null,

            transform         = d3.transform(layer.attr('transform')),
            hasRotate         = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform')),
            bbox              = el.getBBox();

            transform.translate = [0,0];

            d3.select(temporaryCircle).attr('opacity', 0.5).attr('transform', transform);
            d3.select(temporaryPath).attr('opacity', 0.5).attr('transform', transform);

            if (temporaryCircle) parentNode.appendChild(temporaryCircle);
            parentNode.appendChild(temporaryPath);

            handlers.removeEventListener(['click', 'mousemove']);

            handlers.addClickListener(function(e) {

                if (d3.select(temporaryPath).classed('moved')) {

                    var p = projection.latLngToLayerPoint(e.latlng),
                    realCoordinates = GeometryUtilsService.realCoordinates(transform, [p.x, p.y], bbox),
                    transformString = '';

                    if (hasRotate) {
                        transformString += 'rotate(' + [hasRotate[1], 
                                (parseFloat(hasRotate[2]) + realCoordinates[0]), 
                                (parseFloat(hasRotate[3]) + realCoordinates[1])] + ')';
                    }
                    transformString += 'translate(' + [realCoordinates[0], realCoordinates[1]] + ')';

                    feature.attr('transform', transformString);

                    if (emptyCircleExists) emptyCircle.attr('transform', transformString);

                    d3.select(temporaryPath).remove();
                    d3.select(temporaryCircle).remove();

                    handlers.removeEventListener(['click', 'mousemove']);

                }
            })

            handlers.addMouseMoveListener(function(e) {

                var p = projection.latLngToLayerPoint(e.latlng),
                    realCoordinates = GeometryUtilsService.realCoordinates(transform, [p.x, p.y], bbox),
                    transformString = '';

                if (hasRotate) {
                    transformString += 'rotate(' + [hasRotate[1], 
                        (parseFloat(hasRotate[2]) + realCoordinates[0]), 
                        (parseFloat(hasRotate[3]) + realCoordinates[1])] + ')';
                }
                transformString += 'translate(' + [realCoordinates[0], realCoordinates[1]] + ')';

                d3.select(temporaryPath)
                    .classed('moved', true)
                    .attr('transform', transformString);

                d3.select(temporaryCircle)
                    .classed('moved', true)
                    .attr('transform', transformString);

            })

        }

        function duplicatePath(feature, addRadialMenuFunction) {
            
            var el            = feature.node(),
            parentNode        = el.parentNode,
            temporaryPath     = el.cloneNode(true),

            emptyCircle       = d3.select('.c' + feature.attr('data-link')),
            emptyCircleExists = emptyCircle.node(),
            temporaryCircle   = emptyCircleExists ? emptyCircleExists.cloneNode(true) : null,

            transform         = d3.transform(layer.attr('transform')),
            hasRotate         = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform')),
            bbox              = el.getBBox(),
            iid               = UtilService.getiid();

            transform.translate = [0,0];

            d3.select(temporaryCircle)
                .attr('opacity', 0.5)
                .attr('transform', transform)
                .classed('c' + feature.attr('data-link'), false)
                .classed('link_' + feature.attr('data-link'), false)
                .classed('c' + iid, true)
                .classed('link_' + iid, true);

            d3.select(temporaryPath)
                .attr('opacity', 0.5)
                .attr('transform', transform)
                .classed('link_' + feature.attr('data-link'), false)
                .classed('link_' + iid, true)
                .attr('data-link', iid);

            if (temporaryCircle) parentNode.appendChild(temporaryCircle)
            parentNode.appendChild(temporaryPath)

            handlers.removeEventListener(['click', 'mousemove']);
            addRadialMenuFunction(d3.select(temporaryPath));

            handlers.addClickListener(function(e) {

                if (d3.select(temporaryPath).classed('moved')) {

                    var p = projection.latLngToLayerPoint(e.latlng),
                    realCoordinates = GeometryUtilsService.realCoordinates(transform, [p.x, p.y], bbox),
                    transformString = '';

                    if (hasRotate) {
                        transformString += 'rotate(' + [hasRotate[1], 
                                (parseFloat(hasRotate[2]) + realCoordinates[0]), 
                                (parseFloat(hasRotate[3]) + realCoordinates[1])] + ')';
                    }
                    transformString += 'translate(' + [realCoordinates[0], realCoordinates[1]] + ')';

                    d3.select(temporaryPath)
                        .classed('moved', false)
                        .attr('opacity', '')
                        .attr('transform', transformString);

                    d3.select(temporaryCircle)
                        .classed('moved', false)
                        .attr('opacity', '')
                        .attr('transform', transformString);

                    handlers.removeEventListener(['click', 'mousemove']);

                }
            })

            handlers.addMouseMoveListener(function(e) {

                var p = projection.latLngToLayerPoint(e.latlng),
                    realCoordinates = GeometryUtilsService.realCoordinates(transform, [p.x, p.y], bbox),
                    transformString = '';

                if (hasRotate) {
                    transformString += 'rotate(' + [hasRotate[1], 
                        (parseFloat(hasRotate[2]) + realCoordinates[0]), 
                        (parseFloat(hasRotate[3]) + realCoordinates[1])] + ')';
                }
                transformString += 'translate(' + [realCoordinates[0], realCoordinates[1]] + ')';

                d3.select(temporaryPath)
                    .classed('moved', true)
                    .attr('transform', transformString);

                d3.select(temporaryCircle)
                    .classed('moved', true)
                    .attr('transform', transformString);

            })

        }

        function movePoint(feature) {
            var el = feature.node(),
                pathData = el.getPathData(),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
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
                    pointsLayer
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
                nearest = GeometryUtilsService.nearest(d3.mouse(this), features);
            });

            drag.on('drag', function() {
                d3.event.sourceEvent.stopPropagation();
                var mousePosition = d3.mouse(this);
                d3.select(this).attr('cx', mousePosition[0])
                                .attr('cy', mousePosition[1]);

                var vertexNumber = parseInt(d3.select(this).attr('id').replace('n', ''));

                featuresToUpdate.each(function(d, i) {
                    var pathDataToUpdate = this.getPathData();
                    pathDataToUpdate[vertexNumber].values[0] = mousePosition[0];
                    pathDataToUpdate[vertexNumber].values[1] = mousePosition[1];
                    this.setPathData(pathDataToUpdate);
                });
            });
        }

        /**
         * @ngdoc method
         * @name  skew
         * @methodOf accessimapEditeurDerApp.FeatureService
         *
         * @description 
         * Enter into the skew mode for the feature selected.
         *
         * When user click and move his mouse, 
         * we detect the axis by analyzing first direction of the move,
         * then apply a skew linked by the distance from initial click and actual position of the mouse
         *
         * When user 'mouseup', we act the skew transformation is finished.
         * 
         * @param  {Object} feature
         * Feature on which the skew will operate
         * 
         */
        function skew(feature) {

            var el            = feature.node(),
            parentNode        = el.parentNode,
            temporaryPath     = el.cloneNode(true),
            
            emptyCircle       = d3.select('.c' + feature.attr('data-link')),
            emptyCircleExists = emptyCircle.node(),
            temporaryCircle   = emptyCircleExists ? emptyCircleExists.cloneNode(true) : null,
            
            transform         = d3.transform(layer.attr('transform')),
            // hasRotate         = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/.exec(feature.attr('transform')),
            bbox              = el.getBBox(),
            axis              = null,
            originalPoint     = { x: null, y: null }, 
            originalMove      = { x: 0, y: 0 },
            initialTransform  = feature.attr('transform') !== null ? feature.attr('transform') : '';

            transform.translate = [0,0];

            d3.select(temporaryCircle).attr('opacity', 0.5).attr('transform', transform);
            d3.select(temporaryPath).attr('opacity', 0.5).attr('transform', transform);

            if (temporaryCircle) parentNode.appendChild(temporaryCircle);
            parentNode.appendChild(temporaryPath);

            handlers.removeEventListener(['click', 'mousemove']);

            handlers.addClickListener(function(e) {

                if (d3.select(temporaryPath).classed('moved')) {

                    var transformString = d3.select(temporaryPath).attr('transform')
                    feature.attr('transform', transformString);

                    if (emptyCircleExists) emptyCircle.attr('transform', transformString);

                    d3.select(temporaryPath).remove();
                    d3.select(temporaryCircle).remove();

                    handlers.removeEventListener(['click', 'mousemove']);

                }
            })

            handlers.addMouseMoveListener(function(e) {

                var p = projection.latLngToLayerPoint(e.latlng),
                    // realCoordinates = GeometryUtilsService.realCoordinates(transform, [p.x, p.y], bbox),
                    transformString = initialTransform,
                    shiftKeyPressed = e.originalEvent.shiftKey,
                    transform = d3.svg.transform();

                originalPoint.x = originalPoint.x === null ? p.x : originalPoint.x;
                originalPoint.y = originalPoint.y === null ? p.y : originalPoint.y;

                originalMove.x = Math.abs(originalPoint.x - p.x)
                originalMove.y = Math.abs(originalPoint.y - p.y)


                // if (hasRotate) {
                //     transformString += 'rotate(' + [hasRotate[1], 
                //         (parseFloat(hasRotate[2]) + realCoordinates[0]), 
                //         (parseFloat(hasRotate[3]) + realCoordinates[1])] + ')';
                // }

                if (! shiftKeyPressed) {
                    transform.skewX(( p.x - originalPoint.x ) / 5)
                             .skewY(( p.y - originalPoint.y ) / 5)
                } else {
                    
                    if ( originalMove.x > 5 || originalMove.y > 5 ) {
                        axis = ( originalMove.x < originalMove.y ) ? 'Y' : 'X';
                    }

                    switch(axis) {
                        case 'X':
                            transform.skewX(( p.x - originalPoint.x ) / 5)
                            break;

                        case 'Y':
                            transform.skewY(( p.y - originalPoint.y ) / 5)
                            break;
                    }
                }

                d3.select(temporaryPath)
                    .classed('moved', true)
                    .attr('transform', initialTransform + transform());

                d3.select(temporaryCircle)
                    .classed('moved', true)
                    .attr('transform', initialTransform + transform());

            })

        }

        function rotatePath(feature) {
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

            rotationMarker = pointsLayer
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
                var mouse = d3.mouse(pointsLayer.node());
                initialAngle = GeometryUtilsService.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]);
            }).on('drag', function() {
                var mouse = d3.mouse(pointsLayer.node()),
                    currentAngle = GeometryUtilsService.angle(pathCenterTranslate[0], 
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
                pointsLayer.on('mousedown.drag', null);
                $('#der').css('cursor', 'auto');
            });
        }

        /**
         * @ngdoc method
         * @name  toggleStroke
         * @methodOf accessimapEditeurDerApp.FeatureService
         * @description 
         * Add or remove (toggle) the stroke (2px border) on a feature.
         * 
         * @param  {Object} feature 
         * Feature (shape) on which will be added the 'white area'
         */
        function toggleStroke(feature) {
            if (feature.attr('stroke')) {
                feature.attr('stroke', null)
                    .attr('stroke-width', null);
            } else {
                feature.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }
        }

        function toggleArrow(feature) {
            $('#changeArrowsModal').modal('show');
            feature.classed('styleEdition', true);
        }

        /**
         * @ngdoc method
         * @name  toggleEmptyComfortNearFeature
         * @methodOf accessimapEditeurDerApp.FeatureService
         * 
         * @description 
         * Add an empty (white) area around the feature shape.
         * 
         * @param  {Object} feature 
         * Feature (shape) on which will be added the 'white area'
         */
        function toggleEmptyComfortNearFeature(feature) {

            var emptyCircleExists = d3.select('.c' + feature.attr('data-link')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var emptyArea = EmptyComfortService.calcEmptyComfort(feature);

                feature.node().parentNode.insertBefore(emptyArea, feature.node());
            }
        }

        function changeColor(feature) {
            // TODO: init correctly value of modal dialog
            /*
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];
            */
            $('#changeColorModal').modal('show');
            feature.classed('styleEdition', true);
        }

        function changePattern(feature) {
            // TODO: init correctly value of modal dialog
            /* 
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];
            */
            $('#changePatternModal').modal('show');
            feature.classed('styleEdition', true);
        }

        function changePoint(feature) {
            $('#changePointModal').modal('show');
            feature.classed('styleEdition', true);
        }

        /**
         * @ngdoc method
         * @name  lineToCardinal
         * @methodOf accessimapEditeurDerApp.FeatureService
         *
         * @description 
         * Transform a line into a bezier curve ?
         * 
         * @param  {Object} feature
         * Path to 'simplify'
         * 
         */
        function lineToCardinal(feature) {
            var arr = feature.attr('d').split('L'),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = 
                    d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var coords = undefined;

            if (arr.length > 1) { // line's type is linear
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', GeneratorService.cardinalLineFunction(coords));
            }

            else { // line's type is cardinal
                arr = feature.attr('d').split(/[CQS]+/);
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    if (coordsArray.length > 2) {
                        var l = coordsArray.length;
                        coordsArray = [coordsArray[l - 2], coordsArray[l - 1]];
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', GeneratorService.lineFunction(coords));
            }
        }

    }

    angular.module(moduleApp).service('FeatureService', FeatureService);

    FeatureService.$inject = ['InteractionService', 'EmptyComfortService', 'UtilService', 
                                'GeometryUtilsService', 'GeneratorService']

})();