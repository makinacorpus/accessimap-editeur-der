'use strict';

describe('Service: shareSvg', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var shareSvg,
        $rootScope;

    beforeEach(inject(function (_shareSvg_, _$rootScope_) {
        shareSvg = _shareSvg_;
        $rootScope = _$rootScope_;
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

    it('should store and retrieve an object as a map', function() {
        var object = { pouic: 'pouet' };

        shareSvg.setMap(object)
            .then(function() {
                shareSvg.getMap()
                    .then(function(map) {
                        expect(map).toBeDefined();
                        expect(map).toEqual(object);
                    })
            })
        $rootScope.$apply();

    })

    it('should store and retrieve an object as a legend', function() {
        var object = { pouic: 'pouet' };

        shareSvg.setLegend(object)
            .then(function() {
                shareSvg.getLegend()
                    .then(function(legend) {
                        expect(legend).toBeDefined();
                        expect(legend).toEqual(object);
                    })
            })
        $rootScope.$apply();

    })

    it('should store and retrieve an object as interactions', function() {
        var object = { pouic: 'pouet' };

        shareSvg.setInteractions(object)
            .then(function() {
                shareSvg.getInteractions()
                    .then(function(interactions) {
                        expect(interactions).toBeDefined();
                        expect(interactions).toEqual(object);
                    })
            })
        $rootScope.$apply();

    })

});
