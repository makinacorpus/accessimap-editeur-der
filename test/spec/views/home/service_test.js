'use strict';

describe('Service: MainService', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var MainService,
        $rootScope,
        shareSvg;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_MainService_, _$rootScope_, _shareSvg_) {

        MainService = _MainService_;
        $rootScope = _$rootScope_;
        shareSvg = _shareSvg_;
    }));

    it('should create the main service', function() {
        expect(MainService).toBeDefined();
        
        expect(MainService.createBlankSvg).toBeDefined();
        expect(MainService.settings).toBeDefined();
    });

    it('should create a blank svg, store a map & a legend', function() {
        
        MainService
            .createBlankSvg('landscapeA4','landscapeA4')
            .then(function() {
                shareSvg.getMap()
                    .then(function(map) {
                        expect(map).toBeDefined();
                        shareSvg.getLegend()
                            .then(function(legend) {
                                expect(legend).toBeDefined();
                            })
                    })
            });

        $rootScope.$apply();

    });

});
