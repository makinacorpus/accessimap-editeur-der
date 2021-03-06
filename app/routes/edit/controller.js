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

    function EditController(EditService, ToasterService, SelectPathService, HistoryService, $location, $q, $scope, $rootScope) {
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
        $ctrl.queryChosenPoi  = EditService.settings.QUERY_POI;

        /**
         * @ngdoc property
         * @name  styleChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         *
         * @description
         * Options of styling for the queryChosen' type
         */
        $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
        $ctrl.styleChoicesPoi = EditService.settings.STYLES[$ctrl.queryChosenPoi.type];


        /**
         * @ngdoc property
         * @name  pointChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         *
         * @description
         * Options of styling for POI / points
         */
        $ctrl.pointChoices = EditService.settings.STYLES.point;

        /**
         * @ngdoc property
         * @name  styleChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * Style selected for the queryChosen' type
         */
        $ctrl.styleChosen  = $ctrl.styleChoices[0];
        $ctrl.styleChosenPoi  = $ctrl.styleChoicesPoi[0];

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

        $ctrl.colors                     = (EditService.settings.COLORS.transparent)
                                                .concat(EditService.settings.COLORS.other);

        $ctrl.colorChosen                = $ctrl.colors[0];
        $ctrl.featureIcon                = EditService.featureIcon;
        $ctrl.formats                    = EditService.settings.FORMATS;
        $ctrl.backgroundStyleChoices     = EditService.settings.STYLES.polygon;
        $ctrl.getFeatures                = EditService.getFeatures;


        // general state parameters
        $ctrl.expandedMenu                   = false;
        $ctrl.panel                 = null;

        $ctrl.poiMode = false;

        $ctrl.isDrawingFreezed = false;
        $ctrl.isBrailleDisplayed  = true;

        $ctrl.markerStartChoices  = EditService.settings.markerStart;
        $ctrl.markerStopChoices   = EditService.settings.markerStop;

        $ctrl.isUndoAvailable     = EditService.isUndoAvailable;

        $ctrl.interactionOpen     = {};

        $ctrl.initState = function() {
            $ctrl.mapFormat = $location.search().mapFormat
                            ? $location.search().mapFormat
                            : 'landscapeA4';
            $ctrl.legendFormat = $location.search().legendFormat
                            ? $location.search().legendFormat
                            : 'landscapeA4';

            $ctrl.checkboxModel = { contour: true};

            $ctrl.model = {
                title           : 'Nouveau dessin',
                isMapVisible    : false,
                comment         : 'Pas de commentaire',
                mapFormat       : 'landscapeA4',
                legendFormat    : 'landscapeA4',
                backgroundColor : $ctrl.colors[0], // transparent
                backgroundStyle : EditService.settings.STYLES.polygon[EditService.settings.STYLES.polygon.length - 1],
            }

        }

        $ctrl.init = function() {
            $ctrl.initState();
            EditService.init($ctrl.mapFormat, $ctrl.legendFormat);
        }

        $ctrl.expandMenu = function() {
            $ctrl.expandedMenu = $ctrl.expandedMenu ? false : true;
        }

        $ctrl.undo = function() {
            EditService.undo();
        }

        $ctrl.redo = function() {
            EditService.redo()
        }
        
        
        // Key events
        var onMoveFrame = false;
        $ctrl.moveFrame = function() {
            onMoveFrame = true
            EditService.enableDefaultMode();
            $ctrl.isDrawingFreezed = true;
            EditService.freezeMap();
        }
        function stopMoveFrame() {
            if (onMoveFrame) {
                $ctrl.enableDrawingMode($ctrl.mode);
                onMoveFrame = false;
            }
        }

        function KeyPress(e) {
            var evtobj = window.event? event : e
            if (evtobj.keyCode == 90 && evtobj.ctrlKey) $ctrl.undo(); // ctrl + Z
            if (evtobj.keyCode == 89 && evtobj.ctrlKey) $ctrl.redo(); // ctrl + Y
            if (evtobj.keyCode == 32 && $ctrl.mode !== 'select') $ctrl.moveFrame(); // Espace
            if (evtobj.keyCode == 27) {
                $ctrl.resetFeature();
                $ctrl.enableDrawingMode('select');
                $scope.$apply();
            }
        }

        document.onkeydown = KeyPress;
        document.onkeyup = stopMoveFrame;

        $ctrl.reset = function() {
            if (window.confirm('En validant, vous allez effacer votre dessin en cours et en créer un nouveau.'))
                window.location.reload();
        }

        $ctrl.exportData          = function() {
            SelectPathService.deselectPath();
            
            ToasterService.info('Export du dessin en cours...\n' +
                'Merci de patienter', {timeout: 0, tapToDismiss: false})
            EditService.exportData($ctrl.model)
                .then(function () {
                    ToasterService.remove()
                    ToasterService.success('Export terminé !')
                })
                .catch(function(error) {
                    ToasterService.remove()
                    ToasterService.error(error, 'Erreur lors de l\'export...');
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

        $ctrl.importBackground    = EditService.importBackground;
        $ctrl.importImage         = EditService.importImage;
        $ctrl.appendSvg           = EditService.appendSvg;

        $ctrl.defaultFeatureProperties = {};

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
         * @name  toggleMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         *
         * @description
         * Toggle the map layer
         */
        $ctrl.toggleMap = function() {
            if ($ctrl.model.isMapVisible) {
                $ctrl.model.isMapVisible = false;
                EditService.hideMapLayer()
            } else {
                $ctrl.model.isMapVisible = true;
                EditService.showMapLayer();
            }
        }

        /**
         * @ngdoc method
         * @name  toggleFontBraille
         * @methodOf accessimapEditeurDerApp.controller:EditController
         *
         * @description
         * Toggle legend in braille / plain text
         */
        $ctrl.toggleFontBraille = function() {
            if ($ctrl.isBrailleDisplayed) {
                $ctrl.isBrailleDisplayed = false;
                EditService.hideFontBraille();
            } else {
                $ctrl.isBrailleDisplayed = true;
                EditService.showFontBraille();
            }
        }

        $ctrl.resetView = EditService.resetView;

        /**
         * Map parameters
         */
        $ctrl.displayAddPOIForm = function() {
            $ctrl.poiMode = true;
            EditService.enableAddPOI(ToasterService.warning, ToasterService.error, getDrawingParameters );
        }

        $ctrl.initOSMMode = function() {
            EditService.initOSMMode();
        }

        $ctrl.insertOSMData = function()  {
            EditService.initOSMMode();
            EditService.insertOSMData($ctrl.queryChosen,
                                        ToasterService.warning,
                                        ToasterService.error,
                                        ToasterService.info,
                                        getDrawingParameters)
        }

        /**
         * General parameters
         */
        $ctrl.displayParameters = function() {
            if ($ctrl.panel === 'parameters') {
                $ctrl.panel = null;
                EditService.resetState();
                return false;
            }

            $ctrl.panel = 'parameters';
            EditService.resetState();
        }
        $ctrl.displayMapParameters = function() {
            if ($ctrl.panel === 'map') {
                $ctrl.panel = null;
                EditService.resetState();
                return false;
            }

            $ctrl.panel = 'map';
            $ctrl.initOSMMode();
            $ctrl.showMap();
        }
        $ctrl.displayDrawingParameters = function() {
            if ($ctrl.panel === 'draw') {
                $ctrl.panel = null;
                EditService.resetState();
                return false;
            }
            $ctrl.panel = 'draw';
            $ctrl.enableDrawingMode('select');

            // Display for the first time the drawing is freezed
            if (! $ctrl.isDrawingFreezed)
                ToasterService.info('Lorsque vous passez en mode dessin, la zone du dessin est automatiquement figée.',
                                     'La zone du dessin est figée')

            $ctrl.isDrawingFreezed               = true;
            EditService.freezeMap();
        }
        $ctrl.displayLegendParameters = function() {
            if ($ctrl.panel === 'legend') {
                $ctrl.panel = null;
                EditService.resetState();
                return false;
            }
            $ctrl.panel = 'legend';
        }
        $ctrl.displayInteractionParameters = function() {
            if ($ctrl.panel === 'interaction') {
                $ctrl.panel = null;
                EditService.resetState();
                return false;
            }
            $ctrl.enableDrawingMode('select');
            $ctrl.panel = 'interaction';
        }
        $ctrl.displayBackgroundParameters = function() {
        }

        $ctrl.removeFeature = EditService.removeFeature;
        $ctrl.updateFeature = EditService.updateFeature;
        $ctrl.rotateFeature = EditService.rotateFeature;

        $ctrl.updatePoint   = EditService.updatePoint;

        $ctrl.updateMarker  = EditService.updateMarker;

        $ctrl.updateColor = function(color) {
            EditService.updateFeatureStyleAndColor(null, color);
        }

        $ctrl.updateStyle = function(style) {
            EditService.updateFeatureStyleAndColor(style, null);
        }

        $ctrl.updateBackgroundColor = function(color) {
            EditService.updateBackgroundStyleAndColor($ctrl.model.backgroundStyle, color);
        }

        $ctrl.updateBackgroundStyle = function(style) {
            EditService.updateBackgroundStyleAndColor(style, $ctrl.model.backgroundColor);
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

        $ctrl.resetFeature = function() {
            SelectPathService.deselectPath();
            $ctrl.featureProperties = null;
            $ctrl.currentFeature = null;
        }

        // switch of editor's mode
        // adapt user's interactions
        $ctrl.properties = EditService.properties ;
        $ctrl.filterProperty = function(currentProperty) {
            return currentProperty.visible === true
                && ( currentProperty.type === 'all'
                    || currentProperty.type.indexOf($ctrl.featureProperties['data-type']) >= 0 );
        }
        $ctrl.updateProperties = function() {
            EditService.setProperties($ctrl.currentFeature, $ctrl.featureProperties);
            EditService.historySave();
        }

        function selectInteraction(poiId) {
            Object.keys($ctrl.interactionOpen).map(function(key) {
                $ctrl.interactionOpen[key] = false;
            });
            $ctrl.interactionOpen['poi-' + poiId] = true;
        }

        $ctrl.enableDrawingMode = function(mode) {
            EditService.resetState();

            $ctrl.mode = mode;

            function setStyles(styleSetting) {
                $ctrl.styleChoices = EditService.settings.STYLES[styleSetting];
                $ctrl.styleChosen  = $ctrl.styleChoices[0];
            }

            function setFeatureProperties(feature) {
                var featureProperties = EditService.getProperties(feature);
                featureProperties.interactions = EditService.getInteraction(feature);
                $ctrl.featureProperties = featureProperties;
                $ctrl.currentFeature = feature;
                
                var featureIndex = feature.attr('data-link');
                $ctrl.currentPoi = featureIndex;
                selectInteraction(featureIndex);
                
                EditService.interactions.openInteraction(featureIndex);

                $scope.$apply();
            }

            $ctrl.resetFeature();

            switch ($ctrl.mode) {

                // case 'default':
                //     EditService.enableDefaultMode();
                //     break;

                case 'select':
                    EditService.enableSelectMode(setFeatureProperties);
                    break;

                case 'point':
                    setStyles($ctrl.mode);
                    EditService.enablePointMode(getDrawingParameters);
                    break;

                case 'circle':
                    setStyles('polygon');
                    EditService.enableCircleMode(getDrawingParameters);
                    break;

                case 'square':
                    setStyles('polygon');
                    EditService.enableSquareMode(getDrawingParameters);
                    break;

                case 'triangle':
                    setStyles('polygon');
                    EditService.enableTriangleMode(getDrawingParameters);
                    break;

                case 'line':
                case 'polygon':
                    setStyles($ctrl.mode);
                    EditService.enableLineOrPolygonMode(getDrawingParameters);
                    break;

                case 'addtext':
                    EditService.enableTextMode(getDrawingParameters);
                    break;

                case 'image':
                    EditService.enableImageMode(getDrawingParameters);
                    break;
            }

        }

        $ctrl.searchAddress      = function() {

            var promises = [];

            if($ctrl.address.start) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.start,
                                        'startPoint',
                                        'Point de départ',
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen));
            }

            if($ctrl.address.stop) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.stop,
                                        'stopPoint',
                                        'Point d\'arrivée',
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

        $ctrl.goToInteraction = function() {
            $ctrl.displayInteractionParameters();

            setTimeout(function() {
                EditService.interactions.openInteraction($ctrl.currentPoi);
            }, 300);
        }

        $ctrl.addInteraction = function(poiIndex, filterId) {
            EditService.interactions.addInteraction(poiIndex, filterId);
        }

        $ctrl.removeInteraction = function(poiIndex, interactionIndex) {
            EditService.interactions.removeInteraction(poiIndex, interactionIndex);
            $ctrl.featureProperties.interactions = EditService.getInteraction($ctrl.currentFeature);
        }

        $ctrl.getInteractionsByFilterLength = function(interactions, filterId) {
            var interactionFiltered = interactions.filter(function(interaction) {
                return interaction.filter === filterId;
            });
            return interactionFiltered.length;
        }

        $ctrl.showInteractions = Object.keys($ctrl.interactions.getInteractions());

        $ctrl.isInteractionHasError = function(poi) {
            EditService.interactions.isInteractionHasError(poi);
        }
    }

    angular.module(moduleApp).controller('EditController', EditController);

    EditController.$inject = ['EditService', 'ToasterService', 'SelectPathService', 'HistoryService', '$location', '$q', '$scope', '$rootScope']
})();
