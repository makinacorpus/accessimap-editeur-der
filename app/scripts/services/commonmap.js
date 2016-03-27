'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.CommonmapService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.shareSvg
 * @requires accessimapEditeurDerApp.reset
 * @description
 * Service linked to the controller accessimapEditeurDerApp.controller:CommonmapCtrl
 */
angular.module('accessimapEditeurDerApp')
    .service('CommonmapService', ['$location', 'shareSvg', 'settings', 'reset',
            function($location, shareSvg, settings, reset) {

        var _data = null;

        var zoomed = function() {

            /*if ($scope.menu) {
                $scope.menu.hide();
                $scope.menu = null;
            }*/

            d3.selectAll('.ongoing').remove();
            d3.select('#map-layer').attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
            d3.select('#frame-layer').attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');

        }

        var _zoom = d3.behavior.zoom()
            .translate([0, 0])
            .scale(1)
            .scaleExtent([1, 8])
            .on('zoom', zoomed);

        /**
         * @ngdoc method
         * @name  resetView
         * @methodOf accessimapEditeurDerApp.CommonmapService
         * @description  reset the view to his initial state
         */
        var resetView = function() {
            _zoom.scale(1)
                .translate([0, 0]);
            d3.select('#map-layer').attr('transform', null);
            d3.select('#frame-layer').attr('transform', null);
        };

        var init = function() {

            d3.select('#der')
                .selectAll('svg')
                .remove();

            // Transform the images into base64 so they can be exported
            if (d3.select('.tiles').node()) {
                d3.select('.tiles').selectAll('image')[0].forEach(function(tile) {
                    UtilService.convertImgToBase64(tile);
                });
            }

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
        
        return {
            init: init,
            resetView: resetView,
            settings: settings
        }
    }]);
