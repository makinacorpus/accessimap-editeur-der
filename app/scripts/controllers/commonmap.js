'use strict';

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:CommonmapCtrl
 * @requires accessimapEditeurDerApp.CommonmapService
 * @description
 * # CommonmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('CommonmapCtrl',
        ['$scope', 'CommonmapService',
        function ($scope, CommonmapService) {

            CommonmapService.init();

            $scope.model = {
                filename: 'der',

                fonts: CommonmapService.settings.FONTS,
                fontColors: CommonmapService.settings.COLORS,

                mode: 'default',

                styles: CommonmapService.settings.STYLES,
                styleChoices: [],

                markerStartChoices: CommonmapService.settings.markerStart,
                markerStopChoices: CommonmapService.settings.markerStop,

                deletedFeature: null,
                checkboxModel: {
                    contour: false,
                },

                colors: (CommonmapService.settings.COLORS.transparent)
                            .concat(CommonmapService.settings.COLORS.other),

                containerStyleChoices: CommonmapService.settings.STYLES.polygon,
                
                rightMenuVisible: false,
                
                interactiveFilters: CommonmapService.interactiveFilters
            };

            $scope.model.fontChosen      = $scope.model.fonts[0];
            $scope.model.fontColorChosen =
                $scope.model.fontColors[$scope.model.fontChosen.color][0];
            $scope.model.styleChosen     = $scope.model.styleChoices[0];
            $scope.model.colorChosen     = $scope.model.colors[0];
            $scope.model.containerStyle  = $scope.model.containerStyleChoices[0];

            $scope.methods = {};

            $scope.methods.resetView     = CommonmapService.resetView;
            $scope.methods.featureIcon   = CommonmapService.featureIcon;
            $scope.methods.mapExport     = CommonmapService.mapExport;
            
            // editor's part
            $scope.methods.changeContainerStyle = function (style) {
                angular.forEach(style.style, function (attribute) {
                    var k = attribute.k, v = attribute.v;

                    if (k === 'fill-pattern') {
                        d3.select('#svgContainer')
                            .attr('fill', CommonmapService.settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('#svgContainer').attr(k, v);
                    }
                });
            };

            $scope.methods.changeColor = function () {
                $scope.model.colorChosen = this.$parent.colorChosen;
                $scope.model.updatePolygonStyle();
            };

            $('#changeColorModal')
                .on('hidden.bs.modal', function () {
                    CommonmapService.resetActions();
                });

            $('#changePatternModal')
                .on('hidden.bs.modal', function () {
                    CommonmapService.resetActions();
                });

            $scope.methods.changeTextColor = function() {
                CommonmapService.changeTextColor($scope.model);
            }

            $scope.methods.updatePolygonStyle = function () {
                CommonmapService.updatePolygonStyle($scope.model);
            }

            $scope.methods.updateMarker = function () {
                CommonmapService.updateMarker($scope.model);
            }

            // interactions part
            $scope.methods.hideMenu = function () {
                $scope.model.rightMenuVisible = false;
            };
            $scope.methods.showMenu = function () {
                d3.selectAll('.highlight').classed('highlight', false);
                $scope.model.rightMenuVisible = true;
            };
            $scope.methods.addFilter = CommonmapService.addFilter;
            $scope.methods.removeRow = function(row) {
                CommonmapService.removeRow(row, $scope.model);
            }

            // switch of editor's mode
            // adapt user's interactions
            $scope.$watch('model.mode', function () {

                CommonmapService.resetActions();

                switch ($scope.model.mode) {

                    case 'default':
                        CommonmapService.addRadialMenus($scope.model);
                        break;

                    case 'undo':
                        CommonmapService.undo($scope.model);
                        break;

                    case 'point':
                        CommonmapService.enablePointMode($scope.model);
                        break;

                    case 'circle':
                        CommonmapService.enableCircleMode($scope.model);
                        break;

                    case 'line':
                    case 'polygon':
                        CommonmapService.enableLinePolygonMode($scope.model);
                        break;

                    case 'addtext':
                        CommonmapService.enableTextMode($scope.model);
                        break;
                }

            });

        },
        ]);
