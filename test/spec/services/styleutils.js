'use strict';

describe('Service: styleutils', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var styleutils;
    beforeEach(inject(function (_styleutils_) {
        styleutils = _styleutils_;
    }));

    it('should do something', function () {
        console.log(styleutils)
        expect(!!styleutils).toBe(true);
    });

});
