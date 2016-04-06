'use strict';

describe('Controller: LocalmapService', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var LocalmapService,
        $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_LocalmapService_, _$rootScope_) {
        $rootScope = _$rootScope_;
        LocalmapService = _LocalmapService_;
    }));

    it('should create the LocalmapService', function () {
        expect(LocalmapService).toBeDefined();
    });


});
