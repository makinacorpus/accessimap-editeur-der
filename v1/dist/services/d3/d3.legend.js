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

    function LegendService(SettingsStyles) {

        this.init            = init;
        this.getSize         = getSize;
        this.getModel        = getModel;

        this.showFontBraille = showFontBraille;
        this.hideFontBraille = hideFontBraille;

        this.addItem         = addItem;
        this.updateItem      = updateItem;
        this.removeItem      = removeItem;

        this.removeObject    = removeObject;
        this.goDownObject    = goDownObject;
        this.goUpObject      = goUpObject;

        this.setFormat       = setFormat;

        this.editText        = editText;

        this.drawLegend      = drawLegend;

        this.getNode         = function() { return _svg !== undefined ? _svg.node() : undefined }

        var _width,
            _height,
            _margin,
            _ratioPixelPoint,
            _fontBraille,
            _svg,
            _model = [],
            _addRadialMenuFunction,
            frameGroup;

        /**
         * @ngdoc method
         * @name  init
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
        function init(id, width, height, margin, ratioPixelPoint, addRadialMenuFunction) {

            _width                 = width / ratioPixelPoint;
            _height                = height / ratioPixelPoint;
            _margin                = margin;
            _ratioPixelPoint       = ratioPixelPoint;
            _addRadialMenuFunction = addRadialMenuFunction;

            _svg = d3.select(id).append('svg');

            setFormat(_width, _height);

            showFontBraille();

            return _svg;
        }

        /**
         * @ngdoc method
         * @name  showFontBraille
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Show the 'braille' font on the legend's svg.
         */
        function showFontBraille() {

            _svg.classed('braille', true)
                .attr('font-family', 'Braille_2007');

        }

        /**
         * @ngdoc method
         * @name  hideFontBraille
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Hide the 'braille' font on the legend's svg and display it in Arial
         */
        function hideFontBraille() {

            _svg.classed('braille', false)
                .attr('font-family', 'Arial');

        }

        /**
         * @ngdoc method
         * @name  setFormat
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Draw a frame linked to the width & height arguments
         *
         * @param  {integer} width
         * Width in pixel of the printing format
         *
         * @param  {integer} height
         * Height in pixel of the printing format
         */
        function setFormat(width, height) {

            _width = width;
            _height = height;

            _svg.attr('width', _width)
                .attr('height', _height)
                .attr('viewBox', '0 0 ' + _width + ' ' + _height);

            drawLegend();

        }

        /**
         * @ngdoc method
         * @name  createFramePath
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Create a frame of the legend, telling user about the print format
         */
        function createFramePath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            frameGroup  = _svg.append('g')
                .append('path')
                .attr('d', function() {
                    return 'M ' + _margin + ' ' + _margin + ' L '
                                    + w40
                                    + ' ' + _margin + ' L '
                                    + w40
                                    + ' '
                                    + h40
                                    + ' L ' + _margin + ' '
                                    + h40
                                    + ' L ' + _margin + ' ' + _margin + ' z';
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
         * @name  getSize
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * return the size of the layer, representing the size of the legend
         *
         * @return {Object}
         * {width, height}
         *
         */
        function getSize() {
            return {width: _width, height: _height}
        }
        /**
         * @ngdoc method
         * @name  getModel
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * return a clone of the current array of items
         *
         * @return {Array}
         * The model
         *
         */
        function getModel() {
            return _model.slice()
        }

        /**
         * @ngdoc method
         * @name  addItem
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Add an item in the model, and redraw the legend
         *
         */
        function addItem(id, name, type, style, color, contour) {

            _model.push({
                id       : id,
                name     : name,
                type     : type,
                style    : style,
                color    : color,
                contour  : contour
            })

            drawLegend();

        }

        /**
         * @ngdoc method
         * @name  addItem
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Remove an item from the model, thanks to the id params
         *
         */
        function removeItem(id) {

            _model = _model.filter(function filterModel(currentItem, index) {
                return currentItem.id !== id
            })

            drawLegend();
        }

        /**
         * @ngdoc method
         * @name  addItem
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Update an item from the model, thanks to the id params
         *
         */
        function updateItem(id, name, type, style, color, contour) {

            var itemToUpdate = _model.find(function findItem(currentItem) { return currentItem.id === id })

            itemToUpdate.name = name;
            itemToUpdate.type = type;
            itemToUpdate.style = style;
            itemToUpdate.color = color;
            itemToUpdate.contour = contour;

            drawLegend();
        }

        /**
         * @ngdoc method
         * @name  drawLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Draw the legend, based on the _model array.
         *
         */
        function drawLegend() {

            _svg.selectAll('*').remove();

            createFramePath();

            _svg.append('text')
                .attr('x', function() {
                    return _margin;
                })
                .attr('y', function() {
                    return _margin * 2;
                })
                .attr('font-size', '35px')
                .text(function() {
                    return 'Légende';
                })

            _model.forEach(function(item, index, array) {

                var legendGroup = _svg.append('g')
                        // .attr('id', query.id) // TODO: see if it's useful ?
                        .attr('class', 'legend')
                        .attr('data-type', 'legend')
                        .attr('data-link', item.id),
                    symbol;

                switch(item.type) {
                    case 'line':
                        symbol = legendGroup.append('line')
                            .attr('x1', function() {
                                return _margin * 2;
                            })
                            .attr('y1', function() {
                                return ( index + 1 ) * 40 +_margin * 2;
                            })
                            .attr('x2', function() {
                                return _margin * 2 + 40;
                            })
                            .attr('y2', function() {
                                return ( index + 1 ) * 40 +_margin * 2;
                            })
                            .attr('class', 'symbol')
                            .attr('fill', 'red');

                        var symbolInner = legendGroup.append('line')
                            .attr('x1', function() {
                                return _margin * 2;
                            })
                            .attr('y1', function() {
                                return ( index + 1 ) * 40 +_margin * 2;
                            })
                            .attr('x2', function() {
                                return _margin * 2 + 40;
                            })
                            .attr('y2', function() {
                                return ( index + 1 ) * 40 +_margin * 2;
                            })
                            .attr('class', 'symbol')
                            .attr('class', 'inner')
                            .attr('fill', 'red');

                        angular.forEach(item.style.style, function(attribute) {
                            var k = attribute.k,
                                v = attribute.v;

                            if (typeof(v) === 'function') {
                                v = v.url();
                            }
                            symbol.attr(k, v);
                        });

                        if (item.style.styleInner) {
                            angular.forEach(item.style.styleInner, function(attribute) {
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
                            .attr('cy', ( index + 1 ) * 40 +_margin * 2 + item.style.radius / 2)
                            .attr('d', function() {
                                var x = parseFloat(d3.select(this).attr('cx')),
                                    y = parseFloat(d3.select(this).attr('cy'));

                                return item.style.path(x, y, item.style.radius);
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
                                return ( index + 1 ) * 40 +_margin * 2 - 15;
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

                angular.forEach(item.style.style, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        if (item.color && item.color.color !== 'none') {
                            v += '_' + item.color.color;
                        }
                        symbol.attr('fill', SettingsStyles.POLYGON_STYLES[v].url());
                    } else {
                        symbol.attr(k, v);
                    }
                });

                if (item.contour && !symbol.attr('stroke')) {
                    symbol.attr('stroke', 'black')
                          .attr('stroke-width', '2');
                }

                legendGroup
                    .append('text')
                    .attr('x', function() {
                        return _margin * 2 + 50;
                    })
                    .attr('y', function() {
                        return ( index + 1 )* 40 +_margin * 2 ;
                    })
                    .attr('font-size', '35px')
                    .text(function() {
                        return item.name;
                    })

                if (_addRadialMenuFunction)
                    _addRadialMenuFunction(legendGroup, _svg)

            })

        }

        function removeObject(target) {
            removeItem(target.attr('data-link'))
        }

        function goDownObject(target) {
            var currentId = target.attr('data-link'),
                currentIndex = _model.findIndex(function findIndex(currentItem, index) {
                    return currentItem.id === currentId
                })

            if (_model.length >= 2 && currentIndex < _model.length - 1) {
                var currentItem = _model[currentIndex],
                    itemToMove = _model[currentIndex + 1]

                _model[currentIndex + 1] = currentItem;
                _model[currentIndex] = itemToMove;
            }

            drawLegend()

        }

        function goUpObject(target) {

            var currentId = target.attr('data-link'),
                currentIndex = _model.findIndex(function findIndex(currentItem, index) {
                    return currentItem.id === currentId
                })

            if (_model.length >= 2 && currentIndex > 0) {
                var currentItem = _model[currentIndex],
                    itemToMove = _model[currentIndex - 1]

                _model[currentIndex - 1] = currentItem;
                _model[currentIndex] = itemToMove;
            }

            drawLegend()

        }

        /**
         * @ngdoc method
         * @name  editText
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Enable the edition of the legend's item text
         *
         * @param  {Object} target
         * Item in the legend which text will be edited
         */
        function editText(target) {

        }

    }

    angular.module(moduleApp).service('LegendService', LegendService);

    LegendService.$inject = ['SettingsStyles'];

})();
