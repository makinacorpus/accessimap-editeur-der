/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsFormats
 * 
 * @description
 * Provide different drawing formats
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
            'portraitA5': {
                name: 'A5 Portrait',
                orientation: 'portrait',
                width: 148,
                height: 210
            },
            'landscapeA5': {
                name: 'A5 Paysage',
                orientation: 'landscape',
                width: 210,
                height: 148
            },
            'portraitA4': {
                name: 'A4 Portrait',
                orientation: 'portrait',
                width: 210,
                height: 297
            },
            'landscapeA4': {
                name: 'A4 Paysage',
                orientation: 'landscape',
                width: 297,
                height: 210
            },
            'portraitA3': {
                name: 'A3 Portrait',
                orientation: 'portrait',
                width: 297,
                height: 420
            },
            'landscapeA3': {
                name: 'A3 Paysage',
                orientation: 'landscape',
                width: 420,
                height: 297
            },
            'landscapeTablet': {
                name: 'Format tablette 19x13',
                width: 190,
                height: 130
            },
            'nexus9': {
                name: 'Nexus 9 Paysage',
                orientation: 'landscape',
                width: 181, // 7.12"
                height: 136 // 5.35"
            }
        }
        
        this.FORMATS = FORMATS;

    }

    angular.module(moduleApp).service('SettingsFormats', SettingsFormats);

})();
