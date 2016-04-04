'use strict';

describe('Service: exportData', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var exportData;
    beforeEach(inject(function (_exportData_) {
        exportData = _exportData_;
    }));

    it('should do something', function () {
        expect(!!exportData).toBe(true);
    });

});
