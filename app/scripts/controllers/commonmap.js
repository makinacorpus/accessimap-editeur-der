'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('CommonmapCtrl', ['$rootScope', '$scope', '$location', 'settings', 'exportData',
        'shareSvg', 'svgicon', 'geometryutils', 'styleutils', 'radialMenu', 'generators',
        function($rootScope, $scope, $location, settings, exportData, shareSvg, svgicon, geometryutils, styleutils, radialMenu, generators) {
            d3.select('#der')
                .selectAll('svg')
                .remove();
            shareSvg.getMap()
            .then(function(data) {
                if (data) {
                    $scope.data = data;
                    d3.select('#der')
                        .node()
                        .appendChild($scope.data);
                    d3.select('#der').select('svg').call(zoom).on('dblclick.zoom', null);
                } else {
                    $location.path('/');
                }
            });

            shareSvg.getLegend()
            .then(function(data) {
                if (data) {
                    d3.select('#der-legend')
                        .node()
                        .appendChild(data);
                }
            });

            $scope.filename = 'der';
            $scope.fonts = settings.FONTS;
            $scope.fontChosen = $scope.fonts[0];
            $scope.fontColors = settings.COLORS;
            $scope.fontColorChosen = $scope.fontColors[$scope.fontChosen.color][0];
            $scope.mode = 'default';
            $scope.styleChoices = [];
            $scope.styleChosen = $scope.styleChoices[0];
            $scope.markerStartChoices = settings.markerStart;
            $scope.markerStopChoices = settings.markerStop;
            $scope.deletedFeature = null;
            $scope.checkboxModel = {
                contour: false
            };

            $scope.colors = (settings.COLORS.transparent).concat(settings.COLORS.other);
            $scope.colorChosen = $scope.colors[0];

            $scope.featureIcon = svgicon.featureIcon;

            $scope.containerStyleChoices = settings.STYLES.polygon;
            $scope.containerStyle = $scope.containerStyleChoices[0];

            $scope.menu = null;

            $scope.changeContainerStyle = function(style) {
                angular.forEach(style.style, function(attribute) {
                    var k = attribute.k;
                    var v = attribute.v;
                    if (k === 'fill-pattern') {
                        d3.select('#svgContainer').attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('#svgContainer').attr(k, v);
                    }
                });
            };

            $scope.changeColor = function() {
                $scope.colorChosen = this.$parent.colorChosen;
                $scope.updatePolygonStyle();
            };

            $('#changeColorModal').on('hidden.bs.modal', function() {
                resetActions();
            });
            $('#changePatternModal').on('hidden.bs.modal', function() {
                resetActions();
            });

            $scope.rightMenuVisible = false;
            $scope.hideMenu = function() {
                $scope.rightMenuVisible = false;
            };

            $scope.showMenu = function() {
                d3.selectAll('.highlight').classed('highlight', false);
                $scope.rightMenuVisible = true;
            };

            $scope.interactiveFiltersInit = [{
                'id': 'name',
                'f0': 'Aucune interaction',
                'f1': 'Valeur OSM',
                'deletable': false
            }, {
                'id': 'Guidage',
                'f0': false,
                'f1': true,
                'type': 'boolean',
                'deletable': false
            }, {
                'id': 'title',
                'f0': 'Titre par défaut',
                'deletable': false
            }];

            var cellTemplate = '<input ng-if="row.entity.type === \'boolean\'" type="checkbox" value="{{row.entity[col.field]}}"';
            cellTemplate += 'ng-model="row.entity[col.field]">';
            cellTemplate += '<div ng-if="row.entity.type !== \'boolean\'">{{row.entity[col.field]}}</div>';

            var removeTemplate = '<button ng-if="row.entity.deletable" class="btn btn-danger" ng-click="grid.appScope.removeRow(row.entity)">';
            removeTemplate += '<i class="glyphicon glyphicon-remove"></i></button>';

            var cellClassId = function(grid, row, col, rowRenderIndex) {
                return $scope.interactiveFilters.data[rowRenderIndex].id + ' highlight';
            };

            function zoomed() {

                if ($scope.menu) {
                    $scope.menu.hide();
                    $scope.menu = null;
                }
                d3.selectAll('.ongoing').remove();
                d3.select('#map-layer').attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
            }

            var zoom = d3.behavior.zoom()
                .translate([0, 0])
                .scale(1)
                .scaleExtent([1, 8])
                .on('zoom', zoomed);

            function convertImgToBase64(tile) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = d3.select(tile).attr('href');
                img.onload = function() {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    var dataURL = canvas.toDataURL('image/png');
                    d3.select(tile).attr('href', dataURL);
                };
            }

            // Transform the images into base64 so they can be exported
            if (d3.select('.tiles').node()) {
                d3.select('.tiles').selectAll('image')[0].forEach(function(tile) {
                    convertImgToBase64(tile);
                });
            }

            $scope.deleteCol = function(colName) {
                // Remove the column from interactiveFiltersColumns
                var columnToDelete = interactiveFiltersColumns.filter(function(col) {
                    return col.name === colName;
                });
                var index = interactiveFiltersColumns.indexOf(columnToDelete[0]);
                if (index > -1) {
                    interactiveFiltersColumns.splice(index, 1);
                }
                // Remove the column from interactiveFiltersColumns
                angular.forEach($scope.interactiveFilters.data, function(row) {
                    delete row[colName];
                });
            };

            var interactiveFiltersColumns = [
                { name: 'id', enableCellEdit: false, enableHiding: false, cellClass: cellClassId},
                { name: 'f0',
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function() {
                                var colName = this.context.col.name;
                                $scope.deleteCol(colName);
                            }
                        }
                    ],
                    enableHiding: false, cellClass: cellClassId
                },
                { name: 'f1',
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function() {
                                var colName = this.context.col.name;
                                $scope.deleteCol(colName);
                            }
                        }
                    ],
                    enableHiding: false,
                    cellClass: cellClassId
                },
                {
                    field: 'remove',
                    displayName: '',
                    width: 40, cellTemplate:
                    removeTemplate,
                    enableCellEdit: false,
                    enableHiding: false,
                    cellClass: cellClassId
                }
            ];

            $scope.interactiveFilters = {
                data: $scope.interactiveFiltersInit,
                showSelectionCheckbox: true,
                enableSorting: false,
                enableRowSelection: true,
                columnDefs: interactiveFiltersColumns,
                onRegisterApi: function(gridApi) {
                    shareSvg.addInteractions(gridApi);
                }
            };

            $scope.nextFilterNumber = 2;

            $scope.addFilter = function() {
                var filterPosition = interactiveFiltersColumns.length - 1;
                interactiveFiltersColumns.splice(filterPosition, 0, {
                    name: 'f' + $scope.nextFilterNumber,
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function() {
                                var colName = this.context.col.name;
                                $scope.deleteCol(colName);
                            }
                        }
                    ],
                    enableHiding: false, cellClass: cellClassId });
                $scope.nextFilterNumber += 1;
            };

            $scope.removeRow = function(row) {
                var index = $scope.interactiveFilters.data.indexOf(row);
                if (index !== -1) {
                    $scope.interactiveFilters.data.splice(index, 1);
                }
            };

            $scope.changeTextColor = function() {
                $scope.fontColorChosen = $scope.fontColors[$scope.fontChosen.color][0];
            };

            $scope.updatePolygonStyle = function() {
                var path = d3.select('.styleEdition');
                $scope.$watch($scope.styleChosen, function() {
                    styleutils.applyStyle(path, $scope.styleChosen.style, $scope.colorChosen);
                });
            };

            $scope.updateMarker = function() {
                var path = d3.select('.styleEdition');
                $scope.$watch($scope.markerStart, function() {
                    path.attr('marker-start', 'url(#' + $scope.markerStart.id + ')');
                });
                $scope.$watch($scope.markerStop, function() {
                    path.attr('marker-end', 'url(#' + $scope.markerStop.id + ')');
                });
            };

            function resetActions() {
                d3.selectAll('path:not(.menu-segment)')
                    .on('click', function() {
                    });
                d3.selectAll('svg')
                    .on('click', function() {
                    });
                d3.select('body')
                    .on('keydown', function() {
                    });
                d3.selectAll('path')
                    .attr('marker-mid', null);
                //$('#der').css('cursor', 'auto');

                d3.selectAll('.ongoing').remove();

                d3.selectAll('.blink').classed('blink', false);
                d3.selectAll('.edition').classed('edition', false);
                d3.selectAll('.styleEdition').classed('styleEdition', false);
                d3.selectAll('.highlight').classed('highlight', false);
            }


            d3.select('body').on('keyup', function() {
                if (d3.event.keyCode === 27) {
                    resetActions();
                }
            });

            function selectElementContents(el) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
            }

            function addRadialMenu(el) {
                el.on('contextmenu', function() {
                    $scope.$apply(function() {
                        $scope.mode = 'default';
                    });
                    resetActions();
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    if ($scope.menu) {
                        $scope.menu.hide();
                    }
                    var mapLayer = d3.select('#der').select('svg');
                    $scope.menu = radialMenu.drawMenu(d3.select(this), d3.mouse(mapLayer.node()), $scope);
                });
            }

            $scope.$watch('mode', function() {
                if ($scope.mode === 'default') {
                    resetActions();
                    addRadialMenu(d3.selectAll('path:not(.notDeletable)'));
                    addRadialMenu(d3.selectAll('circle:not(.notDeletable)'));
                    addRadialMenu(d3.selectAll('text:not(.notDeletable)'));
                }

                if ($scope.mode === 'undo') {
                    resetActions();
                    if ($scope.deletedFeature) {
                        var deletedElement = d3.select('#deletedElement').node();
                        var t = document.createElement('path');
                        d3.select(t).attr('id', 'restoredElement');
                        deletedElement.parentNode.insertBefore(t, deletedElement);
                        d3.select('#restoredElement').node()
                            .outerHTML = $scope.deletedFeature;
                        d3.select('#deletedElement').remove();
                        $scope.deletedFeature = null;
                    }
                }

                if ($scope.mode === 'point') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    $scope.styleChoices = settings.STYLES[$scope.mode];
                    $scope.styleChosen = $scope.styleChoices[0];
                    d3.select('svg')
                        .on('click', function() {
                            if (!d3.event.defaultPrevented) {
                                var coordinates = d3.mouse(this);
                                var realCoordinates = geometryutils.realCoordinates(coordinates);
                                var iid = $rootScope.getiid();

                                var feature = d3.select('#points-layer')
                                    .append('path')
                                    .classed('link_' + iid, true)
                                    .attr('d', $scope.styleChosen.path(realCoordinates[0], realCoordinates[1], $scope.styleChosen.radius))
                                    .attr('data-link', iid);
                                styleutils.applyStyle(feature, $scope.styleChosen.style, $scope.colorChosen);
                            }
                     });
                }

                if ($scope.mode === 'circle') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    $scope.styleChoices = settings.STYLES.polygon;
                    $scope.styleChosen = $scope.styleChoices[0];
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
                                    feature.attr('r', r);
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


                                    styleutils.applyStyle(feature, $scope.styleChosen.style, $scope.colorChosen);

                                    if ($scope.checkboxModel.contour && !feature.attr('stroke')) {
                                        feature
                                            .attr('stroke', 'black')
                                            .attr('stroke-width', '2');
                                    }
                                }
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
                if ($scope.mode === 'line' || $scope.mode === 'polygon') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    $scope.styleChoices = settings.STYLES[$scope.mode];
                    $scope.styleChosen = $scope.styleChoices[0];
                    var lineEdit = [];
                    var lastPoint = null;
                    var drawingLayer;

                    if ($scope.mode === 'line') {
                        drawingLayer = d3.select('#lines-layer');
                    } else {
                        drawingLayer = d3.select('#polygons-layer');
                    }

                    d3.select('svg')
                        .on('click', function() {
                            // d3.event.detail is used to check is the click is not a double click
                            if (!d3.event.defaultPrevented && d3.event.detail !== 2) {
                                var path;
                                var pathInner;
                                if (d3.select('.edition')[0][0]) {
                                    path = d3.select('.edition');
                                    if ($scope.mode === 'line') {
                                        pathInner = d3.select('.edition.inner');
                                    }
                                } else {
                                    lineEdit = [];
                                    path = drawingLayer
                                        .append('path')
                                        .attr({'class': 'edition'});
                                    styleutils.applyStyle(path, $scope.styleChosen.style, $scope.colorChosen);

                                    if ($scope.checkboxModel.contour && !path.attr('stroke')) {
                                        path
                                            .attr('stroke', 'black')
                                            .attr('stroke-width', '2');
                                    }

                                    if ($scope.mode === 'line') {
                                        pathInner = drawingLayer
                                            .append('path')
                                            .attr({'class': 'edition inner'});
                                        styleutils.applyStyle(pathInner, $scope.styleChosen.styleInner, $scope.colorChosen);
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
                                    d: generators.pathFunction[$scope.mode](lineEdit)
                                });

                                if ($scope.mode === 'line') {
                                    pathInner.attr({
                                        d: generators.pathFunction[$scope.mode](lineEdit)
                                    });
                                }
                                styleutils.applyStyle(path, $scope.styleChosen.style, $scope.colorChosen);

                                if ($scope.checkboxModel.contour && !path.attr('stroke')) {
                                    path
                                        .attr('stroke', 'black')
                                        .attr('stroke-width', '2');
                                }

                                if ($scope.mode === 'line') {
                                    styleutils.applyStyle(pathInner, $scope.styleChosen.styleInner, $scope.colorChosen);
                                }
                            }
                        })
                        .on('dblclick', function() {
                            var iid = $rootScope.getiid();

                            if ($scope.mode === 'line') {
                                d3.select('.edition.inner')
                                    .classed('edition', false)
                                    .classed('link_' + iid, true)
                                    .attr('data-link', iid);
                            }

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
                                    styleutils.applyStyle(line, $scope.styleChosen.style, $scope.colorChosen);

                                    if ($scope.checkboxModel.contour && !line.attr('stroke')) {
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
                if ($scope.mode === 'addtext') {
                    resetActions();
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
                                .attr('font-family', $scope.fontChosen.family)
                                .attr('font-size', $scope.fontChosen.size)
                                .attr('font-weight', function() {
                                    return $scope.fontChosen.weight;
                                })
                                .attr('fill', $scope.fontColorChosen.color)
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
                                .attr('font-family', $scope.fontChosen.family)
                                .attr('font-size', $scope.fontChosen.size)
                                .attr('font-weight', function() {
                                    return $scope.fontChosen.weight;
                                })
                                .attr('fill', $scope.fontColorChosen.color)
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

                                    d3.select('.edition').classed('edition', false);
                                    d3.select('#finalText').attr('id', null);
                                });

                                selectElementContents(d3.selectAll('foreignObject#textEdition').selectAll('p').node());

                                $scope.$apply(function() {
                                    $scope.mode = 'default';
                                });
                                resetActions();
                        }
                    });
                }
            });

            $scope.mapExport = exportData.mapExport;
    }]);
