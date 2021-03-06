/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DefsService
 * 
 * @description
 * Service provinding a method to add 'definitions' patterns to a svg
 */
(function() {
    'use strict';

    function DefsService(SettingsService) {

        this.createDefs = createDefs;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.DefsService.createDefs
         * @methodOf accessimapEditeurDerApp.DefsService
         *
         */
        function createDefs(node) {
            
            var _svg = node.append('svg'),
                _defs = _svg.attr("data-name", "defs")
                            .append("defs");

            _defs.append('marker')
                    .attr('id', 'arrowStartMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M9,1 L5,5 9,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'arrowStopMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L5,5 1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'straightMarker')
                    .attr('refX', 1)
                    .attr('refY', 5)
                    .attr('markerWidth', 2)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            Object.keys(SettingsService.POLYGON_STYLES).forEach(function(value, index, array) {
                _defs.call(SettingsService.POLYGON_STYLES[value]);
            });

            return _svg;

        }

    }

    angular.module(moduleApp).service('DefsService', DefsService);

    DefsService.$inject = ['SettingsService'];

})();
