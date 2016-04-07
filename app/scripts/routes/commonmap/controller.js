/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:CommonmapController
 * @requires accessimapEditeurDerApp.CommonmapService
 * @requires $scope
 * @description
 * Controller of the accessimapEditeurDerApp
 */
(function() {
    'use strict';

    function CommonmapController($scope, CommonmapService) {

        var $ctrl = this;

        // model
        $ctrl.filename              = 'der';
        
        $ctrl.fonts                 = CommonmapService.settings.FONTS;
        $ctrl.fontChosen            = $ctrl.fonts[0];
        $ctrl.fontColors            = CommonmapService.settings.COLORS;
        $ctrl.fontColorChosen       = $ctrl.fontColors[$ctrl.fontChosen.color][0];
        
        $ctrl.mode                  = 'default';
        
        $ctrl.styles                = CommonmapService.settings.STYLES;
        $ctrl.styleChoices          = [];
        $ctrl.styleChosen           = $ctrl.styleChoices[0];
        
        $ctrl.markerStartChoices    = CommonmapService.settings.markerStart;
        $ctrl.markerStopChoices     = CommonmapService.settings.markerStop;
        
        $ctrl.deletedFeature        = null;
        $ctrl.checkboxModel         = { contour: false };
        
        $ctrl.colors                = (CommonmapService.settings.COLORS.transparent)
                                        .concat(CommonmapService.settings.COLORS.other);
        $ctrl.colorChosen           = $ctrl.colors[0];
        
        $ctrl.containerStyleChoices = CommonmapService.settings.STYLES.polygon;
        $ctrl.containerStyle        = $ctrl.containerStyleChoices[0];
        
        $ctrl.rightMenuVisible      = false;
        
        $ctrl.interactiveFilters    = CommonmapService.interactiveFilters;
        

        // methods
        $ctrl.addFilter            = CommonmapService.addFilter;
        $ctrl.changeColor          = changeColor;
        $ctrl.changeTextColor      = changeTextColor;
        $ctrl.changeContainerStyle = changeContainerStyle;
        $ctrl.enableEditionMode    = enableEditionMode;
        $ctrl.featureIcon          = CommonmapService.featureIcon;
        $ctrl.hideMenu             = hideMenu;
        $ctrl.mapExport            = CommonmapService.mapExport;
        $ctrl.removeRow            = removeRow;
        $ctrl.resetView            = CommonmapService.resetView;
        $ctrl.showMenu             = showMenu;
        $ctrl.updateMarker         = updateMarker;
        $ctrl.updatePolygonStyle   = updatePolygonStyle;

        // BAD THING !... but used in service...
        $ctrl.updateView = function() { $scope.$apply() };
        $ctrl.$apply = function(callback) { $scope.$apply(callback) }
        $ctrl.$watch = function(objectWatched, f) {
            $scope.$watch(objectWatched, f);
        }
        
        // editor's part
        function changeColor() {
            // $ctrl.colorChosen = $ctrl.$parent.colorChosen;
            $ctrl.updatePolygonStyle();
        };

        function changeContainerStyle() {
            var style = $ctrl.containerStyle;
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

        $('#changeColorModal')
            .on('hidden.bs.modal', function () {
                CommonmapService.resetActions();
            });

        $('#changePatternModal')
            .on('hidden.bs.modal', function () {
                CommonmapService.resetActions();
            });

        function changeTextColor() {
            CommonmapService.changeTextColor($ctrl);
        }

        function updatePolygonStyle() {
            CommonmapService.updatePolygonStyle($ctrl);
        }

        function updateMarker() {
            CommonmapService.updateMarker($ctrl);
        }

        // interactions part
        function hideMenu() {
            $ctrl.rightMenuVisible = false;
        }

        function showMenu() {
            d3.selectAll('.highlight').classed('highlight', false);
            $ctrl.rightMenuVisible = true;
        }

        function removeRow(row) {
            CommonmapService.removeRow(row, $ctrl);
        }

        // switch of editor's mode
        // adapt user's interactions
        function enableEditionMode(mode) {

            CommonmapService.resetActions();

            $ctrl.mode = mode;

            switch ($ctrl.mode) {

                case 'default':
                    CommonmapService.addRadialMenus($ctrl);
                    break;

                case 'undo':
                    CommonmapService.undo($ctrl);
                    break;

                case 'point':
                    CommonmapService.enablePointMode($ctrl);
                    break;

                case 'circle':
                    CommonmapService.enableCircleMode($ctrl);
                    break;

                case 'line':
                case 'polygon':
                    CommonmapService.enableLinePolygonMode($ctrl);
                    break;

                case 'addtext':
                    CommonmapService.enableTextMode($ctrl);
                    break;
            }

        }

        CommonmapService.init();
        enableEditionMode($ctrl.mode);

    }

    angular.module('accessimapEditeurDerApp')
            .controller('CommonmapController', CommonmapController);

    CommonmapController.$inject = ['$scope', 'CommonmapService'];

})();