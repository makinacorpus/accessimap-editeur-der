'use strict';

describe('Service: initSvg', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var initSvg;
    beforeEach(inject(function (_initSvg_) {
        initSvg = _initSvg_;
    }));


    describe('the service', function() {

        it('should do something', function() {
            expect(!!initSvg).toBe(true);
        });

    });

    describe('when createMap is called, the map\'s svg', function() {
        var map, 
            mapSvg;

        beforeAll(function() {
            map = d3.select('body').append('div').attr('id', 'map');
            mapSvg = initSvg.createMap(500, 500);
        });

        it('should exist', function() {
            expect(mapSvg.empty()).not.toBe(true);
        });

        it('should have the correct height', function() {
            expect(mapSvg.attr('width')).toBe('500mm');
        });

        it('should have the correct width', function() {
            expect(mapSvg.attr('height')).toBe('500mm');
        });

    });

    describe('when createLegend is called, the legend\'s svg', function() {
        var legend,
            legendSvg;

        beforeAll(function() {
            legend = d3.select('body').append('div').attr('id', 'legend');
            legendSvg = initSvg.createLegend(500, 500);
        });

        it('should exist', function() {
            expect(legendSvg.empty()).not.toBe(true);
        });

        it('should have the correct height', function() {
            expect(legendSvg.attr('width')).toBe('500mm');
        });

        it('should have the correct width', function() {
            expect(legendSvg.attr('height')).toBe('500mm');
        });

    });

    describe('when createDefs is called', function() {
        var map,
            mapSvg;

        beforeAll(function() {
            map = d3.select('body').append('div').attr('id', 'map');
            mapSvg = initSvg.createMap(500, 500);
            initSvg.createDefs(mapSvg);
        });

        it('the defs should be added to the target', function() {
            expect(mapSvg.select('defs').empty()).not.toBe(true);
        });

    });

    describe('when createMArgin is called', function() {
        var map,
            mapSvg;

        beforeAll(function() {
            map = d3.select('body').append('div').attr('id', 'map');
            mapSvg = initSvg.createMap(500, 500);
            initSvg.createMargin(mapSvg, 500, 500);
        });

        it('the margin group should be created', function() {
            expect(mapSvg.select('#margin-layer').empty()).not.toBe(true);
        });

        it('the margin group should contain the white border', function() {
            expect(mapSvg.select('#margin-layer').select('#svgWhiteBorder').empty()).not.toBe(true);
        });

    });

    describe('when createFrame is called', function() {
        var map,
            mapSvg;

        beforeAll(function() {
            map = d3.select('body').append('div').attr('id', 'map');
            mapSvg = initSvg.createMap(500, 500);
            initSvg.createFrame(mapSvg, 500, 500);
        });

        it('the frame group should contain the black border', function() {
            expect(mapSvg.select('#frame-layer').select('#svgContainer').empty()).not.toBe(true);
        });

    });

});
