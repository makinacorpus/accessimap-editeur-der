'use strict';

describe('Service: shareSvg', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var shareSvg;
    beforeEach(inject(function (_shareSvg_) {
        shareSvg = _shareSvg_;
    }));

    it('should create the shareSvg service', function () {
        expect(shareSvg).toBeDefined();
        expect(shareSvg.getMap).toBeDefined();
        expect(shareSvg.setMap).toBeDefined();
        expect(shareSvg.setLegend).toBeDefined();
        expect(shareSvg.getLegend).toBeDefined();
        expect(shareSvg.setInteractions).toBeDefined();
        expect(shareSvg.getInteractions).toBeDefined();
    });

    it('should store and retrieve an object', function() {
        var object = { pouic: 'pouet' };

        shareSvg.setMap(object)
            .then(function() {
                console.log('pouic')
                shareSvg.getMap(object)
                    .then(function() {
                        console.log(object)
                    })
            })
        shareSvg.getMap()
            .then(function(_object_) {
                console.log(_object_)
            })
    })

});
