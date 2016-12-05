/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsColors
 * @description
 * # SettingsColors
 * Factory in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function SettingsColors () {

        var COLORS = {
            'black': [{
                name: 'Noir',
                color: 'black',
            }],
            'transparent': [{
                name: 'Transparent',
                color: 'none',
            }, {
                name: 'Blanc',
                color: 'white',
            }],
            'other': [{
                name: 'Bleu',
                color: 'blue',
            }, {
                name: 'Cyan',
                color: 'cyan',
            }, {
                name: 'Rouge',
                color: 'red',
            }, {
                name: 'Jaune',
                color: 'yellow',
            }, {
                name: 'Vert',
                color: 'limegreen',
            }, {
                name: 'Violet',
                color: 'purple',
            }
        ]}

        this.COLORS        = COLORS;
        this.DEFAULT_COLOR = COLORS.transparent[0];
        this.ALL_COLORS    = COLORS.black.concat(COLORS.transparent.concat(COLORS.other));

    }

    angular.module(moduleApp).service('SettingsColors', SettingsColors);

    SettingsColors.$inject = [];

})();
