/*global textures */
// jscs:disable maximumLineLength
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsFormats
 * @requires accessimapEditeurDerApp.editSvg
 * @requires accessimapEditeurDerApp.InteractionService
 * @description
 * # SettingsFormats
 * Factory in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function SettingsFormats () {

        var 
        /**
         * @ngdoc property
         * @name  accessimapEditeurDerApp.SettingsFormats.FORMATS
         * @propertyOf accessimapEditeurDerApp.SettingsFormats
         * @description
         * Formats availables for editing documents.
         */
        FORMATS = {
            'portraitA4': {
                name: 'A4 Portrait',
                width: 210,
                height: 297
            },
            'landscapeA4': {
                name: 'A4 Paysage',
                width: 297,
                height: 210
            },
            'portraitA3': {
                name: 'A3 Portrait',
                width: 297,
                height: 420
            },
            'landscapeA3': {
                name: 'A3 Paysage',
                width: 420,
                height: 297
            },
            'nexus9': {
                name: 'Nexus 9 Paysage',
                width: 181, // 7.12"
                height: 136 // 5.35"
            }
        }
        
        this.FORMATS = FORMATS;

    }

    angular.module(moduleApp).service('SettingsFormats', SettingsFormats);

})();