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

        var historyUndo    = {d: [], g: []};
        var historyRedo    = {d: [], g: []};

        var maxHistorySize = 5;
        var svgDrawing,
            applyStyle,
            d = {
                imageLayer: null,
                polygonsLayer: null,
                linesLayer: null,
                pointsLayer: null,
                textsLayer: null,
            },
            g = {
                imageLayer: null,
                polygonsLayer: null,
                linesLayer: null,
                pointsLayer: null,
                textsLayer: null,
            };

        function init(_svgDrawing) {
            svgDrawing = _svgDrawing;

            // Draw elements
            d.imageLayer = svgDrawing.select('#drawing-layer [data-name="images-layer"]')[0][0];
            d.polygonsLayer = svgDrawing.select('#drawing-layer [data-name="polygons-layer"]')[0][0];
            d.linesLayer = svgDrawing.select('#drawing-layer [data-name="lines-layer"]')[0][0];
            d.pointsLayer = svgDrawing.select('#drawing-layer [data-name="points-layer"]')[0][0];
            d.textsLayer = svgDrawing.select('#drawing-layer [data-name="texts-layer"]')[0][0];

            // Geojson elements
            g.polygonsLayer = svgDrawing.select('#geojson-layer [data-name="polygons-layer"]')[0][0];
            g.linesLayer = svgDrawing.select('#geojson-layer [data-name="lines-layer"]')[0][0];
            g.pointsLayer = svgDrawing.select('#geojson-layer [data-name="points-layer"]')[0][0];
            g.textsLayer = svgDrawing.select('#geojson-layer [data-name="texts-layer"]')[0][0];
        }

        function drawLayer() {
            return d.imageLayer && d.polygonsLayer && d.linesLayer && d.pointsLayer && d.textsLayer
        }

        function geojsonLayer() {
            return g.polygonsLayer && g.linesLayer && g.pointsLayer && g.textsLayer
        }

        function cleanHistoryCache(obj) {
            if (obj.d.length > maxHistorySize) {
                obj.d.shift();
            }
            if (obj.g.length > maxHistorySize) {
                obj.g.shift();
            }
            $rootScope.isUndoable = historyUndo.d.length > 1;
            $rootScope.isRedoable = historyRedo.d.length > 0;
            
            if (! $rootScope.$$phase) $rootScope.$digest()
        }

        function getLayersInnerHtml(group) {
            return {
                // imageLayer: group.imageLayer.innerHTML,
                polygonsLayer: group.polygonsLayer.innerHTML,
                linesLayer: group.linesLayer.innerHTML,
                pointsLayer: group.pointsLayer.innerHTML,
                textsLayer: group.textsLayer.innerHTML,
            }
        }

        function updateDOMelement(group, newState) {
            console.log(group, newState)
            // group.imageLayer.innerHTML = newState.imageLayer;
            group.polygonsLayer.innerHTML = newState.polygonsLayer;
            group.linesLayer.innerHTML = newState.linesLayer;
            group.pointsLayer.innerHTML = newState.pointsLayer;
            group.textsLayer.innerHTML = newState.textsLayer;
        }

        function saveState() {
            if (drawLayer()) {
                historyUndo.d.push(getLayersInnerHtml(d));
            }

            if (geojsonLayer()) {
                historyUndo.g.push(getLayersInnerHtml(g));
            }
            
            // Reset redo state when new action is fired
            historyRedo = {d: [], g: []};
            cleanHistoryCache(historyUndo)
        }

        function undoState() {
            // Save current state
            if (drawLayer()) {
                historyRedo.d.push(getLayersInnerHtml(d));
            }
            if (geojsonLayer()) {
                historyRedo.g.push(getLayersInnerHtml(g));
            }

            cleanHistoryCache(historyRedo);

            // Remove last item because it's current state
            historyUndo.d.pop();         
            historyUndo.g.pop();         

            // Replace SVG on DOM
            var indexToUndo = historyUndo.d.length - 1;
            updateDOMelement(d, historyUndo.d[indexToUndo]);
            // updateDOMelement(g, historyUndo.g[indexToUndo]);

            cleanHistoryCache(historyUndo);
        }

        function redoState() {
            var stateToRedoD = historyRedo.d[historyRedo.d.length - 1];

            if (stateToRedoD) {
                // Replace SVG on DOM
                var indexToUndo = historyRedo.d.length - 1
                updateDOMelement(d, historyRedo.d[indexToUndo]);

                // Restaure state in undo
                historyUndo.d.push(getLayersInnerHtml(d));

                // Remove last item in redo because it's now in undo
                historyRedo.d.pop();
                historyRedo.g.pop();
                cleanHistoryCache(historyUndo);
            }
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

    HistoryService.$inject = ['$rootScope']
})();