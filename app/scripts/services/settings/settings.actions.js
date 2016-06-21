/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsActions
 * @description
 */
(function() {
    'use strict';

    function SettingsActions (FeatureService, InteractionService) {

        var ACTIONS = {
            'point': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject},
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { icon: 'assets/icons/texture.svg', action: FeatureService.changePoint },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
            ],
            'line': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/linear_scale.svg', action: FeatureService.movePoint },
                { icon: 'assets/icons/trending_flat.svg', action: FeatureService.toggleArrow },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/rounded_corner.svg', action: FeatureService.lineToCardinal },
            ],
            'polygon': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/linear_scale.svg', action: FeatureService.movePoint },
                { icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'circle': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'rect': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/toolbox_skew.svg', action: FeatureService.skew },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'triangle': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/toolbox_skew.svg', action: FeatureService.skew },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'text': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
            ],
            'default': [
                { icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
                { icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
            ]
        }

        this.ACTIONS = ACTIONS;
    }

    angular.module(moduleApp).service('SettingsActions', SettingsActions);

    SettingsActions.$inject = ['FeatureService', 'InteractionService'];

})();