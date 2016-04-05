'use strict';

describe('Service: radialMenu', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var radialMenu,
        $rootScope,
        initSvg,
        element,
        svg,
        shape,
        ctrlMock;

    beforeEach(inject(function (_radialMenu_, _$rootScope_, _initSvg_) {
        radialMenu = _radialMenu_;
        $rootScope = _$rootScope_;
        initSvg = _initSvg_;
        ctrlMock = {};

        // contains a map & a legend object
        svg = initSvg.createBlankSvg('landscapeA4','landscapeA4');

        
    }));

    it('should create the radialMenu service', function () {
        expect(radialMenu).toBeDefined();
        expect(radialMenu.drawMenu).toBeDefined();
        expect(radialMenu.addRadialMenu).toBeDefined();
    });

    describe('when the function addRadialMenu is called, it', function() {
        it('should create a contextmenu event handler', function() {

        })
    });

    describe('when the function drawMenu, it', function() {
        it('should draw the menu when contextmenu is fired', function() {

        })
    })
});
