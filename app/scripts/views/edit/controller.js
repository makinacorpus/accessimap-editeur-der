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

        $ctrl.fonts                      = EditService.settings.FONTS;
        $ctrl.fontChosen                 = $ctrl.fonts[0];
        $ctrl.fontColors                 = EditService.settings.COLORS;
        $ctrl.fontColorChosen            = $ctrl.fontColors[$ctrl.fontChosen.color][0];
        
        $ctrl.colors                     = (EditService.settings.COLORS.transparent).concat(EditService.settings.COLORS.other);
        
        $ctrl.colorChosen                = $ctrl.colors[0];
        $ctrl.featureIcon                = EditService.featureIcon;
        $ctrl.formats                    = EditService.settings.FORMATS;
        $ctrl.backgroundStyleChoices     = EditService.settings.STYLES.polygon;
        $ctrl.mapFormat                  = $location.search().mapFormat ? $location.search().mapFormat : 'landscapeA4';
        $ctrl.legendFormat               = $location.search().legendFormat ? $location.search().legendFormat : 'landscapeA4';
        $ctrl.checkboxModel              = { contour: true};
        $ctrl.getFeatures                = EditService.getFeatures;
        
        $ctrl.model = {
            title           : 'Titre du dessin',
            isMapVisible    : false,
            comment         : 'Pas de commentaire',
            mapFormat       : 'landscapeA4',
            legendFormat    : 'landscapeA4',
            backgroundColor : $ctrl.colors[0], // transparent
            backgroundStyle : EditService.settings.STYLES.polygon[EditService.settings.STYLES.polygon.length - 1], // solid
        }

        // general state parameters        
        $ctrl.isParametersVisible            = true; // initial state = parameters
        $ctrl.isMapParametersVisible         = false;
        $ctrl.isDrawingParametersVisible     = false;
        $ctrl.isLegendParametersVisible      = false;
        $ctrl.isInteractionParametersVisible = false;
        $ctrl.isBackgroundParametersVisible  = false;
        
        // map state parameters
        $ctrl.isAddressVisible           = false;
        $ctrl.isPoiCreationVisible       = false;
        $ctrl.isFeatureCreationVisible   = false;
        $ctrl.isFeatureManagementVisible = true;
        
        $ctrl.isMapFreezed = false;

        // states of right side : drawing (workspace) or legend ?
        $ctrl.isWorkspaceVisible  = true;
        $ctrl.isLegendVisible     = false;
        
        $ctrl.isBrailleDisplayed  = true;
        
        $ctrl.markerStartChoices  = EditService.settings.markerStart;
        $ctrl.markerStopChoices   = EditService.settings.markerStop;
        
        $ctrl.isUndoAvailable     = EditService.isUndoAvailable;
        
        $ctrl.exportData          = function() { 

            ToasterService.info('Export du dessin... merci de patienter', {timeout: 0, tapToDismiss: false})
            EditService.exportData($ctrl.model) 
                .then(function () {
                    ToasterService.remove()
                    ToasterService.success('Export terminé !')
                })
                .catch(function(error) {
                    ToasterService.remove()
                    ToasterService.error(error, 'Erreur lors de l\'export...')
                });
        };
        $ctrl.rotateMap           = EditService.rotateMap;
        
        $ctrl.changeDrawingFormat = function(format) {
            EditService.changeDrawingFormat(format);
            EditService.updateBackgroundStyleAndColor($ctrl.model.backgroundStyle, $ctrl.model.backgroundColor);
        }
        $ctrl.changeLegendFormat  = EditService.changeLegendFormat;
        
        $ctrl.interactions        = EditService.interactions;
        
        $ctrl.mapCategories       = EditService.settings.mapCategories;
        
        $ctrl.uploadFile          = EditService.uploadFile;
        $ctrl.appendSvg           = EditService.appendSvg;
        
        $ctrl.importDER = function(file) {

            ToasterService.info('Import du fichier... merci de patienter', {timeout: 0, tapToDismiss: false})

            EditService.importDER(file)
                .then(function definedModel(model) {
                    ToasterService.remove()
                    ToasterService.success('Import terminé !')
                    $ctrl.model = model;
                })
                .catch(function(error) {
                    ToasterService.remove()
                    ToasterService.error(error, 'Erreur lors de l\'import...')
                });
        }
            
        /**
         * @ngdoc method
         * @name  showMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Show the map layer
         */
        $ctrl.showMap = function() {
            $ctrl.model.isMapVisible = true;
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
            $ctrl.model.isMapVisible = false;
            EditService.hideMapLayer()
        }

        /**
         * @ngdoc method
         * @name  showFontBraille
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Show the map layer
         */
        $ctrl.showFontBraille = function() {
            $ctrl.isBrailleDisplayed = true;
            EditService.showFontBraille();
        }
        
        /**
         * @ngdoc method
         * @name  hideFontBraille
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Hide the map layer
         */
        $ctrl.hideFontBraille = function() {
            $ctrl.isBrailleDisplayed = false;
            EditService.hideFontBraille()
        }

        /**
         * Map parameters
         */
        $ctrl.displayAddPOIForm = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = true;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;

            $ctrl.queryChosen  = EditService.settings.QUERY_POI;
            $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];

            EditService.enableAddPOI(ToasterService.warning, ToasterService.error, getDrawingParameters );
        }

        // function drawGeoJSON(osmGeojson) {
            
        //     if (! osmGeojson) {
        //         ToasterService.error('Parameter osmGeojson undefined. Please provide it before calling this function.')
        //     }
            
        //     if (osmGeojson.features && osmGeojson.features.length > 0) {
        //         EditService.geojsonToSvg(osmGeojson, 
        //                 null, 
        //                 'node_' + osmGeojson.features[0].properties.id, 
        //                 $ctrl.queryChosen === EditService.settings.QUERY_POI, 
        //                 $ctrl.queryChosen, 
        //                 $ctrl.styleChosen, 
        //                 $ctrl.styleChoices, 
        //                 $ctrl.colorChosen, 
        //                 $ctrl.checkboxModel, 
        //                 $ctrl.rotationAngle)
        //     } else {
        //         // TODO: soft error, with a toaster or something to explain to the user we haven't find anything...
        //         ToasterService.warning('Aucun POI trouvé à cet endroit... Merci de cliquer ailleurs !?')
        //     }
        // }
        
        $ctrl.displaySearchAddressForm = function() {
            $ctrl.isAddressVisible           = true;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;
        }
        $ctrl.displayGetDataFromOSMForm = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = true;
            $ctrl.isFeatureManagementVisible = false;
        }
        $ctrl.insertOSMData = function()  {
            EditService.insertOSMData($ctrl.queryChosen, ToasterService.warning, ToasterService.error, getDrawingParameters)
        }
        $ctrl.displayFeatureManagement = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = true;
        }

        /**
         * General parameters
         */
        $ctrl.displayParameters = function() {
            $ctrl.isParametersVisible            = true;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;

            EditService.resetActions();

        }
        $ctrl.displayMapParameters = function() {
            $ctrl.isWorkspaceVisible             = true;
            $ctrl.isLegendVisible                = false;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = true;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;

            $ctrl.displayFeatureManagement();
        }
        $ctrl.displayDrawingParameters = function() {
            $ctrl.isWorkspaceVisible             = true;
            $ctrl.isLegendVisible                = false;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = true;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;

            $ctrl.enableDrawingMode('default');
            
            $ctrl.isMapFreezed               = true;
            EditService.freezeMap();
        }
        $ctrl.displayLegendParameters = function() {
            $ctrl.isWorkspaceVisible             = false;
            $ctrl.isLegendVisible                = true;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = true;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;
        }
        $ctrl.displayInteractionParameters = function() {
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = true;
            $ctrl.isBackgroundParametersVisible  = false;
        }
        $ctrl.displayBackgroundParameters = function() {
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = true;
        }

        $ctrl.removeFeature = EditService.removeFeature;
        $ctrl.updateFeature = EditService.updateFeature;
        $ctrl.rotateFeature = EditService.rotateFeature;

        $ctrl.updateMarker  = EditService.updateMarker;

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
        
        function getDrawingParameters() {
            return {
                style: $ctrl.styleChosen,
                color: $ctrl.colorChosen,
                font: $ctrl.fontChosen,
                fontColor: $ctrl.fontColorChosen,
                contour: $ctrl.checkboxModel ? $ctrl.checkboxModel.contour : false,
                mode: $ctrl.mode
            }
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

            switch ($ctrl.mode) {

                case 'default':
                    EditService.addRadialMenus();
                    break;

                case 'undo':
                    EditService.undo();
                    break;

                case 'point':
                    setStyles($ctrl.mode);
                    EditService.enablePointMode(getDrawingParameters);
                    break;

                case 'circle':
                    setStyles('polygon');
                    EditService.enableCircleMode(getDrawingParameters);
                    break;

                case 'line':
                case 'polygon':
                    setStyles($ctrl.mode);
                    EditService.enableLineOrPolygonMode(getDrawingParameters);
                    break;

                case 'addtext':
                    EditService.enableTextMode(getDrawingParameters);
                    break;
            }

        }

        $ctrl.resetView = EditService.resetView;

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
                    ToasterService.error(error);
                })
        };  

        // Initialisation of the view
        EditService.init($ctrl.mapFormat, $ctrl.legendFormat);
        
    }

    angular.module(moduleApp).controller('EditController', EditController);

    EditController.$inject = ['EditService', 'ToasterService', '$location', '$q']
})();