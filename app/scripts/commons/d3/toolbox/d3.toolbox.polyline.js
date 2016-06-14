/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxPolylineService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxPolylineService(RadialMenuService, GeneratorService, UtilService) {

        this.init                  = init;
        this.beginLineOrPolygon    = beginLineOrPolygon;
        this.drawHelpLineOrPolygon = drawHelpLineOrPolygon;
        this.finishLineOrPolygon   = finishLineOrPolygon;
        
        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }


        function beginLineOrPolygon(x, y, style, color, contour, mode, lastPoint, lineEdit) {
            var drawingLayer = svgDrawing.select('g[data-name="' + mode + 's-layer"]'),
                path,
                pathInner;

            // follow the line / polygon
            if (d3.select('.edition')[0][0]) {
                path = d3.select('.edition');

                if (mode === 'line') {
                    pathInner = d3.select('.edition.inner');
                }

            } else {
                // first click
                // lineEdit = [];
                path = drawingLayer
                        .append('path')
                        .attr({'class': 'edition'});

                applyStyle(path, style.style, color);

                if (contour && !path.attr('stroke')) {
                    path.attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }

                if (mode === 'line') {
                    pathInner = drawingLayer
                                .append('path')
                                .attr({'class': 'edition inner'});
                    applyStyle(pathInner, style.styleInner, color);
                }
            }
            
            if (lastPoint) {
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }
            }

            lineEdit.push([x, y]);
            path.attr({
                d: GeneratorService.pathFunction[mode](lineEdit)
            });

            if (mode === 'line') {
                pathInner.attr({
                    d: GeneratorService.pathFunction[mode](lineEdit)
                });
            }
            applyStyle(path, style.style, color);

            if (contour && !path.attr('stroke')) {
                path.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            if (mode === 'line') {
                applyStyle(pathInner, style.styleInner, color);
            }
        }

        function drawHelpLineOrPolygon(x, y, style, color, contour, mode, lastPoint) {
            if (lastPoint) {
                var drawingLayer = svgDrawing.select('g[data-name="' + mode + 's-layer"]'),
                    line;

                if (d3.select('.ongoing')[0][0]) {
                    line = d3.select('.ongoing');
                } else {
                    line = drawingLayer
                        .append('line')
                        .attr({'class': 'ongoing'});
                    applyStyle(line, style.style, color);

                    if (contour && !line.attr('stroke')) {
                        line.attr('stroke', 'black')
                            .attr('stroke-width', '2');
                    }
                }
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }

                line.attr('x1', lastPoint.x)
                    .attr('y1', lastPoint.y)
                    .attr('x2', x)
                    .attr('y2', y);
            }
        }

        function finishLineOrPolygon(x, y, style, color, mode) {
            var iid = UtilService.getiid();
            
            RadialMenuService.addRadialMenu(d3.select('.edition'));

            if (mode === 'line') {
                d3.select('.edition.inner')
                    .classed('edition', false)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid);
            }

            d3.select('.edition').attr('e-style', style.id)
                .attr('e-color', color.color);

            d3.select('.edition')
                .classed('edition', false)
                .classed('link_' + iid, true)
                .attr('data-type', mode)
                .attr('data-from', 'drawing')
                .attr('data-link', iid);

            d3.select('.ongoing').remove();
            
        }

    }
    
    angular.module(moduleApp).service('ToolboxPolylineService', ToolboxPolylineService);

    ToolboxPolylineService.$inject = ['RadialMenuService', 'GeneratorService', 'UtilService'];

})();