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
                cleanHistoryCache(historyUndo)
            }
        }

        function undoState() {
            historyRedo.push({
                imageLayer: imageLayer.innerHTML,
                polygonsLayer: polygonsLayer.innerHTML,
                linesLayer: linesLayer.innerHTML,
                pointsLayer: pointsLayer.innerHTML,
                textsLayer: textsLayer.innerHTML
            });
            cleanHistoryCache(historyRedo);

            var indexToUndo = historyUndo.length - 2;
            if (!historyUndo[indexToUndo]) {
                indexToUndo = 0
            }

            imageLayer.innerHTML = historyUndo[indexToUndo].imageLayer;
            polygonsLayer.innerHTML = historyUndo[indexToUndo].polygonsLayer;
            linesLayer.innerHTML = historyUndo[indexToUndo].linesLayer;
            pointsLayer.innerHTML = historyUndo[indexToUndo].pointsLayer;
            textsLayer.innerHTML = historyUndo[indexToUndo].textsLayer;

            historyUndo.splice(indexToUndo, 1);
            cleanHistoryCache(historyUndo);
        }

        function redoState() {
            var stateToRedo = historyRedo[historyRedo.length - 1];
            if (stateToRedo) {
                var insertAtIndex = historyUndo.length - 2;
                if (historyUndo.length > 0) {
                    historyUndo.splice(insertAtIndex, 0, stateToRedo);
                    cleanHistoryCache(historyUndo);
                } else {
                    historyUndo.push(stateToRedo);
                }


                imageLayer.innerHTML = stateToRedo.imageLayer;
                polygonsLayer.innerHTML = stateToRedo.polygonsLayer;
                linesLayer.innerHTML = stateToRedo.linesLayer;
                pointsLayer.innerHTML = stateToRedo.pointsLayer;
                textsLayer.innerHTML = stateToRedo.textsLayer;

                historyRedo.splice(historyRedo.length - 1, 1);
            }
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

    HistoryService.$inject = ['$rootScope']
})();