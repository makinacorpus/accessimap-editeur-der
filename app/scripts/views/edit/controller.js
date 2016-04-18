/*global turf, osmtogeojson */

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:EditController
 * @requires accessimapEditeurDerApp.EditService
 * @description
 * Controller of the '/edit' view
 *
 * The '/edit' view is a POC to leaflet's map & drawing
 *
 * This view allow the user to :
 * - display a map (thanks to leaflet)
 * - search some features (address, POI, areas)
 * - get data for POI or for a specific set (buildings, roads, ...) & display them
 * - visualize the area which will be print
 */
(function() {
    'use strict';

    function EditController(EditService, $location) {
        
        var $ctrl = this;

        /**
         * @ngdoc property
         * @name  queryChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * Options of POI and area to add on the map
         */
        $ctrl.queryChoices = EditService.settings.QUERY_LIST;
        
        /**
         * @ngdoc property
         * @name  queryChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * POI / area selected 
         */
        $ctrl.queryChosen  = $ctrl.queryChoices[0];
        
        /**
         * @ngdoc property
         * @name  styleChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * Options of styling for the queryChosen' type
         */
        $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];

        /**
         * @ngdoc property
         * @name  styleChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * Style selected for the queryChosen' type
         */
        $ctrl.styleChosen  = $ctrl.styleChoices[0];
        
        /**
         * @ngdoc
         * @name  changeStyle
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description Update the styleChoices & styleChosen properties according to the queryChosen type
         */
        $ctrl.changeStyle  = function() {
            $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];
        };
        
        $ctrl.colors                = (EditService.settings.COLORS.transparent)
                                            .concat(EditService.settings.COLORS.other);
        $ctrl.colorChosen           = $ctrl.colors[0];
        $ctrl.featureIcon           = EditService.featureIcon;
        $ctrl.formats               = EditService.settings.FORMATS;
        $ctrl.containerStyleChoices = EditService.settings.STYLES.polygon;
        $ctrl.mapFormat             = $location.search().mapFormat ? $location.search().mapFormat : 'landscapeA4';
        $ctrl.legendFormat          = $location.search().legendFormat ? $location.search().legendFormat : 'landscapeA4';
        $ctrl.mapFillColor          = $ctrl.colors[0];

        $ctrl.isParametersVisible    = true;
        $ctrl.isAddressVisible       = false;
        $ctrl.isPoiCreationVisible   = false;
        $ctrl.isPoiManagementVisible = false;

        /**
         * @ngdoc method
         * @name  hideAside
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description hide the left aside
         */
        $ctrl.hideAside = function() {
            $ctrl.isAsideVisible = false;
        };

        /**
         * @ngdoc method
         * @name  showAside
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description show the left aside
         */
        $ctrl.showAside = function() {
            $ctrl.isAsideVisible = true;
        };
        $ctrl.showAside();

        /**
         * @ngdoc method
         * @name  showDrawing
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description show the map and hide the legend
         */
        $ctrl.showDrawing = function() {
            $ctrl.isDrawingVisible = true;
            $ctrl.isLegendVisible = false;
        };
        $ctrl.showDrawing();

        /**
         * @ngdoc method
         * @name  showLegend
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description show the legend and hide the map
         */
        $ctrl.showLegend = function() {
            $ctrl.isDrawingVisible = false;
            $ctrl.isLegendVisible = true;
        };

        $ctrl.displayAddPOIForm = function() {
            $ctrl.isParametersVisible    = false;
            $ctrl.isAddressVisible       = false;
            $ctrl.isPoiCreationVisible   = true;
            $ctrl.isPoiManagementVisible = false;

            EditService
                .enableAddPOI(function successCallback(osmGeojson) {

                    console.log(osmGeojson)
                    
                    EditService.geojsonToSvg(osmGeojson, 
                            null, 
                            'node_' + osmGeojson.features[0].properties.id, 
                            true, 
                            $ctrl.queryChosen, 
                            $ctrl.styleChosen, 
                            $ctrl.styleChoices, 
                            $ctrl.colorChosen, 
                            $ctrl.checkboxModel, 
                            $ctrl.rotationAngle)
/*
                    osmGeojson.features = [osmGeojson.features[0]];

                    if (osmGeojson.features[0]) {
                        geojsonToSvg(osmGeojson, 
                                        undefined, 
                                        'node_' + osmGeojson.features[0].properties.id, 
                                        true, 
                                        queryChosen, 
                                        styleChosen, 
                                        styleChoices, 
                                        colorChosen, 
                                        checkboxModel, 
                                        0);
                    }
                    */

                }, function errorCallback(error) {
                    console.log(error);
                });
        }
        $ctrl.displaySearchAddressForm = function() {
            $ctrl.isParametersVisible    = false;
            $ctrl.isAddressVisible       = true;
            $ctrl.isPoiCreationVisible   = false;
            $ctrl.isPoiManagementVisible = false;
        }
        $ctrl.displayGetDataFromOSMForm = function() {
            $ctrl.isParametersVisible    = false;
            $ctrl.isAddressVisible       = false;
            $ctrl.isPoiCreationVisible   = false;
            $ctrl.isPoiManagementVisible = true;
        }
        $ctrl.displayParameters = function() {
            $ctrl.isParametersVisible    = true;
            $ctrl.isAddressVisible       = false;
            $ctrl.isPoiCreationVisible   = false;
            $ctrl.isPoiManagementVisible = false;
        }

        EditService.init(EditService.settings.FORMATS[$ctrl.mapFormat], 
                        EditService.settings.FORMATS[$ctrl.legendFormat]);
        
        $ctrl.displayParameters();

        /*
        var data = {
            "type":"FeatureCollection",
            "features":[
                {
                    "type":"Feature",
                    "id":"node/455444970",
                    "properties":{
                        "type":"node",
                        "id":"455444970",
                        "tags":{
                            "amenity":"pub",
                            "name":"Ô Boudu Pont"
                        },
                        "relations":[],
                        "meta":{}
                    },
                    "geometry":{
                        "type":"Point",
                        "coordinates":[1.4363842,43.5989145]
                    }
                }]
        }
        
        EditService.geojsonToSvg(data, 
                            null, 
                            'node_' + data.features[0].properties.id, 
                            true, 
                            $ctrl.queryChosen, 
                            $ctrl.styleChosen, 
                            $ctrl.styleChoices, 
                            $ctrl.colorChosen, 
                            $ctrl.checkboxModel, 
                            $ctrl.rotationAngle)
        */
    }

    angular.module(moduleApp).controller('EditController', EditController);

    EditController.$inject = ['EditService', '$location']
})();