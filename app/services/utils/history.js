/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.HistoryService
 * 
 * @description
 * Service exposing history functions to allow user to roll back
 */
(function() {
    'use strict';

    function HistoryService($rootScope) {
        this.saveState  = saveState;
        this.init       = init;
        this.undoState  = undoState;
        this.redoState  = redoState;

        var historyUndo    = [];
        var historyRedo    = [];

        var maxHistorySize = 5;
        var svgDrawing,
            applyStyle,
            imageLayer,
            polygonsLayer,
            linesLayer,
            pointsLayer,
            textsLayer;

        function init(_svgDrawing) {
            svgDrawing = _svgDrawing;

            imageLayer = svgDrawing.select('[data-name="images-layer"]')[0][0];
            polygonsLayer = svgDrawing.select('[data-name="polygons-layer"]')[0][0];
            linesLayer = svgDrawing.select('[data-name="lines-layer"]')[0][0];
            pointsLayer = svgDrawing.select('[data-name="points-layer"]')[0][0];
            textsLayer = svgDrawing.select('[data-name="texts-layer"]')[0][0];
        }

        function cleanHistoryCache(arr) {
            if (arr.length > maxHistorySize) {
                arr.shift();
            }
            $rootScope.isUndoable = historyUndo.length > 1;
            $rootScope.isRedoable = historyRedo.length > 0;
            
            if (! $rootScope.$$phase) $rootScope.$digest()
        }

        function saveState() {
            if (imageLayer && polygonsLayer && linesLayer && pointsLayer && textsLayer) {
                historyUndo.push({
                    imageLayer: imageLayer.innerHTML,
                    polygonsLayer: polygonsLayer.innerHTML,
                    linesLayer: linesLayer.innerHTML,
                    pointsLayer: pointsLayer.innerHTML,
                    textsLayer: textsLayer.innerHTML
                });
                historyRedo = [];
                cleanHistoryCache(historyUndo)
            }
        }

        function undoState() {
            // On sauvegarde l'état actuel
            historyRedo.push({
                imageLayer: imageLayer.innerHTML,
                polygonsLayer: polygonsLayer.innerHTML,
                linesLayer: linesLayer.innerHTML,
                pointsLayer: pointsLayer.innerHTML,
                textsLayer: textsLayer.innerHTML
            });
            cleanHistoryCache(historyRedo);

            // On enlève le dernier élément car c'est l'état courant
            historyUndo.pop();            
            var indexToUndo = historyUndo.length - 1;

            // On remplace le svg dans le DOM par l'état précédent
            imageLayer.innerHTML = historyUndo[indexToUndo].imageLayer;
            polygonsLayer.innerHTML = historyUndo[indexToUndo].polygonsLayer;
            linesLayer.innerHTML = historyUndo[indexToUndo].linesLayer;
            pointsLayer.innerHTML = historyUndo[indexToUndo].pointsLayer;
            textsLayer.innerHTML = historyUndo[indexToUndo].textsLayer;

            cleanHistoryCache(historyUndo);
        }

        function redoState() {
            var stateToRedo = historyRedo[historyRedo.length - 1];
            if (stateToRedo) {
                // On remplace le svg dans le DOM par l'état précédent
                imageLayer.innerHTML = stateToRedo.imageLayer;
                polygonsLayer.innerHTML = stateToRedo.polygonsLayer;
                linesLayer.innerHTML = stateToRedo.linesLayer;
                pointsLayer.innerHTML = stateToRedo.pointsLayer;
                textsLayer.innerHTML = stateToRedo.textsLayer;

                // On remet l'état qu'on vient de restaurer dans undo pour pouvoir revenir à nouveau en arrière
                historyUndo.push({
                    imageLayer: imageLayer.innerHTML,
                    polygonsLayer: polygonsLayer.innerHTML,
                    linesLayer: linesLayer.innerHTML,
                    pointsLayer: pointsLayer.innerHTML,
                    textsLayer: textsLayer.innerHTML
                });

                // On enlève le dernier élément car il se trouve maintenant dans undo
                historyRedo.pop();
                cleanHistoryCache(historyUndo);
            }
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

    HistoryService.$inject = ['$rootScope']
})();