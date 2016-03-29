'use strict';
/*global turf, osmtogeojson */

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:LocalmapCtrl
 * @requires accessimapEditeurDerApp.LocalmapService
 * @description
 * # LocalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('LocalmapCtrl',
        ['$scope', '$location', 'LocalmapService',
        function($scope, $location, LocalmapService) {
            
            /**
             * @ngdoc method
             * @name  hideMenu
             * @methodOf accessimapEditeurDerApp.controller:LocalmapCtrl
             * @description hide the left menu
             */
            $scope.hideMenu = function() {
                $scope.leftMenuVisible = false;
            };
            $scope.hideMenu();

            /**
             * @ngdoc method
             * @name  showMenu
             * @methodOf accessimapEditeurDerApp.controller:LocalmapCtrl
             * @description show the left menu
             */
            $scope.showMenu = function() {
                $scope.leftMenuVisible = true;
            };

            /**
             * @ngdoc property
             * @name rotationAngle
             * @propertyOf accessimapEditeurDerApp.controller:LocalmapCtrl
             * @type {Number}
             * @description rotation angle of the #map element
             */
            $scope.rotationAngle = 0;

            /**
             * @ngdoc method
             * @name  rotateMap
             * @methodOf accessimapEditeurDerApp.controller:LocalmapCtrl
             * @description rotate element of rotationAngle property
             */
            $scope.rotateMap = function() {
                LocalmapService.rotate($scope.rotationAngle);
            };

            $scope.checkboxModel = {
                contour: false,
                fill: false,
            };

            $scope.address      = {};
            
            $scope.geojson      = LocalmapService.geojson;
            
            $scope.queryChoices = LocalmapService.settings.QUERY_LIST;
            $scope.queryChosen  = $scope.queryChoices[0];
            
            $scope.styleChoices = LocalmapService.settings.STYLES[$scope.queryChosen.type];
            $scope.styleChosen  = $scope.styleChoices[0];
            
            $scope.changeStyle = function() {
                $scope.styleChoices = LocalmapService.settings.STYLES[$scope.queryChosen.type];
                $scope.styleChosen  = $scope.styleChoices[0];
            };

            $scope.colors       = (LocalmapService.settings.COLORS.transparent)
                                    .concat(LocalmapService.settings.COLORS.other);
            $scope.colorChosen  = $scope.colors[0];

            $scope.changeColor = function() {
                $scope.colorChosen  = this.$parent.colorChosen;
            };

            $scope.featureIcon      = LocalmapService.featureIcon;
            
            $scope.downloadData     = function(point) {
                LocalmapService.downloadData(point, $scope.queryChosen, $scope.styleChosen, $scope.styleChoices, $scope.colorChosen, $scope.checkboxModel, $scope.rotationAngle);
            };

            $scope.downloadPoi      = function() {
                LocalmapService.downloadPoi($scope.queryChosen, $scope.styleChosen, $scope.styleChoices, $scope.colorChosen, $scope.checkboxModel, $scope.rotationAngle);
            };
            
            $scope.simplifyFeatures = function(feature) {
                LocalmapService.simplifyFeatures(feature, $scope.queryChosen, $scope.styleChosen, $scope.styleChoices, $scope.colorChosen, $scope.checkboxModel, $scope.rotationAngle);
            };

            $scope.removeFeature    = LocalmapService.removeFeature;
            $scope.updateFeature    = LocalmapService.updateFeature;
            $scope.rotateFeature    = LocalmapService.rotateFeature;

            $scope.zoomOnPlace      = function(address) {
                LocalmapService.zoomOnPlace(address, $scope.styleChosen, $scope.colorChosen, $scope.checkboxModel, $scope.rotationAngle);
            };

            /**
             * @ngdoc method
             * @name  nextStep
             * @methodOf accessimapEditeurDerApp.controller:LocalmapCtrl
             * @description  Store the current map & legend, then go to '/commonmap'
             */
            $scope.nextStep = function() {
                LocalmapService.storeMapAndLegend()
                    .then(function() {
                        $location.path('/commonmap');
                    });
            };

            LocalmapService.init($location.search().mapFormat,
                                 $location.search().legendFormat);

        }, ]);
