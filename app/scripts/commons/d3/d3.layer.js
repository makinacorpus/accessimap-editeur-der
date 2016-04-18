/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerService
 * @description
 * Service providing layer functions to add
 * - defs
 * - 
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function LayerService() {

        this.createDefs     = createDefs;
        this.createMargin   = createMargin;
        this.createDrawing  = createDrawing;
        this.createFrame    = createFrame;
        this.createSource   = createSource;
        this.createMapLayer = createMapLayer;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createDefs
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  [description]
         */
        function createDefs(target) {
            var defs = target.append('defs');

            defs.append('marker')
                    .attr('id', 'arrowStartMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M9,1 L5,5 9,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            defs.append('marker')
                    .attr('id', 'arrowStopMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L5,5 1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            defs.append('marker')
                    .attr('id', 'straightMarker')
                    .attr('refX', 1)
                    .attr('refY', 5)
                    .attr('markerWidth', 2)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createMargin
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  d3 area
         * @param  {integer} width  Width of the d3 area
         * @param  {integer} height  Height of the d3 area
         * @param  {integer} margin  Margin wished
         */
        function createMargin(target, width, height, margin) {
            var w40 = width - margin,
                h40 = height - margin,
                marginGroup = target.append('g')
                                    .attr('id', 'margin-layer')
                                    .attr('width', width)
                                    .attr('height', height);

            marginGroup.append('path')
                .attr('d', function() {
                    var outer = 'M 0 0 L 0 ' 
                                    + height 
                                    + ' L ' 
                                    + width 
                                    + ' ' 
                                    + height 
                                    + ' L ' 
                                    + width 
                                    + ' 0 L 0 0 z ',
                        inner = 'M 40 40 L ' 
                                    + w40 
                                    + ' 40 L ' 
                                    + w40 
                                    + ' ' 
                                    + h40 
                                    + ' L 40 ' 
                                    + h40 
                                    + ' L 40 40 z';

                    return outer + inner;
                })
                .attr('style', 'opacity:.75;fill:#ffffff;fill-opacity:.75')
                .attr('id', 'svgWhiteBorder')
                .classed('notDeletable', true);

        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  [description]
         */
        function createDrawing(_g) {
            // var drawingGroup = target.append('g')
            //     .attr('id', 'drawing-layer');
            // //.classed('rotable', true);

            _g.append('g')
                .attr('id', 'polygons-layer');
            _g.append('g')
                .attr('id', 'lines-layer');
            _g.append('g')
                .attr('id', 'points-layer');
            _g.append('g')
                .attr('id', 'text-layer');
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createFrame
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  [description]
         * @param  {integer} width  [description]
         * @param  {integer} height  [description]
         */
        function createFrame(target, width, height) {
            var w40 = width - 40,
                h40 = height - 40,
                frameGroup = target.append('g')
                                    .attr('id', 'frame-layer');

            frameGroup.append('path')
                .attr('d', function() {
                    return 'M 40 40 L ' 
                                    + w40 
                                    + ' 40 L ' 
                                    + w40 
                                    + ' ' 
                                    + h40 
                                    + ' L 40 ' 
                                    + h40 
                                    + ' L 40 40 z';
                })
                .attr('fill', 'none')
                .attr('opacity', '.75')
                .attr('stroke', '#000000')
                .attr('stroke-width', '2px')
                .attr('stroke-opacity', '1')
                .attr('id', 'svgContainer')
                .classed('notDeletable', true);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createSource
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  [description]
         */
        function createSource(target) {
            return target.append('g')
                .attr('id', 'source-layer')
                .classed('rotable', true);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerService.createMapLayer
         * @methodOf accessimapEditeurDerApp.LayerService
         *
         * @param  {Object} target  [description]
         * @param  {integer} width  [description]
         * @param  {integer} height  [description]
         */
        function createMapLayer(target, width, height) {
            return target.append('g')
                .attr('id', 'map-layer')
                .attr('width', width)
                .attr('height', height);
        };
    }

    angular.module(moduleApp).service('LayerService', LayerService);

    LayerService.$inject = [];

})();