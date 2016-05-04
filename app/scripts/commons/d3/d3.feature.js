/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.FeatureService
 * 
 * @description
 * Service providing actions to manage features
 */
(function() {
    'use strict';

    function FeatureService(InteractionService, geometryutils, generators) {
        
        this.getType              = getType;
        this.movePath             = movePath;
        this.movePoint            = movePoint;
        this.rotatePath           = rotatePath;
        this.removeObject         = removeObject;
        this.undo                 = undo;
        this.isUndoAvailable      = isUndoAvailable;
        
        this.toggleStroke         = toggleStroke;
        this.toggleArrow          = toggleArrow;
        this.emptyNearFeature     = emptyNearFeature;
        this.textEmptyNearFeature = textEmptyNearFeature;
        this.changeColor          = changeColor;
        this.changePattern        = changePattern;
        this.lineToCardinal       = lineToCardinal;

        this.init                  = init;
        
        // this var retain the last feature deleted
        // useful for cancel this deletion
        // TODO: need to be improved to integrate the history pattern (undo/redo)
        var removedFeature        = null,
            pointsLayer,
            polygonsLayer,
            linesLayer,
            textLayer,
            svgDrawing;

        function init(_svgDrawing) {
            svgDrawing = _svgDrawing;
            pointsLayer   = d3.select(svgDrawing).node().select('g[data-name="points-layer"]');
            polygonsLayer = d3.select(svgDrawing).node().select('g[data-name="polygons-layer"]');
            linesLayer    = d3.select(svgDrawing).node().select('g[data-name="lines-layer"]');
            textLayer     = d3.select(svgDrawing).node().select('g[data-name="text-layer"]');
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
            // scope.updateView();

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
                    // var iid = d3.select(feature).node().attr('data-link'),
                    //     featurePosition = scope.interactiveFilters.data.filter(function(row) {
                    //         return row.id === 'poi-' + iid;
                    //     }),
                    //     featureInFilters = scope.interactiveFilters.data.indexOf(featurePosition[0]);
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        InteractionService.removeFeature(feature);
                        // scope.removeRow(scope.interactiveFilters.data[featureInFilters]);
                        return removeFeature(feature);
                    } else {
                        return false;
                    }
                } else {
                    return removeFeature(feature);
                }

            }
        }

        /**
         * @ngdoc method
         * @name  getType
         * @methodOf accessimapEditeurDerApp.FeatureService
         *
         * @description 
         * Return the type of a feature
         * 
         * @param  {Object} feature
         * Feature to be analyzed
         * 
         * @return {string}
         * Type in this set :
         * - point
         * - line
         * - polygon
         * - circle
         * - text
         * - null
         */
        function getType(feature) {
            var nodeType = feature.node().nodeName;

            switch (nodeType) {
                case 'path':
                    var parent = feature.node().parentNode;

                    if (d3.select(parent).classed('vector')) {
                        parent = parent.parentNode;
                    }
                    var parentId = parent.id;

                    switch (parentId) {
                        case 'points-layer':
                            return 'point';
                            break;

                        case 'lines-layer':
                            return 'line';
                            break;
                            
                        default:
                            return 'polygon';
                    }
                    break;

                case 'circle':
                    return 'circle';
                    break;

                case 'text':
                    return 'text';
                    break;

                default:
                    return null;
            }
        }

        function movePath(feature) {
            var el = feature.node(),
                temporaryPath = el.cloneNode(true),
                bbox = el.getBBox();

            d3.select(temporaryPath)
                .attr('id', 'temporaryPath')
                .attr('opacity', 0.5);
            pointsLayer.node().appendChild(temporaryPath);

            d3.select(svgDrawing)
                .on('click', function() {
                    
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

                    if (d3.select(temporaryPath).classed('moved')) {
                        var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select(svgDrawing)
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

                        d3.select(svgDrawing).on('click', null);
                        d3.select(svgDrawing).on('mousemove', null);

                        d3.select(temporaryPath).remove();
                    }
                })
                .on('mousemove', function() {
                    var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select(svgDrawing)
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
                nearest = geometryutils.nearest(d3.mouse(this), features);
            });

            drag.on('drag', function() {
                d3.event.sourceEvent.stopPropagation();
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
                initialAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]);
            }).on('drag', function() {
                var mouse = d3.mouse(pointsLayer.node()),
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
                pointsLayer.on('mousedown.drag', null);
                $('#der').css('cursor', 'auto');
            });
        };

        function toggleStroke(feature) {
            if (feature.attr('stroke')) {
                feature.attr('stroke', null)
                    .attr('stroke-width', null);
            } else {
                feature.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }
        };

        function toggleArrow(feature) {
            $('#changeArrowsModal').modal('show');
            feature.classed('styleEdition', true);
        };

        function emptyNearFeature(feature) {

            var emptyCircleExists = d3.select('.c' + feature.attr('data-link')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node(),
                    bbox = el.getBBox(),
                    transformString = null || feature.attr('transform'),
                    emptyArea = el.cloneNode(true),
                    bbox = el.getBBox();

                d3.select(emptyArea)
                    .classed('c' + feature.attr('data-link'), true)
                    .classed('notDeletable', true)
                    .attr('transform', transformString)
                    .attr('iid', null)
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .attr('stroke-width', '20');
                el.parentNode.insertBefore(emptyArea, el);
            }
        };

        function textEmptyNearFeature(feature) {

            var emptyCircleExists = d3.select('.c' + feature.attr('data-link')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node(),
                    bbox = el.getBBox(),
                    radius = Math.max(bbox.height, bbox.width) / 2 + 14,
                    rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    
                d3.select(rect)
                    .classed('c' + feature.attr('data-link'), true)
                    .classed('link_' + feature.attr('data-link'), true)
                    .classed('notDeletable', true)
                    .attr('x', bbox.x - 7)
                    .attr('y', bbox.y - 7)
                    .attr('width', bbox.width + 14)
                    .attr('height', bbox.height + 14)
                    .attr('fill', 'white');
                el.parentNode.insertBefore(rect, el);
            }
        };

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
        };

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
        };

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
                featuresToUpdate.attr('d', generators.cardinalLineFunction(coords));
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
                featuresToUpdate.attr('d', generators.lineFunction(coords));
            }
        };

    }

    angular.module(moduleApp)
        .service('FeatureService', FeatureService);

    FeatureService.$inject = ['InteractionService', 'geometryutils', 'generators']

})();