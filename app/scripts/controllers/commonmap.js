'use strict';

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @requires accessimapEditeurDerApp.CommonmapService
 * @requires accessimapEditeurDerApp.UtilService
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('CommonmapCtrl', ['$rootScope', '$scope', '$location', 'exportData',
        'shareSvg', 'svgicon', 'geometryutils', 'styleutils', 'radialMenu', 'generators', 'reset', 'CommonmapService', 'UtilService', 'toolbox',
        function($rootScope, $scope, $location, exportData, shareSvg, svgicon, geometryutils, styleutils, radialMenu, generators, reset, CommonmapService, UtilService, toolbox) {
            
            CommonmapService.init();

            $scope.model = {
                filename              : 'der',

                fonts                 : CommonmapService.settings.FONTS,
                fontColors            : CommonmapService.settings.COLORS,

                mode                  : 'default',

                styles                : CommonmapService.settings.STYLES,
                styleChoices          : [],

                markerStartChoices    : CommonmapService.settings.markerStart,
                markerStopChoices     : CommonmapService.settings.markerStop,

                deletedFeature        : null,
                checkboxModel         : {
                                        contour: false
                                        },
                
                colors                : (CommonmapService.settings.COLORS.transparent).concat(CommonmapService.settings.COLORS.other),
                
                containerStyleChoices : CommonmapService.settings.STYLES.polygon,

                rightMenuVisible      : false
                
            }

            $scope.model.fontChosen      = $scope.model.fonts[0];
            $scope.model.fontColorChosen = $scope.model.fontColors[$scope.model.fontChosen.color][0];
            $scope.model.styleChosen     = $scope.model.styleChoices[0];
            $scope.model.colorChosen     = $scope.model.colors[0];
            $scope.model.containerStyle  = $scope.model.containerStyleChoices[0];

            $scope.methods = {};

            /**
             * @ngdoc method
             * @name  resetView
             * @methodOf accessimapEditeurDerApp.controller:CommonmapCtrl
             * @description  reset the view to his initial state
             */
            $scope.methods.resetView = CommonmapService.resetView;

            $scope.methods.featureIcon = svgicon.featureIcon;

            $scope.methods.mapExport = exportData.mapExport;

            $scope.methods.changeContainerStyle = function(style) {
                angular.forEach(style.style, function(attribute) {
                    var k = attribute.k;
                    var v = attribute.v;
                    if (k === 'fill-pattern') {
                        d3.select('#svgContainer').attr('fill', CommonmapService.settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('#svgContainer').attr(k, v);
                    }
                });
            };

            $scope.methods.changeColor = function() {
                $scope.model.colorChosen = this.$parent.colorChosen;
                $scope.model.updatePolygonStyle();
            };

            $('#changeColorModal')
                .on('hidden.bs.modal', function() {
                    reset.resetActions();
                });

            $('#changePatternModal')
                .on('hidden.bs.modal', function() {
                    reset.resetActions();
                });

            $scope.methods.hideMenu = function() {
                $scope.model.rightMenuVisible = false;
            };
            $scope.methods.showMenu = function() {
                d3.selectAll('.highlight').classed('highlight', false);
                $scope.model.rightMenuVisible = true;
            };

            // Interactions part
            var cellTemplate = `<input 
                                    ng-if="row.entity.type === \'boolean\'" 
                                    type="checkbox" 
                                    value="{{row.entity[col.field]}}"
                                    ng-model="row.entity[col.field]">
                                <div ng-if="row.entity.type !== \'boolean\'">
                                    {{row.entity[col.field]}}
                                </div>`,

                removeTemplate = `<button 
                                    ng-if="row.entity.deletable" 
                                    class="btn btn-danger" 
                                    ng-click="grid.appScope.methods.removeRow(row.entity)">
                                    <i class="glyphicon glyphicon-remove"></i>
                                </button>`;

            var interactiveFiltersInit = 
                // TODO : put in settings service ?
                [{
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
                }],

                cellClassId = function(grid, row, col, rowRenderIndex) {
                    $scope.model.interactiveFilters.data[rowRenderIndex].id + ' highlight';
                },

                interactiveFiltersColumns = [
                    { name: 'id', enableCellEdit: false, enableHiding: false, cellClass: cellClassId},
                    { name: 'f0',
                        cellTemplate: cellTemplate,
                        menuItems: [
                            {
                                title: 'Supprimer cette colonne',
                                icon: 'ui-grid-icon-cancel',
                                action: function() {
                                    // var colName = this.context.col.name;
                                    deleteCol(this.context.col.name);
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
                                    // var colName = this.context.col.name;
                                    deleteCol(this.context.col.name);
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
                ],

                nextFilterNumber = 2;

            $scope.model.interactiveFilters = {
                data: interactiveFiltersInit,
                showSelectionCheckbox: true,
                enableSorting: false,
                enableRowSelection: true,
                columnDefs: interactiveFiltersColumns,
                onRegisterApi: function(gridApi) {
                    shareSvg.setInteractions(gridApi);
                }
            };

            var deleteCol = function(colName) {

                var columnToDelete = interactiveFiltersColumns.filter(function(col) {
                    return col.name === colName;
                });

                var index = interactiveFiltersColumns.indexOf(columnToDelete[0]);
                if (index > -1) {
                    interactiveFiltersColumns.splice(index, 1);
                }

                angular.forEach($scope.model.interactiveFilters.data, function(row) {
                    delete row[colName];
                });
            };

            $scope.methods.addFilter = function() {
                var filterPosition = interactiveFiltersColumns.length - 1;
                interactiveFiltersColumns.splice(filterPosition, 0, {
                    name: 'f' + nextFilterNumber,
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function() {
                                // var colName = this.context.col.name;
                                deleteCol(this.context.col.name);
                            }
                        }
                    ],
                    enableHiding: false, cellClass: cellClassId });
                nextFilterNumber += 1;
            };

            $scope.methods.removeRow = function(row) {
                var index = $scope.model.interactiveFilters.data.indexOf(row);
                if (index !== -1) {
                    $scope.model.interactiveFilters.data.splice(index, 1);
                }
            };

            $scope.methods.changeTextColor = function() {
                $scope.model.fontColorChosen = $scope.model.fontColors[$scope.model.fontChosen.color][0];
            };

            $scope.methods.updatePolygonStyle = function() {
                var path = d3.select('.styleEdition');
                path.attr('e-style', $scope.model.styleChosen.id)
                    .attr('e-color', $scope.model.colorChosen.color);
                $scope.$watch($scope.model.styleChosen, function() {
                    styleutils.applyStyle(path, $scope.model.styleChosen.style, $scope.model.colorChosen);
                });
            };

            $scope.methods.updateMarker = function() {
                var path = d3.select('.styleEdition');
                $scope.$watch($scope.model.markerStart, function() {
                    path.attr('marker-start', 'url(#' + $scope.model.markerStart.id + ')');
                });
                $scope.$watch($scope.model.markerStop, function() {
                    path.attr('marker-end', 'url(#' + $scope.model.markerStop.id + ')');
                });
            };

            function selectElementContents(el) {
                var range = document.createRange();
                range.selectNodeContents(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }

            $scope.$watch('model.mode', function() {
                
                reset.resetActions();

                switch($scope.model.mode) {

                    case 'default':
                        toolbox.addRadialMenus($scope.model);
                        break;
                    case 'undo':
                        toolbox.undo($scope.model);
                        break;
                    case 'point':
                        toolbox.enablePointMode($scope.model);
                        break;
                    case 'circle':
                        toolbox.enableCircleMode($scope.model);
                        break;
                    case 'line':
                    case 'polygon':
                        toolbox.enableLinePolygonMode($scope.model);
                        break;
                    case 'addtext':
                        toolbox.enableTextMode($scope.model);
                        break;
                }
                
            });

    }]);
