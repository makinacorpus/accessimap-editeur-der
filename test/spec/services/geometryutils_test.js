'use strict';

describe('Service: geometryutils', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var geometryutils;
    beforeEach(inject(function (_geometryutils_) {
        geometryutils = _geometryutils_;
    }));

    it('should do something', function () {
        expect(!!geometryutils).toBe(true);
    });

    describe('the distance function', function() {
        var point1 = [0, 0],
            point2 = [10, 10];

        it('should return the right distance', function() {
            expect(geometryutils.distance(point1, point2)).toBeCloseTo(14.14);
        });

    });

    describe('the nearest function', function() {
        var targetPoint = [5, 5],
            points = [[0, 0], [10, 10], [4, 4]];

        it('should return the nearest point', function() {
            var nearest = geometryutils.nearest(targetPoint, points);
            expect(nearest[0]).toBe(4);
            expect(nearest[1]).toBe(4);
            expect(nearest[3]).toBeCloseTo(1.414);
        });

    });

    describe('the realCoordinates function', function() {

        var transform = {
            translate: [50, 50],
            scale: [1,2,3]
        },
        transform1 = {
            translate: [300,50],
            scale: [5,2,3]
        },
        transform2 = {
            translate: [12,20],
            scale: [0.5,2,3]
        },
        point = [50,50];

        it('should not change the coordinates if there is no CSS transform', function() {
            expect(geometryutils.realCoordinates(transform, point)).toEqual([0,0]);
        });

        it('should transform the coordinates with scale and translation', function() {
            expect(geometryutils.realCoordinates(transform1, point)).toEqual([-50,0]);
            expect(geometryutils.realCoordinates(transform2, point)).toEqual([76,60]);
        });

    });

    describe('the angle function', function() {

        it('should return the angle between two points', function() {
            expect(geometryutils.angle(100, 200, 100, 100)).toEqual(-90);
            expect(geometryutils.angle(100, 100, 100, 100)).toEqual(0);
            expect(geometryutils.angle(200, 100, 100, 100)).toEqual(180);
        });

        it('should return an error if no points are in parameter', function() {
            expect(geometryutils.angle()).toEqual(Number.NaN);
        });

    });
});
