'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDer
 */
angular.module('accessimapEditeurDerApp')
    .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'settings', 'initSvg', 'shareSvg',
        function($scope, $rootScope, $location, settings, initSvg, shareSvg) {
            $scope.go = function(path) {
                $location.path(path).search('mapFormat', $scope.mapFormat).search('legendFormat', $scope.legendFormat);
            };

            $scope.formats = settings.FORMATS;
            $scope.mapFormat = 'landscapeA4';
            $scope.legendFormat = 'landscapeA4';

            $rootScope.iid = 1;

            $rootScope.getiid = function() {
                return $rootScope.iid++;
            };

            function createBlankSvg() {
                var mapFormat = $scope.mapFormat;
                var legendFormat = $scope.legendFormat;

                var widthMm = settings.FORMATS[mapFormat].width,
                        legendWidthMm = settings.FORMATS[legendFormat].width,
                        heightMm = settings.FORMATS[mapFormat].height,
                        legendHeightMm = settings.FORMATS[legendFormat].height,
                        margin = 40;

                var mapsvg = initSvg.createDetachedSvg(widthMm, heightMm);
                var legendsvg = initSvg.createDetachedSvg(widthMm, heightMm);
                initSvg.createDefs(mapsvg);

                // Load polygon fill styles taht will be used on common map
                angular.forEach(settings.POLYGON_STYLES, function(key) {
                        mapsvg.call(key);
                        legendsvg.call(key);
                });

                var width = widthMm / 0.283,
                        height = heightMm / 0.283,
                        legendWidth = legendWidthMm / 0.283,
                        legendHeight = legendHeightMm / 0.283;

                var legendContainter = legendsvg.append('g')
                        .attr('width', legendWidth)
                        .attr('height', legendHeight);
                initSvg.createLegendText(legendContainter, margin);

                var map = initSvg.createMapLayer(mapsvg, width, height);

                initSvg.createSource(map);
                initSvg.createDrawing(map);
                initSvg.createMargin(mapsvg, width, height);
                initSvg.createFrame(mapsvg, width, height);

                initSvg.createMargin(legendsvg, legendWidth, legendHeight);

                shareSvg.addMap(mapsvg.node())
                .then(function() {
                    shareSvg.addLegend(legendsvg.node())
                    .then(function() {
                            $location.path('/commonmap');
                    });
                });
            }

        $scope.createBlankSvg = createBlankSvg;

    }]);
