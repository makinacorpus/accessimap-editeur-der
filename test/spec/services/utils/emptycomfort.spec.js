'use strict';

describe('Service: EmptyComfortService', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var EmptyComfortService,
        GeneratorService;

    beforeEach(inject(function ($injector) {
        EmptyComfortService = $injector.get('EmptyComfortService');
        GeneratorService = $injector.get('GeneratorService');
    }));

    it('should create the EmptyComfortService service', function () {
        expect(EmptyComfortService).toBeDefined();
        expect(EmptyComfortService.calcEmptyComfort).toBeDefined();
    });

    describe('calcEmptyComfort method', function() {

        it('should create a white rectangle for a text feature, bigger of 7px than the original bbox', function() {

            // creation of the text feature
            var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            d3.select(svgElement)
                .append('text')
                .attr('x', 0)
                .attr('y', 0 - 35)
                .attr('font-family', 'Braille_2007')
                .attr('font-size', '35px')
                .attr('id', 'finalText')
                .classed('link_1', true)
                .attr('data-type', 'text')
                .attr('data-from', 'drawing')
                .attr('data-link', 1)
                .text('')
                    .append('tspan')
                    .attr('text-anchor', 'start')
                    .attr('dy', 35)
                    .text('pouet');

            var initialBBox = d3.select(svgElement).select('#finalText').node().getBBox();

            // expected result
            var result = EmptyComfortService.calcEmptyComfort(d3.select(svgElement).select('#finalText'))

            // compare result
            expect(parseInt(result.getAttribute('width'))).toBe(initialBBox.width + 2*7)
            expect(parseInt(result.getAttribute('height'))).toBe(initialBBox.height + 2*7)
            expect(parseInt(result.getAttribute('x'))).toBe(initialBBox.x - 7)
            expect(parseInt(result.getAttribute('y'))).toBe(initialBBox.y - 7)

        });

        it('should create a path extended for a line feature', function() {

            // creation of the line feature
            var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                linePoints = [ [0, 0], [ 10, 10 ], [ 10, 5 ]];

            d3.select(svgElement)
                .append('path')
                .attr('id', 'line')
                .attr('d', GeneratorService.pathFunction['line'](linePoints))
                .classed('link_1', true)
                .attr('data-type', 'line')
                .attr('data-from', 'drawing')
                .attr('data-link', 1)

            // expected result
            var result = EmptyComfortService.calcEmptyComfort(d3.select(svgElement).select('#line'))
            expect(result.getAttribute('style')).toBe('')
            expect(result.getAttribute('stroke-linejoin')).toBe('round')
            expect(result.getAttribute('stroke-linecap')).toBe('round')
            expect(result.getAttribute('stroke-width')).toBe('20')

        });

    })


});
