'use strict';

describe('Service: RadialMenuService', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var RadialMenuService;


    beforeEach(inject(function (_RadialMenuService_, _$rootScope_, _settings_, _FeatureService_, _MapService_) {
        RadialMenuService = _RadialMenuService_;
    }));

    it('should create the RadialMenuService service', function () {
        expect(RadialMenuService).toBeDefined();
        expect(RadialMenuService.drawMenu).toBeDefined();
        expect(RadialMenuService.addRadialMenu).toBeDefined();
        expect(RadialMenuService.hideRadialMenu).toBeDefined();
        expect(RadialMenuService.init).toBeDefined();
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
 