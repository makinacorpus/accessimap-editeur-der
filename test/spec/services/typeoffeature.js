'use strict';

describe('Service: typeOfFeature', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var typeOfFeature;
    beforeEach(inject(function (_typeOfFeature_) {
        typeOfFeature = _typeOfFeature_;
    }));

    it('should do something', function () {
        expect(!!typeOfFeature).toBe(true);
    });

});
