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
        this.getLastState = getLastState;
        this.resetState = resetState;

        this.historyUndo    = [];
        this.historyRedo    = [];
        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        function saveState() {
            var imageLayer = svgDrawing.select('g[data-name="images-layer"]')[0][0].innerHTML;
            var polygonsLayer = svgDrawing.select('g[data-name="polygons-layer"]')[0][0].innerHTML;
            var linesLayer = svgDrawing.select('g[data-name="lines-layer"]')[0][0].innerHTML;
            var pointsLayer = svgDrawing.select('g[data-name="points-layer"]')[0][0].innerHTML;
            var textsLayer = svgDrawing.select('g[data-name="texts-layer"]')[0][0].innerHTML;
            
            this.historyUndo.push({
                imageLayer: imageLayer,
                polygonsLayer: polygonsLayer,
                linesLayer: linesLayer,
                pointsLayer: pointsLayer,
                textsLayer: textsLayer
            })
        }

        function resetState() {
            console.log(this.historyUndo);

            var imageLayer = svgDrawing.select('[data-name="images-layer"]')[0][0];
            var polygonsLayer = svgDrawing.select('[data-name="polygons-layer"]')[0][0];
            var linesLayer = svgDrawing.select('[data-name="lines-layer"]')[0][0];
            var pointsLayer = svgDrawing.select('[data-name="points-layer"]')[0][0];
            var textsLayer = svgDrawing.select('[data-name="texts-layer"]')[0][0];

            var stateToUndo = this.historyUndo[this.historyUndo.length - 2];
            if (stateToUndo) {
                console.log(polygonsLayer);

                this.historyRedo.push(stateToUndo);
                imageLayer.innerHTML = stateToUndo.imageLayer;
                polygonsLayer.innerHTML = stateToUndo.polygonsLayer;
                linesLayer.innerHTML = stateToUndo.linesLayer;
                pointsLayer.innerHTML = stateToUndo.pointsLayer;
                textsLayer.innerHTML = stateToUndo.textsLayer;

                this.historyUndo.splice(this.historyUndo.length - 2, 1);
            } else {
                this.historyRedo.push({
                    imageLayer: imageLayer.innerHTML,
                    polygonsLayer: polygonsLayer.innerHTML,
                    linesLayer: linesLayer.innerHTML,
                    pointsLayer: pointsLayer.innerHTML,
                    textsLayer: textsLayer.innerHTML
                });

                imageLayer.innerHTML = '';
                polygonsLayer.innerHTML = '';
                linesLayer.innerHTML = '';
                pointsLayer.innerHTML = '';
                textsLayer.innerHTML = '';
            }
        }

        function getLastState() {
            return this.historyUndo[this.historyUndo.length -1]
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

})();