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

    function EditController(EditService, ToasterService, $location, $q) {
        
        var $ctrl = this;

        /**
         * @ngdoc property
         * @name  queryChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Options of POI and area to add on the map
         */
        $ctrl.queryChoices = EditService.settings.QUERY_LIST;
        
        /**
         * @ngdoc property
         * @name  queryChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * POI / area selected 
         */
        $ctrl.queryChosen  = EditService.settings.QUERY_DEFAULT; // $ctrl.queryChoices[1];
        /**
         * @ngdoc property
         * @name  styleChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
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

        $ctrl.comment                    = "";
        
        $ctrl.fonts                      = EditService.settings.FONTS;
        $ctrl.fontChosen                 = $ctrl.fonts[0];
        $ctrl.fontColors                 = EditService.settings.COLORS;
        $ctrl.fontColorChosen            = $ctrl.fontColors[$ctrl.fontChosen.color][0];
        
        $ctrl.colors                     = (EditService.settings.COLORS.transparent)
                                                .concat(EditService.settings.COLORS.other);
        $ctrl.colorChosen                = $ctrl.colors[0];
        $ctrl.featureIcon                = EditService.featureIcon;
        $ctrl.formats                    = EditService.settings.FORMATS;
        $ctrl.backgroundColor            = EditService.settings.COLORS.transparent[0]; // transparent
        $ctrl.backgroundStyle            = EditService.settings.STYLES.polygon[EditService.settings.STYLES.polygon - 1]; // solid
        $ctrl.backgroundStyleChoices     = EditService.settings.STYLES.polygon;
        $ctrl.mapFormat                  = $location.search().mapFormat ? $location.search().mapFormat : 'landscapeA4';
        $ctrl.legendFormat               = $location.search().legendFormat ? $location.search().legendFormat : 'landscapeA4';
        $ctrl.checkboxModel              = { contour: true};
        $ctrl.geojson                    = EditService.getFeatures();
        
        $ctrl.isParametersVisible        = true; // initial state = parameters
        
        $ctrl.isAddressVisible           = false;
        $ctrl.isPoiCreationVisible       = false;
        $ctrl.isFeatureCreationVisible   = false;
        $ctrl.isFeatureManagementVisible = false;
        
        $ctrl.isMapToolboxVisible        = false;
        $ctrl.isMapParametersVisible     = false;
        $ctrl.isDrawingToolboxVisible    = false;
        
        $ctrl.isMapVisible               = false;
        $ctrl.isMapFreezed               = false;

        $ctrl.markerStartChoices         = EditService.settings.markerStart;
        $ctrl.markerStopChoices          = EditService.settings.markerStop;

        $ctrl.isUndoAvailable            = EditService.isUndoAvailable;

        $ctrl.exportData                 = EditService.exportData;
        $ctrl.rotateMap                  = EditService.rotateMap;

        $ctrl.changeDrawingFormat        = EditService.changeDrawingFormat;
        $ctrl.changeLegendFormat         = EditService.changeLegendFormat;

        /**
         * @ngdoc method
         * @name  showMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Show the map layer
         */
        $ctrl.showMap = function() {
            $ctrl.isMapVisible = true;
            EditService.showMapLayer();
        }
        
        /**
         * @ngdoc method
         * @name  hideMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Hide the map layer
         */
        $ctrl.hideMap = function() {
            $ctrl.isMapVisible = false;
            EditService.hideMapLayer()
        }

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
            $ctrl.isWorkspaceVisible = true;
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
            $ctrl.isWorkspaceVisible = false;
            $ctrl.isLegendVisible = true;
        };

        // Insert POI from OSM/nominatim
        $ctrl.displayAddPOIForm = function() {
            $ctrl.isParametersVisible        = false;
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = true;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;

            $ctrl.queryChosen  = EditService.settings.QUERY_POI;
            $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];

            EditService.enableAddPOI(drawGeoJSON, ToasterService.displayError);
        }

        function drawGeoJSON(osmGeojson) {
            
            if (! osmGeojson) {
                throw new Error('Parameter osmGeojson undefined. Please provide it before calling this function.')
            }
            
            if (osmGeojson.features && osmGeojson.features.length > 0) {
                EditService.geojsonToSvg(osmGeojson, 
                        null, 
                        'node_' + osmGeojson.features[0].properties.id, 
                        false, 
                        $ctrl.queryChosen, 
                        $ctrl.styleChosen, 
                        $ctrl.styleChoices, 
                        $ctrl.colorChosen, 
                        $ctrl.checkboxModel, 
                        $ctrl.rotationAngle)
            }
            else {
                // TODO: soft error, with a toaster or something to explain to the user we haven't find anything...
                throw new Error('No feature to display... Please click again, maybe not at the same place ?')
            }
        }

        // Search address from OSM / Nominatim
        $ctrl.displaySearchAddressForm = function() {
            $ctrl.isParametersVisible        = false;
            $ctrl.isAddressVisible           = true;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;
            $ctrl.isLegendVisible     = false;
        }

        // Insert data from OSM / Nominatim
        $ctrl.displayGetDataFromOSMForm = function() {
            $ctrl.isParametersVisible        = false;
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = true;
            $ctrl.isFeatureManagementVisible = false;
            $ctrl.isLegendVisible     = false;

        }
        $ctrl.insertOSMData = function()  {
            EditService.insertOSMData($ctrl.queryChosen, drawGeoJSON, ToasterService.displayError)
        }

        // Parameters
        $ctrl.displayParameters = function() {
            $ctrl.isParametersVisible        = true;
            $ctrl.isMapParametersVisible     = false;
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;
            $ctrl.isDrawingToolboxVisible    = false;
            // $ctrl.isLegendVisible            = false;
        }

        // Management of features
        $ctrl.displayFeatureManagement = function() {
            $ctrl.isParametersVisible        = false;
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = true;
            $ctrl.isDrawingToolboxVisible    = false;
            $ctrl.isLegendVisible     = false;
        }

        $ctrl.isDrawingToolboxVisible = false;
        $ctrl.isMapToolboxVisible = false;
        $ctrl.displayMapToolbox = function() {
            $ctrl.isParametersVisible        = false;
            $ctrl.isMapParametersVisible     = true;
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = true;
            $ctrl.isDrawingToolboxVisible    = false;
            $ctrl.isLegendVisible     = false;
            // EditService.resetActions();
        }
        $ctrl.displayDrawingToolbox = function() {
            $ctrl.isDrawingToolboxVisible = true;
            $ctrl.isMapToolboxVisible     = false;
            $ctrl.isLegendVisible     = false;
            $ctrl.isParametersVisible     = false;
            $ctrl.enableDrawingMode('default');
            $ctrl.isMapFreezed = true;
            EditService.freezeMap();
        }

        $ctrl.displayLegendToolbox = function() {
            $ctrl.isDrawingToolboxVisible = false;
            $ctrl.isMapToolboxVisible     = false;
            $ctrl.isLegendVisible     = true;
            $ctrl.isWorkspaceVisible     = false;
            $ctrl.isParametersVisible     = false;
        }

        $ctrl.removeFeature = EditService.removeFeature;
        $ctrl.updateFeature = EditService.updateFeature;
        $ctrl.rotateFeature = EditService.rotateFeature;

        $ctrl.updateMarker  = EditService.updateMarker;
        $ctrl.toggleLegendFontBraille  = EditService.toggleLegendFontBraille;

        $ctrl.updateColor = function(color) {
            EditService.updateFeatureStyleAndColor(null, color);
        }

        $ctrl.updateStyle = function(style) {
            EditService.updateFeatureStyleAndColor(style, null);
        }

        $ctrl.updateBackgroundColor = function(color) {
            EditService.updateBackgroundStyleAndColor(null, color);
        }

        $ctrl.updateBackgroundStyle = function(style) {
            EditService.updateBackgroundStyleAndColor(style, null);
        }
        
        // switch of editor's mode
        // adapt user's interactions
        $ctrl.enableDrawingMode = function(mode) {

            EditService.resetActions();

            $ctrl.mode = mode;

            function setStyles(styleSetting) {
                $ctrl.styleChoices = EditService.settings.STYLES[styleSetting];
                $ctrl.styleChosen  = $ctrl.styleChoices[0];
            }

            function getDrawingParameter() {
                return {
                    style: $ctrl.styleChosen,
                    color: $ctrl.colorChosen,
                    font: $ctrl.fontChosen,
                    fontColor: $ctrl.fontColorChosen,
                    contour: $ctrl.checkboxModel ? $ctrl.checkboxModel.contour : false,
                    mode: $ctrl.mode
                }
            }

            switch ($ctrl.mode) {

                case 'default':
                    EditService.addRadialMenus();
                    break;

                case 'undo':
                    EditService.undo();
                    break;

                case 'point':
                    setStyles($ctrl.mode);
                    EditService.enablePointMode(getDrawingParameter);
                    break;

                case 'circle':
                    setStyles('polygon');
                    EditService.enableCircleMode(getDrawingParameter);
                    break;

                case 'line':
                case 'polygon':
                    setStyles($ctrl.mode);
                    EditService.enableLineOrPolygonMode(getDrawingParameter);
                    break;

                case 'addtext':
                    EditService.enableTextMode(getDrawingParameter);
                    break;
            }

        }

        $ctrl.centerView = EditService.resetZoom;

        $ctrl.searchAddress      = function() {
            
            var promises = [];

            if($ctrl.address.start) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.start,
                                        'startPoint',
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen));
            }

            if($ctrl.address.stop) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.stop,
                                        'stopPoint',
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen));
            }

            // center the map or display both of addresses
            $q.all(promises)
                .then(function(results) {
                    if (results.length > 1) {
                        // fitBounds
                        EditService.fitBounds([
                                [results[0].lat, results[0].lon],
                                [results[1].lat, results[1].lon],
                            ])
                    } else {
                        // pan
                        EditService.panTo([results[0].lat, results[0].lon])
                    }
                })
                .catch(function(error) {
                    ToasterService.displayError(error);
                })
        };

        // Initialisation of the view
        EditService.init(EditService.settings.FORMATS[$ctrl.mapFormat], 
                        EditService.settings.FORMATS[$ctrl.legendFormat]);
        
    }

    angular.module(moduleApp).controller('EditController', EditController);

    EditController.$inject = ['EditService', 'ToasterService', '$location', '$q']
})();