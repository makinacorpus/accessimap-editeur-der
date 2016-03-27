'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.toolbox
 * @description
 * Expose different methods to draw on the d3 svg area
 */
angular.module('accessimapEditeurDerApp')
    .service('toolbox', 
        ['geometryutils', 'styleutils', 'radialMenu', 'settings',
        function(geometryutils, styleutils, radialMenu, settings) {



    /**
     * @ngdoc method
     * @name  addRadialMenus
     * @methodOf accessimapEditeurDerApp.toolbox
     * @description
     * 
     * Add radial menus to d3 for differents elements :
     * - path
     * - circle
     * - text
     *
     * Then users can edit these shapes by right-clicking on it
     * 
     * @param {[type]} model [description]
     */
    this.addRadialMenus = function(model) {
        radialMenu.addRadialMenu(model, d3.selectAll('path:not(.notDeletable)'));
        radialMenu.addRadialMenu(model, d3.selectAll('circle:not(.notDeletable)'));
        radialMenu.addRadialMenu(model, d3.selectAll('text:not(.notDeletable)'));
    }

    this.undo = function(model) {
        if (model.deletedFeature) {
            var deletedElement = d3.select('#deletedElement').node();
            var t = document.createElement('path');
            d3.select(t).attr('id', 'restoredElement');
            deletedElement.parentNode.insertBefore(t, deletedElement);
            d3.select('#restoredElement').node()
                .outerHTML = model.deletedFeature;
            d3.select('#deletedElement').remove();
            model.deletedFeature = null;
        }
    }

    /**
     * @ngdoc method
     * @name  enablePointMode
     * @methodOf accessimapEditeurDerApp.toolbox
     * @description 
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    this.enablePointMode = function(model) {
        $('#der').css('cursor', 'crosshair');
        model.styleChoices = settings.STYLES[model.mode];
        model.styleChosen = model.styleChoices[0];
        d3.select('svg')
            .on('click', function() {
                if (!d3.event.defaultPrevented) {
                    var coordinates = d3.mouse(this);
                    var realCoordinates = geometryutils.realCoordinates(coordinates);
                    var iid = $rootScope.getiid();

                    var feature = d3.select('#points-layer')
                        .append('path')
                        .classed('link_' + iid, true)
                        .attr('d', model.styleChosen.path(realCoordinates[0], realCoordinates[1], model.styleChosen.radius))
                        .attr('data-link', iid);
                    styleutils.applyStyle(feature, model.styleChosen.style, model.colorChosen);
                    radialMenu.addRadialMenu(model, feature);
                }
            });
    }

    this.enableCircleMode = function(model) {
        $('#der').css('cursor', 'crosshair');
        model.styleChoices = settings.STYLES[model.mode];
        model.styleChosen = model.styleChoices[0];
        d3.select('svg')
            .on('click', function() {
                if (!d3.event.defaultPrevented) {
                    var coordinates = d3.mouse(this);
                    var realCoordinates = geometryutils.realCoordinates(coordinates);
                    var feature;
                    if (d3.select('.edition')[0][0]) { // second click
                        feature = d3.select('.edition');
                        var xOffset = realCoordinates[0] - feature.attr('cx');
                        var yOffset = realCoordinates[1] - feature.attr('cy');
                        var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                        feature.attr('r', r)
                            .attr('e-style', model.styleChosen.id)
                            .attr('e-color', model.colorChosen.color);
                        feature.classed('edition', false);
                    } else { // first click
                        var iid = $rootScope.getiid();
                        feature = d3.select('#polygons-layer')
                            .append('circle')
                            .attr('cx', realCoordinates[0])
                            .attr('cy', realCoordinates[1])
                            .classed('link_' + iid, true)
                            .attr('data-link', iid)
                            .classed('edition', true);


                        styleutils.applyStyle(feature, model.styleChosen.style, model.colorChosen);

                        if (model.checkboxModel.contour && !feature.attr('stroke')) {
                            feature
                                .attr('stroke', 'black')
                                .attr('stroke-width', '2');
                        }
                    }
                    radialMenu.addRadialMenu(model, feature);
                }
            })
            .on('mousemove', function() {
                var feature = d3.select('.edition');
                if (feature[0][0]) {
                    var coordinates = d3.mouse(this);
                    var realCoordinates = geometryutils.realCoordinates(coordinates);
                    var xOffset = realCoordinates[0] - feature.attr('cx');
                    var yOffset = realCoordinates[1] - feature.attr('cy');
                    var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                    feature.attr('r', r);
                }
            });
    }

    this.enableLinePolygonMode = function(model) {
        $('#der').css('cursor', 'crosshair');
        model.styleChoices = settings.STYLES[model.mode];
        model.styleChosen = model.styleChoices[0];
        var lineEdit = [];
        var lastPoint = null;
        var drawingLayer;

        if (model.mode === 'line') {
            drawingLayer = d3.select('#lines-layer');
        } else {
            drawingLayer = d3.select('#polygons-layer');
        }

        d3.select('svg')
            .on('click', function() {
                // d3.event.detail is used to check is the click is not a double click
                if (!d3.event.defaultPrevented 
                    && d3.event.detail !== 2) {
                    var path;
                    var pathInner;
                    if (d3.select('.edition')[0][0]) {
                        path = d3.select('.edition');
                        if (model.mode === 'line') {
                            pathInner = d3.select('.edition.inner');
                        }
                    } else {
                        lineEdit = [];
                        path = drawingLayer
                            .append('path')
                            .attr({'class': 'edition'});
                        styleutils.applyStyle(path, model.styleChosen.style, model.colorChosen);

                        if (model.checkboxModel.contour && !path.attr('stroke')) {
                            path
                                .attr('stroke', 'black')
                                .attr('stroke-width', '2');
                        }

                        if (model.mode === 'line') {
                            pathInner = drawingLayer
                                .append('path')
                                .attr({'class': 'edition inner'});
                            styleutils.applyStyle(pathInner, model.styleChosen.styleInner, model.colorChosen);
                        }
                    }
                    var coordinates = d3.mouse(this);

                    var realCoordinates = geometryutils.realCoordinates(coordinates);

                    if (lastPoint) {
                        var tanAngle = Math.abs((realCoordinates[1] - lastPoint[1]) / (realCoordinates[0] - lastPoint[0]));
                        var tan5 = Math.tan((5 * 2 * Math.PI) / 360);
                        var tan85 = Math.tan((85 * 2 * Math.PI) / 360);

                        // If the ctrlKey is pressed, draw horizontal or vertical lines with a tolerance of 5°
                        if (d3.event.ctrlKey && (tanAngle < tan5 || tanAngle > tan85)) {
                            if (tanAngle < tan5) {
                                realCoordinates[1] = lastPoint[1];
                            } else {
                                realCoordinates[0] = lastPoint[0];
                            }
                        }
                    }

                    lastPoint = realCoordinates;
                    lineEdit.push(realCoordinates);
                    path.attr({
                        d: generators.pathFunction[model.mode](lineEdit)
                    });

                    if (model.mode === 'line') {
                        pathInner.attr({
                            d: generators.pathFunction[model.mode](lineEdit)
                        });
                    }
                    styleutils.applyStyle(path, model.styleChosen.style, model.colorChosen);

                    if (model.checkboxModel.contour && !path.attr('stroke')) {
                        path
                            .attr('stroke', 'black')
                            .attr('stroke-width', '2');
                    }

                    if (model.mode === 'line') {
                        styleutils.applyStyle(pathInner, model.styleChosen.styleInner, model.colorChosen);
                    }
                }
            })
            .on('dblclick', function() {
                var iid = $rootScope.getiid();
                
                radialMenu.addRadialMenu(model, d3.select('.edition'));

                if (model.mode === 'line') {
                    d3.select('.edition.inner')
                        .classed('edition', false)
                        .classed('link_' + iid, true)
                        .attr('data-link', iid);
                }

                d3.select('.edition').attr('e-style', model.styleChosen.id)
                    .attr('e-color', model.colorChosen.color);

                d3.select('.edition')
                    .classed('edition', false)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid);

                d3.select('.ongoing').remove();
                lastPoint = null;
            })
            .on('mousemove', function() {
                if (lastPoint) {
                    var line;
                    if (d3.select('.ongoing')[0][0]) {
                        line = d3.select('.ongoing');
                    } else {
                        line = drawingLayer
                            .append('line')
                            .attr({'class': 'ongoing'});
                        styleutils.applyStyle(line, model.styleChosen.style, model.colorChosen);

                        if (model.checkboxModel.contour && !line.attr('stroke')) {
                            line
                                .attr('stroke', 'black')
                                .attr('stroke-width', '2');
                        }
                    }
                    var coordinates = d3.mouse(this);
                    var realCoordinates = geometryutils.realCoordinates(coordinates);
                    var tanAngle = Math.abs((realCoordinates[1] - lastPoint[1]) / (realCoordinates[0] - lastPoint[0]));
                    var tan5 = Math.tan((5 * 2 * Math.PI) / 360);
                    var tan85 = Math.tan((85 * 2 * Math.PI) / 360);

                    // If the ctrlKey is pressed, draw horizontal or vertical lines with a tolerance of 5°
                    if (d3.event.ctrlKey && (tanAngle < tan5 || tanAngle > tan85)) {
                        if (tanAngle < tan5) {
                            realCoordinates[1] = lastPoint[1];
                        } else {
                            realCoordinates[0] = lastPoint[0];
                        }
                    }

                    line.attr('x1', lastPoint[0])
                        .attr('y1', lastPoint[1])
                        .attr('x2', realCoordinates[0])
                        .attr('y2', realCoordinates[1]);
                }
            });
    }

    this.enableTextMode = function(model) {
        $('#der').css('cursor', 'crosshair');
        d3.select('svg').on('click', function() {
            if (!d3.event.defaultPrevented) {
                // the previously edited text should not be edited anymore
                d3.select('.edition').classed('edition', false);
                var coordinates = d3.mouse(this);
                var realCoordinates = geometryutils.realCoordinates(coordinates);
                var d = 'Texte';
                var iid = $rootScope.getiid();

                d3.select('#text-layer')
                    .append('text')
                    .attr('x', realCoordinates[0])
                    .attr('y', realCoordinates[1] - 35)
                    .attr('font-family', model.fontChosen.family)
                    .attr('font-size', model.fontChosen.size)
                    .attr('font-weight', function() {
                        return model.fontChosen.weight;
                    })
                    .attr('fill', model.fontColorChosen.color)
                    .attr('id', 'finalText')
                    .classed('edition', true)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid)
                    .text('');

                d3.select('#text-layer').selectAll('foreignObject#textEdition')
                    .data([d])
                    .enter()
                    .append('foreignObject')
                    .attr('id', 'textEdition')
                    .attr('x', realCoordinates[0])
                    .attr('y', realCoordinates[1] - 35)
                    .attr('height', 500)
                    .attr('width', 500)
                    .attr('font-family', model.fontChosen.family)
                    .attr('font-size', model.fontChosen.size)
                    .attr('font-weight', function() {
                        return model.fontChosen.weight;
                    })
                    .attr('fill', model.fontColorChosen.color)
                    .classed('edition', true)
                    .append('xhtml:p')
                    .attr('contentEditable', 'true')
                    .text(d)
                    .on('mousedown', function() {
                        d3.event.stopPropagation();
                    })
                    .on('keydown', function() {
                        d3.event.stopPropagation();
                        if (d3.event.keyCode === 13 && !d3.event.shiftKey) {
                            this.blur();
                        }
                    })
                    .on('blur', function() {
                        angular.forEach(this.childNodes, function(node) {
                            var data = node.data;
                            if (data) {
                                data = data.replace(/(\d+)/g, '¤$1');
                                d3.select('#finalText')
                                    .attr('text-anchor', 'start')
                                    .append('tspan')
                                    .attr('text-anchor', 'start')
                                    .attr('x', function() {
                                         return d3.select(this.parentNode).attr('x');
                                    })
                                    .attr('dy', 35)
                                    .text(data);
                            }
                        });
                        d3.select(this.parentElement).remove();
                        radialMenu.addRadialMenu(model, d3.select('.edition'));
                        d3.select('.edition').classed('edition', false);
                        d3.select('#finalText').attr('id', null);
                    });

                    selectElementContents(d3.selectAll('foreignObject#textEdition').selectAll('p').node());

                    $scope.$apply(function() {
                        model.mode = 'default';
                    });
                    reset.resetActions();
            }
        });
    }

  }]);


