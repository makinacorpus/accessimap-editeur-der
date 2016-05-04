/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LegendService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function LegendService() {

        this.initLegend        = initLegend;
        this.toggleFontBraille = toggleFontBraille;
        this.addToLegend       = addToLegend;
        this.removeFromLegend  = removeFromLegend;

        var _width,
            _height,
            _margin,
            _ratioPixelPoint,
            _fontBraille = false,
            _svg;

        /**
         * @ngdoc method
         * @name  initLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Create the legend svg in a dom element with specific size
         *
         * @param  {string} id     
         * id of element in which will be appended svg
         * 
         * @param  {integer} width  
         * width in millimeters of the svg created
         * 
         * @param  {integer} height 
         * height in millimeters of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         * @param  {integer} ratioPixelPoint 
         * ratioPixelPoint ? TODO please explain it...
         */
        function initLegend(id, width, height, margin, ratioPixelPoint) {
            
            _width = width;
            _height = height;
            _margin = margin;
            _ratioPixelPoint = ratioPixelPoint;
            
            _svg = d3.select(id).append('svg')
                    .attr('width', _width + 'mm')
                    .attr('height', _height + 'mm')
                    .attr('viewBox', '0 0 ' 
                                + (_width / _ratioPixelPoint) 
                                + ' ' 
                                + (_height / _ratioPixelPoint));

            _svg.append('text')
                    .attr('x', function() {
                        return _margin;
                    })
                    .attr('y', function() {
                        return _margin * 2;
                    })
                    // .attr('class', 'braille')
                    // .attr('font-family', 'Braille_2007')
                    .attr('font-size', '35px')
                    .text(function() {
                        return 'Légende';
                    })

            toggleFontBraille();

            return _svg;
        }

        function toggleFontBraille() {
            if (_fontBraille === true) {
                _svg.classed('braille', false)
                    .attr('font-family', 'Arial');
                _fontBraille = false;
            } else {
                _svg.classed('braille', true)
                    .attr('font-family', 'Braille_2007');
                _fontBraille = true;
            }
        }

        /**
         * @ngdoc method
         * @name  addToLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         * 
         * @description 
         * Add a text in the legend
         * 
         * @param {Object} query    [description]
         * @param {Object} style    [description]
         * @param {Object} position [description]
         */
        function addToLegend(query, style, position, colorChosen, checkboxModel) {
            var legendGroup = _svg.append('g')
                    .attr('class', 'legend')
                    .attr('id', query.id),
                symbol;

            switch(query.type) {
                case 'line':
                    symbol = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');

                    var symbolInner = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('class', 'inner')
                        .attr('fill', 'red');

                    angular.forEach(style.style, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbol.attr(k, v);
                    });

                    if (style.styleInner) {
                        angular.forEach(style.styleInner, function(attribute) {
                            var k = attribute.k,
                                v = attribute.v;

                            if (typeof(v) === 'function') {
                                v = v.url();
                            }
                            symbolInner.attr(k, v);
                        });
                    }
                    break;

                case 'point':
                    symbol = legendGroup.append('path')
                        .attr('cx',_margin * 2 + 20)
                        .attr('cy', position * 40 +_margin * 2 + style.radius / 2)
                        .attr('d', function() {
                            var x = parseFloat(d3.select(this).attr('cx')),
                                    y = parseFloat(d3.select(this).attr('cy'));

                            return style.path(x, y, style.radius);
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;

                case 'polygon':
                    symbol = legendGroup.append('rect')
                        .attr('x', function() {
                            return _margin * 2;
                        })
                        .attr('y', function() {
                            return position * 40 +_margin * 2;
                        })
                        .attr('width', function() {
                            return 40;
                        })
                        .attr('height', function() {
                            return 15;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;
            }

            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            if (checkboxModel && checkboxModel.contour && !symbol.attr('stroke')) {
                symbol
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            legendGroup
                .append('text')
                .attr('x', function() {
                    return _margin * 2 + 50;
                })
                .attr('y', function() {
                    return position * 40 +_margin * 2 + 20;
                })
                // .attr('font-family', 'Braille_2007')
                .attr('font-size', '35px')
                // .attr('class', 'braille')
                .text(function() {
                    return query.name;
                });
        }

        function removeFromLegend() {

        }

    }

    angular.module(moduleApp).service('LegendService', LegendService);

    LegendService.$inject = [];

})();