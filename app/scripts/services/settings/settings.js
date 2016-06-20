/*global textures */
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsService
 * @requires accessimapEditeurDerApp.SettingsActions
 * @requires accessimapEditeurDerApp.SettingsColors
 * @requires accessimapEditeurDerApp.SettingsFonts
 * @requires accessimapEditeurDerApp.SettingsFormats
 * @requires accessimapEditeurDerApp.SettingsQuery
 * @requires accessimapEditeurDerApp.SettingsStyles
 * @description
 * # SettingsService
 * Factory in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function SettingsService (SettingsActions, SettingsColors, SettingsFonts, SettingsFormats, 
                        SettingsQuery, SettingsStyles) {

        var leafletConf = {
                GLOBAL_MAP_CENTER1: [1.441019, 43.604268], // [lon, lat]
                GLOBAL_MAP_CENTER: [43.604268, 1.441019], // [lon, lat]
                GLOBAL_MAP_DEFAULT_ZOOM: 13,
            },

        /**
         * @ngdoc property
         * @name  ratioPixelPoint
         * @propertyOf accessimapEditeurDerApp.SettingsService
         * @type {Number}
         * @description Ratio between a pixel and a millimeter
         */
        ratioPixelPoint = 0.283,

        margin = 40,

        mapCategories = [{
                id: 'world',
                name: 'Monde',
                images: [{
                    path: 'assets/data/BlankMap-World6-Equirectangular.svg'
                }]
            }, {
                id: 'france',
                name: 'France',
                images: [{
                    path: 'assets/data/France_all_regions_A4.svg'
                }]
            }],

        markerStart = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStartMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        markerStop = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStopMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        // XAPI_URL = 'http://overpass-api.de/api/interpreter?data=',
        XAPI_URL = 'http://api.openstreetmap.fr/oapi/interpreter/?data=',
        NOMINATIM_URL = 'http://nominatim.openstreetmap.org/search/';

        // Public API here
        return {
            XAPI_URL               : XAPI_URL,
            NOMINATIM_URL          : NOMINATIM_URL,
            
            FONTS                  : SettingsFonts.FONTS,
            
            COLORS                 : SettingsColors.COLORS,
            ALL_COLORS             : SettingsColors.ALL_COLORS,
            
            FORMATS                : SettingsFormats.FORMATS,
            DEFAULT_DRAWING_FORMAT : SettingsFormats.DEFAULT_DRAWING_FORMAT,
            DEFAULT_LEGEND_FORMAT  : SettingsFormats.DEFAULT_LEGEND_FORMAT,
            
            QUERY_LIST             : SettingsQuery.QUERY_LIST,
            QUERY_DEFAULT          : SettingsQuery.QUERY_DEFAULT,
            QUERY_POI              : SettingsQuery.QUERY_POI,
            
            POLYGON_STYLES         : SettingsStyles.POLYGON_STYLES,
            STYLES                 : SettingsStyles.STYLES,
            ALL_STYLES             : SettingsStyles.ALL_STYLES,
            
            ACTIONS                : SettingsActions.ACTIONS,
            
            markerStart            : markerStart,
            markerStop             : markerStop,
            leaflet                : leafletConf,
            ratioPixelPoint        : ratioPixelPoint,
            margin                 : margin,
            mapCategories          : mapCategories
        };
    }

    angular.module(moduleApp).factory('SettingsService', SettingsService);

    SettingsService.$inject = ['SettingsActions', 'SettingsColors', 'SettingsFonts', 'SettingsFormats', 
                        'SettingsQuery', 'SettingsStyles'];

})();