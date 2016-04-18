/*global turf, osmtogeojson */

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:LocalmapController
 * @requires accessimapEditeurDerApp.LocalmapService
 * @description
 * # LocalmapController
 * Controller of the accessimapEditeurDerApp
 */
(function() {
    'use strict';

    function LocalmapController($location, LocalmapService) {
        
        var $ctrl = this;

        /**
         * @ngdoc method
         * @name  hideAside
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description hide the left Aside
         */
        $ctrl.hideAside = function() {
            $ctrl.isAsideVisible = false;
        };

        /**
         * @ngdoc method
         * @name  showAside
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description show the left Aside
         */
        $ctrl.showAside = function() {
            $ctrl.isAsideVisible = true;
        };
        $ctrl.showAside();

        /**
         * @ngdoc method
         * @name  showMap
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description hide the left Aside
         */
        $ctrl.showMap = function() {
            $ctrl.isMapVisible = true;
            $ctrl.isLegendVisible = false;
        };
        $ctrl.showMap();

        /**
         * @ngdoc method
         * @name  showLegend
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description show the left Aside
         */
        $ctrl.showLegend = function() {
            $ctrl.isMapVisible = false;
            $ctrl.isLegendVisible = true;
        };

        /**
         * @ngdoc property
         * @name rotationAngle
         * @propertyOf accessimapEditeurDerApp.controller:LocalmapController
         * @type {Number}
         * @description rotation angle of the #map element
         */
        $ctrl.rotationAngle = 0;

        /**
         * @ngdoc method
         * @name  rotateMap
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description rotate element of rotationAngle property
         */
        $ctrl.rotateMap = function() {
            LocalmapService.rotate($ctrl.rotationAngle);
        };

        $ctrl.checkboxModel = {
            contour: false,
            fill: false,
        };

        $ctrl.address      = {};
        
        $ctrl.geojson      = LocalmapService.geojson;
        
        $ctrl.queryChoices = LocalmapService.settings.QUERY_LIST;
        $ctrl.queryChosen  = $ctrl.queryChoices[0];
        
        $ctrl.styleChoices = LocalmapService.settings.STYLES[$ctrl.queryChosen.type];
        $ctrl.styleChosen  = $ctrl.styleChoices[0];
        
        $ctrl.changeStyle = function() {
            $ctrl.styleChoices = LocalmapService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];
        };

        $ctrl.colors       = (LocalmapService.settings.COLORS.transparent)
                                .concat(LocalmapService.settings.COLORS.other);
        $ctrl.colorChosen  = $ctrl.colors[0];

        $ctrl.featureIcon      = LocalmapService.featureIcon;
        
        $ctrl.downloadData     = function(point) {
            LocalmapService.downloadData(point,
                                        $ctrl.queryChosen,
                                        $ctrl.styleChosen,
                                        $ctrl.styleChoices,
                                        $ctrl.colorChosen,
                                        $ctrl.checkboxModel,
                                        $ctrl.rotationAngle);
        };

        $ctrl.downloadPoi      = function() {
            LocalmapService.downloadPoi($ctrl);
        };
        
        $ctrl.simplifyFeatures = function(feature) {
            LocalmapService.simplifyFeatures(feature,
                                            $ctrl.queryChosen,
                                            $ctrl.styleChosen,
                                            $ctrl.styleChoices,
                                            $ctrl.colorChosen,
                                            $ctrl.checkboxModel,
                                            $ctrl.rotationAngle);
        };

        $ctrl.removeFeature    = LocalmapService.removeFeature;
        $ctrl.updateFeature    = LocalmapService.updateFeature;
        $ctrl.rotateFeature    = LocalmapService.rotateFeature;

        $ctrl.zoomOnPlace      = function() {
            LocalmapService.zoomOnPlace($ctrl.address,
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen,
                                        $ctrl.checkboxModel,
                                        $ctrl.rotationAngle);
        };

        /**
         * @ngdoc method
         * @name  nextStep
         * @methodOf accessimapEditeurDerApp.controller:LocalmapController
         * @description  Store the current map & legend, then go to '/commonmap'
         */
        $ctrl.nextStep = function() {
            LocalmapService.storeMapAndLegend()
                .then(function() {
                    $location.path('/commonmap');
                });
        };

        LocalmapService.init($location.search().mapFormat ? $location.search().mapFormat : 'landscapeA4',
                             $location.search().legendFormat ? $location.search().legendFormat : 'landscapeA4');

    }

    angular.module(moduleApp)
        .controller('LocalmapController', LocalmapController);

    LocalmapController.$inject = ['$location', 'LocalmapService'];

})();