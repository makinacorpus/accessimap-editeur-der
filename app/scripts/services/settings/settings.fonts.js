/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsFonts
 * @description
 */
(function() {
    'use strict';

    function SettingsFonts () {

        var FONTS = [{
                name: 'Braille',
                size: '35px',
                family: 'Braille_2007',
                weight: null,
                color: 'black'
            }, {
                name: 'Arial gras 32',
                size: '32px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 28',
                size: '28px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 22',
                size: '22px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 18',
                size: '18px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }
        ]
        
        this.FONTS = FONTS;

    }

    angular.module(moduleApp).service('SettingsFonts', SettingsFonts);

})();