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
        'shareSvg', 'svgicon', 'geometryutils', 'styleutils',
        function($rootScope, $scope, $location, settings, exportData, shareSvg, svgicon, geometryutils, styleutils) {
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

            $scope.filename = 'map';
            $scope.fonts = settings.FONTS;
            $scope.fontChosen = $scope.fonts[0];
            $scope.fontColors = settings.COLORS;
            $scope.fontColorChosen = $scope.fontColors[$scope.fontChosen.color][0];
            $scope.mode = 'default';
            $scope.styleChoices = [];
            $scope.styleChosen = $scope.styleChoices[0];
            $scope.deletedFeature = null;
            $scope.checkboxModel = {
                contour: false
            };

            $scope.colors = (settings.COLORS.transparent).concat(settings.COLORS.other);
            $scope.colorChosen = $scope.colors[0];

            $scope.featureIcon = svgicon.featureIcon;

            $scope.containerStyleChoices = settings.STYLES.polygon;
            $scope.containerStyle = $scope.containerStyleChoices[0];

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

            d3.select('svg').append('defs')
                    .append('marker')
                    .attr('id', 'midmarker')
                    .attr('refX', 2)
                    .attr('refY', 2)
                    .attr('markerWidth', 4)
                    .attr('markerHeight', 4)
                    .attr('orient', 'auto')
                .append('circle')
                    .attr('cx', '2')
                    .attr('cy', '2')
                    .attr('r', '2');


            $scope.changeTextColor = function() {
                    $scope.fontColorChosen = $scope.fontColors[$scope.fontChosen.color][0];
            };

            $scope.updatePolygonStyle = function() {
                    if ($scope.mode === 'editpolygon') {
                        var path = d3.select('.blink');
                        $scope.$watch($scope.styleChosen, function() {
                            styleutils.applyStyle(path, $scope.styleChosen.style, $scope.colorChosen);
                            if ($scope.checkboxModel.contour) {
                                path.attr('stroke', 'black')
                                    .attr('stroke-width', '2');
                            } else {
                                path.attr('stroke', null)
                                    .attr('stroke-width', null);
                            }
                        });
                    }
            };

            function resetActions() {
                d3.selectAll('path')
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
                $('#der').css('cursor', 'auto');
                d3.select('.ongoing').remove();
                d3.selectAll('.blink').classed('blink', false);
                d3.selectAll('.highlight').classed('highlight', false);
            }


            function selectElementContents(el) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
            }

            function deleteFeature(el) {
                $scope.$apply(function() {
                    $scope.deletedFeature = new XMLSerializer().serializeToString(el);
                });
                var t = document.createElement('foreignObject');
                d3.select(t).attr('id', 'deletedElement');
                el.parentNode.insertBefore(t, el);
                el.remove();
            }

            function deleteOnClick(el) {
                el.on('click', function() {
                    // Remove previous deleted Element placeholder if it exists
                    d3.select('#deletedElement').remove();

                    // Some objects should not be deletable
                    if (!d3.select(this).classed('notDeletable')) {
                        var iid = d3.select(this).attr('iid');

                        var featurePosition = $scope.interactiveFilters.data.filter(function(row) {
                            return row.id === 'poi-' + iid;
                        });
                        var featureInFilters = $scope.interactiveFilters.data.indexOf(featurePosition[0]);
                        if (featureInFilters > -1) {
                            if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                                $scope.removeRow($scope.interactiveFilters.data[featureInFilters]);
                                deleteFeature(this);
                            }
                        } else {
                            deleteFeature(this);
                        }
                    }
                });
            }

            $scope.$watch('mode', function() {
                if ($scope.mode === 'default') {
                    resetActions();
                }
                if ($scope.mode === 'delete') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    deleteOnClick(d3.selectAll('path'));
                    deleteOnClick(d3.selectAll('circle'));
                    deleteOnClick(d3.selectAll('text'));
                    deleteOnClick(d3.selectAll('rect'));
                    deleteOnClick(d3.selectAll('ellipse'));
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
                if ($scope.mode === 'move') {
                    resetActions();
                    d3.selectAll('path:not(.notDeletable)')
                        .attr('marker-mid', function() { return 'url(#midmarker)'; })
                        .on('click', function() {
                            d3.selectAll('.blink').classed('blink', false);
                            d3.select(this).classed('blink', true);
                            var _pathSegList = this.pathSegList;
                            d3.select('svg')
                                .on('click', function() {
                                    var features = [];
                                    angular.forEach(_pathSegList, function(point, index) {
                                            if (point.x && point.y) {
                                                features.push([point.x, point.y, index]);
                                            }
                                        });
                                    var clickPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
                                    var nearest = geometryutils.nearest(clickPoint, features);

                                    _pathSegList[nearest[2]].x = clickPoint[0];
                                    _pathSegList[nearest[2]].y = clickPoint[1];
                                });
                        });
                }

                if ($scope.mode === 'editpolygon') {
                    resetActions();
                    $scope.styleChoices = settings.STYLES.polygon;
                    $scope.styleChosen = $scope.styleChoices[0];
                    d3.selectAll('path:not(.notDeletable)')
                        .on('click', function() {
                            var path = d3.select(this);
                            var pathLastChar = path.attr('d').slice(-1);
                            if (pathLastChar === 'z' || pathLastChar === 'Z') {
                                d3.selectAll('.blink').classed('blink', false);
                                path.classed('blink', true);
                                if (path.attr('stroke')) {
                                    $scope.$apply(function() {
                                        $scope.checkboxModel.contour = true;
                                    });
                                } else {
                                    $scope.$apply(function() {
                                        $scope.checkboxModel.contour = false;
                                    });
                                }
                                var pathFill = path.attr('fill');
                                if (pathFill) {
                                    // $scope.colorChosen
                                    // $scope.styleChosen
                                    var pathFillName = pathFill.match(/\((.+?)\)/g)[0].slice(1, -1);
                                    var pathFillHasBackground = d3.select(pathFillName).select('rect').node();
                                    if (pathFillHasBackground) {
                                        $scope.$apply(function() {
                                            $scope.checkboxModel.fill = true;
                                        });
                                    } else {
                                        $scope.$apply(function() {
                                            $scope.checkboxModel.fill = false;
                                        });
                                    }
                                }
                            }
                        });
                }

                if ($scope.mode === 'interaction') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');

                    // Make the selected feature blink
                    d3.selectAll('path:not(.notDeletable)')
                        .on('click', function() {
                            d3.selectAll('.blink').classed('blink', false);
                            d3.selectAll('.highlight').classed('highlight', false);
                            var feature = d3.select(this);
                            feature.classed('blink', true);
                            var featureIid;
                            featureIid = feature.attr('iid');
                            if (!featureIid) {
                                featureIid = $rootScope.getiid();
                                feature.attr('iid', featureIid);
                            }
                            // Add the highlight class to the relevant cells of the grid
                            d3.selectAll('.poi-' + featureIid).classed('highlight', true);

                            var featurePosition = $scope.interactiveFilters.data.filter(function(row) {
                                return row.id === 'poi-' + featureIid;
                            });
                            var featureToAdd = $scope.interactiveFilters.data.indexOf(featurePosition[0]) < 0;

                            if (featureToAdd) {
                                $scope.$apply(function() {
                                    $scope.interactiveFilters.data.push({'id': 'poi-' + featureIid, 'f1': feature.attr('name'), 'deletable': true});
                                });
                            }

                        });
                }

                if ($scope.mode === 'point') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    $scope.styleChoices = settings.STYLES[$scope.mode];
                    $scope.styleChosen = $scope.styleChoices[0];
                    d3.select('svg')
                        .on('click', function() {
                            var coordinates = d3.mouse(this);
                            var feature = d3.select('svg')
                                .append('path')
                                .attr('d', $scope.styleChosen.path(coordinates[0], coordinates[1], $scope.styleChosen.radius))
                                .attr('iid', $rootScope.getiid());
                            styleutils.applyStyle(feature, $scope.styleChosen.style, $scope.colorChosen);
                     });
                }
                if ($scope.mode === 'circle') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    $scope.styleChoices = settings.STYLES.polygon;
                    $scope.styleChosen = $scope.styleChoices[0];
                    d3.select('svg')
                        .on('click', function() {
                            var coordinates = d3.mouse(this);
                            var feature;
                            if (d3.select('.edition')[0][0]) {
                                feature = d3.select('.edition');
                                var xOffset = coordinates[0] - feature.attr('cx');
                                var yOffset = coordinates[1] - feature.attr('cy');
                                var r = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                                feature.attr('r', r);
                                feature.classed('edition', false);
                            } else {
                                feature = d3.select('svg')
                                    .append('circle')
                                    .attr('cx', coordinates[0])
                                    .attr('cy', coordinates[1])
                                    .attr({'class': 'edition'});
                                styleutils.applyStyle(feature, $scope.styleChosen.style, $scope.colorChosen);

                                if ($scope.checkboxModel.contour && !feature.attr('stroke')) {
                                    feature
                                        .attr('stroke', 'black')
                                        .attr('stroke-width', '2');
                                }
                            }
                     })
                     .on('mousemove', function() {
                            var feature = d3.select('.edition');
                            if (feature[0][0]) {
                                var coordinates = d3.mouse(this);
                                var xOffset = coordinates[0] - feature.attr('cx');
                                var yOffset = coordinates[1] - feature.attr('cy');
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
                    var lineFunction = d3.svg.line()
                                                 .x(function(d) { return d[0]; })
                                                 .y(function(d) { return d[1]; })
                                                 .interpolate('linear');
                    d3.select('svg')
                        .on('click', function() {
                            var path;
                            var pathInner;
                            if (d3.select('.edition')[0][0]) {
                                path = d3.select('.edition');
                                if ($scope.mode === 'line') {
                                    pathInner = d3.select('.edition.inner');
                                }
                            } else {
                                lineEdit = [];
                                path = d3.select('svg')
                                    .append('path')
                                    .attr({'class': 'edition'});
                                styleutils.applyStyle(path, $scope.styleChosen.style, $scope.colorChosen);

                                if ($scope.checkboxModel.contour && !path.attr('stroke')) {
                                    path
                                        .attr('stroke', 'black')
                                        .attr('stroke-width', '2');
                                }

                                if ($scope.mode === 'line') {
                                    pathInner = d3.select('svg')
                                        .append('path')
                                        .attr({'class': 'edition inner'});
                                    styleutils.applyStyle(pathInner, $scope.styleChosen.styleInner, $scope.colorChosen);
                                }
                            }
                            var coordinates = d3.mouse(this);
                            lastPoint = coordinates;
                            lineEdit.push(coordinates);
                            path.attr({
                                d: lineFunction(lineEdit)
                            });

                            if ($scope.mode === 'line') {
                                pathInner.attr({
                                    d: lineFunction(lineEdit)
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
                        })
                        .on('dblclick', function() {
                            if ($scope.mode === 'polygon') {
                                var a = d3.select('.edition').attr('d');
                                a = a.replace(a.substr(a.lastIndexOf('L')), '');
                                d3.select('.edition').attr({
                                    d: a + 'Z'
                                });
                            }
                            d3.select('.edition').classed('edition', false);

                            if ($scope.mode === 'line') {
                                d3.select('.edition.inner').classed('edition', false);
                            }
                            d3.select('.ongoing').remove();
                            lastPoint = null;
                        })
                        .on('mousemove', function() {
                            if (lastPoint) {
                                var line;
                                if (d3.select('.ongoing')[0][0]) {
                                    line = d3.select('.ongoing');
                                } else {
                                    line = d3.select('svg')
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
                                line.attr('x1', lastPoint[0])
                                    .attr('y1', lastPoint[1])
                                    .attr('x2', coordinates[0])
                                    .attr('y2', coordinates[1]);
                            }
                        });
                }
                if ($scope.mode === 'addtext') {
                    resetActions();
                    $('#der').css('cursor', 'crosshair');
                    d3.select('svg')
                        .on('click', function() {
                            // the previously edited text should not be edited anymore
                            d3.select('.edition').classed('edition', false);
                            var coordinates = d3.mouse(this);
                            var d = 'Texte';
                            d3.select('svg')
                                .append('text')
                                .attr('x', coordinates[0])
                                .attr('y', coordinates[1] - 35)
                                .attr('font-family', $scope.fontChosen.family)
                                .attr('font-size', $scope.fontChosen.size)
                                .attr('font-weight', function() {
                                    return $scope.fontChosen.weight;
                                })
                                .attr('fill', $scope.fontColorChosen.color)
                                .attr({'class': 'edition'})
                                .text('');
                            d3.select('svg').selectAll('foreignObject')
                                .data([d])
                                .enter()
                                .append('foreignObject')
                                .attr('x', coordinates[0])
                                .attr('y', coordinates[1] - 35)
                                .attr('height', 500)
                                .attr('width', 500)
                                .attr('font-family', $scope.fontChosen.family)
                                .attr('font-size', $scope.fontChosen.size)
                                .attr('font-weight', function() {
                                    return $scope.fontChosen.weight;
                                })
                                .attr('fill', $scope.fontColorChosen.color)
                                .attr({'class': 'edition'})
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
                                            d3.select('.edition')
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
                                    // var bbox = d3.select('.edition')[0][0].getBBox();
                                    // d3.select('.edition')
                                    //       .append('rect')
                                    //       .attr('x', bbox.x)
                                    //       .attr('y', bbox.y)
                                    //       .attr('width', bbox.width)
                                    //       .attr('height', bbox.height);
                                    d3.select('.edition').classed('edition', false);
                                });

                                selectElementContents(d3.selectAll(this.getElementsByTagName('foreignObject')).selectAll('p').node());

                                $scope.$apply(function() {
                                    $scope.mode = 'default';
                                });
                                resetActions();
                            });
                }
            });

            $scope.mapExport = exportData.mapExport;
    }]);
