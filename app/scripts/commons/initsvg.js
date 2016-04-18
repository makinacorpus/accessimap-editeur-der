(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.initSvg
     * @description Service allowing user to create svg elements
     */
    function initSvg(settings) {

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createBlankSvg
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @description Create a blank svg in a dom element with specific size
         *
         * @param  {Object} mapFormat    [description]
         * @param  {Object} legendFormat [description]
         * @return {Object} Object with map & legend svgs
         * { mapsvgNode, legendsvgNode }
         */
        this.createBlankSvg = function(mapFormat, legendFormat) {

            var widthMm = settings.FORMATS[mapFormat].width,
                    legendWidthMm = settings.FORMATS[legendFormat].width,
                    heightMm = settings.FORMATS[mapFormat].height,
                    legendHeightMm = settings.FORMATS[legendFormat].height,
                    margin = 40,

                mapsvg = this.createDetachedSvg(widthMm, heightMm),
                legendsvg = this.createDetachedSvg(widthMm, heightMm);

            this.createDefs(mapsvg);

            // Load polygon fill styles taht will be used on common map
            angular.forEach(settings.POLYGON_STYLES, function(key) {
                mapsvg.call(key);
                legendsvg.call(key);
            });

            var width = widthMm / settings.ratioPixelPoint,
                height = heightMm / settings.ratioPixelPoint,
                legendWidth = legendWidthMm / settings.ratioPixelPoint,
                legendHeight = legendHeightMm / settings.ratioPixelPoint,

                legendContainter = legendsvg.append('g')
                    .attr('width', legendWidth)
                    .attr('height', legendHeight);
                    
            this.createLegendText(legendContainter, margin);

            this.createFrame(mapsvg, width, height);
            var map = this.createMapLayer(mapsvg, width, height);

            this.createSource(map);
            this.createDrawing(map);
            this.createMargin(mapsvg, width, height);

            this.createMargin(legendsvg, legendWidth, legendHeight);

            return {
                map: mapsvg.node(),
                legend: legendsvg.node()
            }
        }

        
        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createSvg
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @description Create a svg in a dom element with specific size
         *
         * @param  {string} id     id of element in which will be appended svg
         * @param  {integer} width  width of the svg created
         * @param  {integer} height height of the svg created
         */
        this.createSvg = function(id, width, height) {
            return d3.select(id).append('svg')
                     .attr('width', width + 'mm')
                     .attr('height', height + 'mm')
                     .attr('viewBox', '0 0 ' 
                                        + (width / settings.ratioPixelPoint) 
                                        + ' ' 
                                        + (height / settings.ratioPixelPoint));
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createDetachedSvg
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {integer} width  [description]
         * @param  {integer} height [description]
         */
        this.createDetachedSvg = function(width, height) {
            return d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'))
                .attr('width', width + 'mm')
                .attr('height', height + 'mm')
                .attr('viewBox', '0 0 ' 
                                    + (width / settings.ratioPixelPoint) 
                                    + ' ' 
                                    + (height / settings.ratioPixelPoint));
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createMap
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @description Create a svg in the #map element with a specific size
         *
         * @param  {integer} width  width of the svg created
         * @param  {integer} height height of the svg created
         */
        this.createMap = function(width, height) {
            return this.createSvg('#map', width, height);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createLegend
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @description Create a svg in the #legend element with a specific size
         *
         * @param  {integer} width  width of the svg created
         * @param  {integer} height height of the svg created
         */
        this.createLegend = function(width, height) {
            return this.createSvg('#legend', width, height);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createLegendText
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} legendContainter  [description]
         * @param  {integer} margin [description]
         */
        this.createLegendText = function(legendContainter, margin) {
            legendContainter
                .append('text')
                .attr('x', function() {
                    return margin;
                })
                .attr('y', function() {
                    return margin * 2;
                })
                .attr('class', 'braille')
                .attr('font-family', 'Braille_2007')
                .attr('font-size', '35px')
                .text(function() {
                    return 'Légende';
                });
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createDefs
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         */
        this.createDefs = function(target) {
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
         * @name  accessimapEditeurDerApp.initSvg.createMargin
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         * @param  {integer} width  [description]
         * @param  {integer} height  [description]
         */
        this.createMargin = function(target, width, height) {
            var w40 = width - 40,
                h40 = height - 40,
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
                .attr('style', 'opacity:1;fill:#ffffff;fill-opacity:1')
                .attr('id', 'svgWhiteBorder')
                .classed('notDeletable', true);

        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createDrawing
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         */
        this.createDrawing = function(target) {
            var drawingGroup = target.append('g')
                .attr('id', 'drawing-layer');
            //.classed('rotable', true);

            drawingGroup.append('g')
                .attr('id', 'polygons-layer');
            drawingGroup.append('g')
                .attr('id', 'lines-layer');
            drawingGroup.append('g')
                .attr('id', 'points-layer');
            drawingGroup.append('g')
                .attr('id', 'text-layer');
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createFrame
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         * @param  {integer} width  [description]
         * @param  {integer} height  [description]
         */
        this.createFrame = function(target, width, height) {
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
                .attr('stroke', '#000000')
                .attr('stroke-width', '2.5px')
                .attr('stroke-opacity', '1')
                .attr('id', 'svgContainer')
                .classed('notDeletable', true);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createSource
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         */
        this.createSource = function(target) {
            return target.append('g')
                .attr('id', 'source-layer')
                .classed('rotable', true);
        };

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.initSvg.createMapLayer
         * @methodOf accessimapEditeurDerApp.initSvg
         *
         * @param  {Object} target  [description]
         * @param  {integer} width  [description]
         * @param  {integer} height  [description]
         */
        this.createMapLayer = function(target, width, height) {
            return target.append('g')
                .attr('id', 'map-layer')
                .attr('width', width)
                .attr('height', height);
        };
    }

    angular.module(moduleApp)
        .service('initSvg', initSvg);

    initSvg.$inject = ['settings', ];
})();