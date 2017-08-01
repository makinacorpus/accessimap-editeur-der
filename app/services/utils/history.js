/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.HistoryService
 * 
 * @description
 * Service exposing history functions to allow user to roll back
 */
(function() {
    'use strict';

    function HistoryService() {
        this.saveState  = saveState;
        this.init       = init;
        this.undoState  = undoState;
        this.redoState  = redoState;

        this.historyUndo    = [];
        this.historyRedo    = [];

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

        function saveState() {
            console.log(this)
            if (imageLayer && polygonsLayer && linesLayer && pointsLayer && textsLayer) {
                this.historyUndo.push({
                    imageLayer: imageLayer.innerHTML,
                    polygonsLayer: polygonsLayer.innerHTML,
                    linesLayer: linesLayer.innerHTML,
                    pointsLayer: pointsLayer.innerHTML,
                    textsLayer: textsLayer.innerHTML
                });
            }
        }

        function undoState() {
            this.historyRedo.push({
                imageLayer: imageLayer.innerHTML,
                polygonsLayer: polygonsLayer.innerHTML,
                linesLayer: linesLayer.innerHTML,
                pointsLayer: pointsLayer.innerHTML,
                textsLayer: textsLayer.innerHTML
            });

            var stateToUndo = this.historyUndo[this.historyUndo.length - 2];
            if (stateToUndo) {
                imageLayer.innerHTML = stateToUndo.imageLayer;
                polygonsLayer.innerHTML = stateToUndo.polygonsLayer;
                linesLayer.innerHTML = stateToUndo.linesLayer;
                pointsLayer.innerHTML = stateToUndo.pointsLayer;
                textsLayer.innerHTML = stateToUndo.textsLayer;

                this.historyUndo.splice(this.historyUndo.length - 2, 1);
            } else {
                imageLayer.innerHTML = '';
                polygonsLayer.innerHTML = '';
                linesLayer.innerHTML = '';
                pointsLayer.innerHTML = '';
                textsLayer.innerHTML = '';
            }
        }

        function redoState() {
            var stateToRedo = this.historyRedo[this.historyRedo.length - 1];
            if (stateToRedo) {
                this.historyUndo.push(stateToRedo);
                imageLayer.innerHTML = stateToRedo.imageLayer;
                polygonsLayer.innerHTML = stateToRedo.polygonsLayer;
                linesLayer.innerHTML = stateToRedo.linesLayer;
                pointsLayer.innerHTML = stateToRedo.pointsLayer;
                textsLayer.innerHTML = stateToRedo.textsLayer;

                this.historyRedo.splice(this.historyRedo.length - 1, 1);
            }
        }

        function getHistory() {
            return {
                redo: this.historyRedo,
                undo: this.historyUndo
            }
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

})();