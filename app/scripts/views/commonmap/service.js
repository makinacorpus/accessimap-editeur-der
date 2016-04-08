/**
 * 
 * @ngdoc service
 * @name accessimapEditeurDerApp.CommonmapService
 * @requires $location
 * @requires accessimapEditeurDerApp.exportData
 * @requires accessimapEditeurDerApp.svgicon
 * @requires accessimapEditeurDerApp.shareSvg
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.reset
 * @requires accessimapEditeurDerApp.toolbox
 * @requires accessimapEditeurDerApp.interaction
 * @description
 * Service linked to the controller accessimapEditeurDerApp.controller:CommonmapController
 */
(function() {
    'use strict';

    function CommonmapService(
        $location, exportData, svgicon, shareSvg, settings, reset, toolbox, interaction, UtilService) {

        this.init                  = init;
        this.resetView             = resetView;
        this.settings              = settings;
        this.featureIcon           = svgicon.featureIcon;
        this.mapExport             = exportData.mapExport;
        this.resetActions          = reset.resetActions;
        
        // interactions
        this.interactiveFilters    = interaction.interactiveFilters;
        this.addFilter             = interaction.addFilter;
        this.removeRow             = interaction.removeRow;
        
        // toolbox
        this.changeTextColor       = toolbox.changeTextColor;
        this.updatePolygonStyle    = toolbox.updatePolygonStyle;
        this.updateMarker          = toolbox.updateMarker;
        this.addRadialMenus        = toolbox.addRadialMenus;
        this.undo                  = toolbox.undo;
        this.enablePointMode       = toolbox.enablePointMode;
        this.enableCircleMode      = toolbox.enableCircleMode;
        this.enableLinePolygonMode = toolbox.enableLinePolygonMode;
        this.enableTextMode        = toolbox.enableTextMode;


        var _data = null,

            _zoom = d3.behavior.zoom()
                    .translate([0, 0])
                    .scale(1)
                    .scaleExtent([1, 8])
                    .on('zoom', _zoomed);

        function _zoomed() {

            toolbox.hideRadialMenu();
            
            d3.selectAll('.ongoing').remove();
            d3.select('#map-layer')
                .attr('transform',
                    'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
            d3.select('#frame-layer')
                .attr('transform',
                    'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        /**
         * @ngdoc method
         * @name  resetView
         * @methodOf accessimapEditeurDerApp.CommonmapService
         * @description  reset the view to his initial state
         */
        function resetView() {
            _zoom.scale(1)
                .translate([0, 0]);
            d3.select('#map-layer').attr('transform', null);
            d3.select('#frame-layer').attr('transform', null);
        }

        /**
         * @ngdoc method
         * @name  init
         * @methodOf accessimapEditeurDerApp.CommonmapService
         * @description  init the view by retrieving stored map and legend
         */
        function init() {

            d3.select('#der')
                .selectAll('svg')
                .remove();

            // Transform the images into base64 so they can be exported
            if (d3.select('.tiles').node()) {
                d3.select('.tiles')
                    .selectAll('image')[0]
                    .forEach(function(tile) {
                        UtilService.convertImgToBase64(tile);
                    });
            };

            // retrieve map and display it
            shareSvg
                .getMap()
                .then(function(data) {
                    if (data) {
                        _data = data;

                        d3.select('#der')
                            .node()
                            .appendChild(data);

                        d3.select('#der')
                            .select('svg')
                            .call(_zoom)
                            .on('dblclick.zoom', null);
                    } else {
                        $location.path('/'); // ?
                    }
                });

            // retrieve legend and display it
            shareSvg
                .getLegend()
                .then(function(data) {
                    if (data) {
                        d3.select('#der-legend')
                            .node()
                            .appendChild(data);
                    }
                });

            // listen to escape key and reset actions when fire up
            d3.select('body').on('keyup', function() {
                if (d3.event.keyCode === 27 /* ESC */) {
                    reset.resetActions();
                }
            });
        }
    
    }

    angular.module('accessimapEditeurDerApp')
            .service('CommonmapService',CommonmapService);

    CommonmapService.$inject = ['$location', 'exportData', 'svgicon',
                        'shareSvg', 'settings', 'reset', 'toolbox', 'interaction', 'UtilService'];

})();