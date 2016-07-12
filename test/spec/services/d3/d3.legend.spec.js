'use strict';

describe('Service: LegendService', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var LegendService, settings;

    beforeEach(inject(function ($injector) {

        LegendService = $injector.get('LegendService');
        settings = $injector.get('SettingsService')

        var legend = document.createElement('div');
        legend.setAttribute('id', 'legend');
        document.body.appendChild(legend)

    }));

    it('should do something', function () {
        expect(LegendService).toBeDefined();
        expect(LegendService.init).toBeDefined();
        expect(LegendService.getSize).toBeDefined();
        expect(LegendService.showFontBraille).toBeDefined();
        expect(LegendService.hideFontBraille).toBeDefined();
        expect(LegendService.addItem).toBeDefined();
        expect(LegendService.updateItem).toBeDefined();
        expect(LegendService.removeItem).toBeDefined();
        expect(LegendService.removeObject).toBeDefined();
        expect(LegendService.goDownObject).toBeDefined();
        expect(LegendService.goUpObject).toBeDefined();
        expect(LegendService.setFormat).toBeDefined();
        expect(LegendService.drawLegend).toBeDefined();
        expect(LegendService.getNode).toBeDefined();
        expect(LegendService.editText).toBeDefined();
    });

    describe('the getNode function', function() {

        it('should return undefined if init has not been made', function() {

            expect(LegendService.getNode()).toBe(undefined);
        });

    })

    describe('the init function', function() {

        it('should create a svg of a specific dimension', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)
            expect(svg).toBeDefined();
            expect(parseInt(svg.attr('width'))).toBe(200 / 0.5);
            expect(parseInt(svg.attr('height'))).toBe(300 / 0.5);
            expect(svg.attr('viewBox')).toBe('0 0 ' + (200 / 0.5) + ' ' + (300 / 0.5));
            expect(svg.attr('font-family')).toBe('Braille_2007');
            expect(svg.classed('braille')).toBe(true);
        });

    })

    describe('the hideFontBraille function', function() {

        it('should change the font & remove the class braille', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)
            LegendService.hideFontBraille();

            expect(svg.attr('font-family')).toBe('Arial');
            expect(svg.classed('braille')).toBe(false);
        });

    })

    describe('the showFontBraille function', function() {

        it('should change the font & remove the class braille', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)
            LegendService.hideFontBraille();
            LegendService.showFontBraille();

            expect(svg.attr('font-family')).toBe('Braille_2007');
            expect(svg.classed('braille')).toBe(true);

        });

    })

    describe('the getSize function', function() {

        it('should return the {width, height} of the current legend', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)

            expect(LegendService.getSize()).toEqual({width: ( 200/0.5 ), height: (300/0.5)});

        });

    })

    describe('the getModel function', function() {

        it('should return an empty array after initalising the service', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)

            expect(Array.isArray(LegendService.getModel())).toBe(true);
            expect(LegendService.getModel().length).toBe(0);

        });

    })

    describe('the addItem function', function() {

        it('should add the item to the model', function() {

            LegendService.init('#legend', 200, 300, 10, 0.5)
            LegendService.addItem('1', 'pouet', 'line', settings.STYLES.point[0], null, true)

            expect(Array.isArray(LegendService.getModel())).toBe(true);
            expect(LegendService.getModel().length).toBe(1);
            expect(LegendService.getModel()[0].id).toBe('1');
            expect(LegendService.getModel()[0].name).toBe('pouet');
            expect(LegendService.getModel()[0].type).toBe('line');
            expect(LegendService.getModel()[0].style).toBe(settings.STYLES.point[0]);
            expect(LegendService.getModel()[0].color).toBe(null);
            expect(LegendService.getModel()[0].contour).toBe(true);

        })

        it('should draw the item to the legend', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)

            expect(svg.selectAll('g.legend')[0].length).toBe(0)

            LegendService.addItem('1', 'pouet', 'line', settings.STYLES.point[0], null, true)

            expect(svg.selectAll('g.legend')[0].length).toBe(1)

        })
    })

    describe('the editText function', function() {

        it('should enable the modification of the selected item', function() {

            var svg = LegendService.init('#legend', 200, 300, 10, 0.5)

            // add an item in the legend
            LegendService.addItem('1', 'pouet', 'line', settings.STYLES.point[0], null, true)
            expect(LegendService.getModel()[0].name).toBe('pouet');

            console.log(svg)

            // select & enable the edition mode to the text of this item
            LegendService.editText('1');

            // check the text is now 'editable'

            // edit the text & see if it has been modified

        })

    })

    describe('the updateItem function', function() {



    })


});
