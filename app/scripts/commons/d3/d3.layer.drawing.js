/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerDrawingService
 * @requires accessimapEditeurDerApp.LayerService
 * 
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function LayerDrawingService() {

        var _target,
            _g;

        this.createLayer = createLayer;

        function createLayer(target) {
            
            _target = target;

            _g = _target.attr("data-name", "drawing-layer")
                        .attr("id", "drawing-layer");

            createDrawing();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayersService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayersService
         *
         * @param  {Object} target  [description]
         */
        function createDrawing() {
            _g.append('g').attr('data-name', 'polygons-layer');
            _g.append('g').attr('data-name', 'lines-layer');
            _g.append('g').attr('data-name', 'points-layer');
            _g.append('g').attr('data-name', 'text-layer');
        };

    }

    angular.module(moduleApp).service('LayerDrawingService', LayerDrawingService);

    LayerDrawingService.$inject = [];

})();