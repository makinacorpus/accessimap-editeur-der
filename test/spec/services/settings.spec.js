'use strict';

describe('Service: SettingsService', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var SettingsService;
    beforeEach(inject(function (_SettingsService_) {
        SettingsService = _SettingsService_;
    }));

    it('should do something', function () {
        expect(!!SettingsService).toBe(true);
    });

});
