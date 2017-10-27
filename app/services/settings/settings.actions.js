/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsActions
 * @description
 */
(function() {
    'use strict';

    function SettingsActions (FeatureService, InteractionService, LegendService) {

        var ACTIONS = {
            'point': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject},
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePoint },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
            ],
            'line': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Modifier le tracé', icon: 'assets/icons/linear_scale.svg', action: FeatureService.movePoint },
                { name: 'Personnaliser les extrémités', icon: 'assets/icons/trending_flat.svg', action: FeatureService.toggleArrow },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Arondir les angles', icon: 'assets/icons/rounded_corner.svg', action: FeatureService.lineToCardinal },
            ],
            'polygon': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: '', icon: 'assets/icons/linear_scale.svg', action: FeatureService.movePoint },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { name: 'Modifier la couleur de fond', icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Ajouter/Supprimer le contour', icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'circle': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { name: 'Modifier la couleur de fond', icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Ajouter/Supprimer le contour', icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'rect': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { name: 'Modifier la couleur de fond', icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Ajouter/Supprimer le contour', icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'triangle': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { name: 'Modifier la couleur de fond', icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Ajouter/Supprimer le contour', icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'text': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
            ],
            'default': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: FeatureService.removeObject },
                { name: 'Déplacer', icon: 'assets/icons/open_with.svg', action: FeatureService.movePath },
                { name: 'Dupliquer', icon: 'assets/icons/copy.svg', action: FeatureService.duplicatePath },
                { name: 'Faire pivoter', icon: 'assets/icons/autorenew.svg', action: FeatureService.rotatePath },
                { name: '', icon: 'assets/icons/linear_scale.svg', action: FeatureService.movePoint },
                { name: 'Modifier la trame', icon: 'assets/icons/texture.svg', action: FeatureService.changePattern },
                { name: 'Modifier la couleur de fond', icon: 'assets/icons/palette.svg', action: FeatureService.changeColor },
                { name: 'Ajouter/Supprimer le vide de confort', icon: 'assets/icons/radio_button_checked.svg', action: FeatureService.toggleEmptyComfortNearFeature },
                { name: 'Ajouter une interaction', icon: 'assets/icons/hearing.svg', action: InteractionService.addInteraction },
                { name: 'Ajouter/Supprimer le contour', icon: 'assets/icons/crop_din.svg', action: FeatureService.toggleStroke },
            ],
            'legend': [
                { name: 'Supprimer', icon: 'assets/icons/delete.svg', action: LegendService.removeObject },
                { name: '', icon: 'assets/icons/arrow-up2.svg', action: LegendService.goUpObject },
                { name: '', icon: 'assets/icons/arrow-down2.svg', action: LegendService.goDownObject },
                { name: '', icon: 'assets/icons/draw_text.png', action: LegendService.editText },
            ]
        }

        this.ACTIONS = ACTIONS;
    }

    angular.module(moduleApp).service('SettingsActions', SettingsActions);

    SettingsActions.$inject = ['FeatureService', 'InteractionService', 'LegendService'];

})();
