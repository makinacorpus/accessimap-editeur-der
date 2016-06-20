/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxTextService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxTextService(RadialMenuService, GeneratorService, UtilService, $q) {

        this.writeText       = writeText;
        this.setTextEditable = setTextEditable;
        this.init            = init;

        var svgDrawing,
            applyStyle ;
        
        function init(_svgDrawing, _applyStyle) {
            svgDrawing = _svgDrawing;
            applyStyle = _applyStyle;
        }

        // TODO: Fréd, ça sert à quoi ?
        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function writeText(x, y, font, color) {
            
            // the previously edited text should not be edited anymore
            d3.select('.edition').classed('edition', false);

            var iid = UtilService.getiid(),

                textElement = svgDrawing.select('g[data-name="texts-layer"]')
                    .append('text')
                    .attr('x', x)
                    .attr('y', y - 35)
                    .attr('font-family', font.family)
                    .attr('font-size', font.size)
                    .attr('font-weight', function() {
                        return font.weight;
                    })
                    .attr('fill', color.color)
                    // .attr('id', 'finalText')
                    .classed('edition', true)
                    .classed('link_' + iid, true)
                    .attr('data-type', 'text')
                    .attr('data-from', 'drawing')
                    .attr('data-link', iid)
                    .text('');

            return setTextEditable(textElement);
            
        }

        function setTextEditable(textElement) {
            
            var deferred = $q.defer(),
                text = textElement.text() || 'Texte';

            textElement.text('')

            svgDrawing.select('g[data-name="texts-layer"]')
                .selectAll('foreignObject#textEdition')
                .data([text])
                    .enter()
                    .append('foreignObject')
                    .attr('id', 'textEdition')
                    .attr('x', textElement.attr('x'))
                    .attr('y',  textElement.attr('y'))
                    .attr('height', 500)
                    .attr('width', 500)
                    .attr('font-family', textElement.attr('font-family'))
                    .attr('font-size', textElement.attr('font-size'))
                    .attr('font-weight', textElement.attr('font-weight'))
                    .attr('fill', textElement.attr('fill'))
                    .classed('edition', true)
                    .append('xhtml:p')
                    .attr('contentEditable', 'true')
                    .text(text)
                    .on('click', function() {
                        d3.event.stopPropagation();
                    })
                    .on('mousedown', function() {
                        d3.event.stopPropagation();
                    })
                    .on('keydown', function() {
                        d3.event.stopPropagation();

                        if (d3.event.keyCode === 13 && !d3.event.shiftKey) {
                            this.blur();
                        }
                    })
                    .on('blur', function() {
                        angular.forEach(this.childNodes, function(node) {
                            var data = node.data;

                            if (data) {
                                data = data.replace(/(\d+)/g, '¤$1');
                                textElement
                                    .attr('text-anchor', 'start')
                                    .append('tspan')
                                        .attr('text-anchor', 'start')
                                        .attr('x', function() {
                                            return d3.select(this.parentNode).attr('x');
                                        })
                                        .attr('dy', 40)
                                        .text(data);
                            }
                        });
                        d3.select(this.parentElement).remove();

                        RadialMenuService.addRadialMenu(d3.select('.edition'));

                        d3.select('.edition').classed('edition', false);
                        textElement.style('cursor','text')
                            .on('click', function(event) {
                                // when we click in the text, we will enter the edition mode
                                d3.event.stopPropagation();
                                setTextEditable(d3.select(this))
                            })
                            .attr('id', null);

                        deferred.resolve(textElement);
                    });

            selectElementContents(
                d3.selectAll('foreignObject#textEdition')
                    .selectAll('p')
                    .node());

            return deferred.promise;
        }


    }
    
    angular.module(moduleApp).service('ToolboxTextService', ToolboxTextService);

    ToolboxTextService.$inject = ['RadialMenuService', 'GeneratorService', 'UtilService', '$q']

})();