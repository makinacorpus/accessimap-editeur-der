'use strict';

describe('Service: GeometryUtilsService', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var GeometryUtilsService;
    beforeEach(inject(function ($injector) {
        GeometryUtilsService = $injector.get('GeometryUtilsService');
    }));

    it('should do something', function () {
        expect(GeometryUtilsService).toBeDefined();
        expect(GeometryUtilsService.distance).toBeDefined();
        expect(GeometryUtilsService.nearest).toBeDefined();
        expect(GeometryUtilsService.realCoordinates).toBeDefined();
        expect(GeometryUtilsService.angle).toBeDefined();
        expect(GeometryUtilsService.extendPath).toBeDefined();
        expect(GeometryUtilsService.getPathDirection).toBeDefined();
    });

    describe('the distance function', function() {
        var point1 = [0, 0],
            point2 = [10, 10];

        it('should return the right distance', function() {
            expect(GeometryUtilsService.distance(point1, point2)).toBeCloseTo(14.14);
        });

    });

    describe('the nearest function', function() {
        var targetPoint = [5, 5],
            points = [[0, 0], [10, 10], [4, 4]];

        it('should return the nearest point', function() {
            var nearest = GeometryUtilsService.nearest(targetPoint, points);
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
        bbox = {
            x: 10, y: 10, width: 100, height: 100
        },
        bbox1 = {
            x: 31, y: 90, width: 140, height: 400
        },
        bbox2 = {
            x: 42, y: -10, width: 100, height: 100
        },
        point = [50,50];

        it('should not change the coordinates if there is no CSS transform', function() {
            expect(GeometryUtilsService.realCoordinates(transform, point)).toEqual([0,0]);
        });

        it('should transform the coordinates with translation', function() {
            expect(GeometryUtilsService.realCoordinates(transform1, point)).toEqual([-250,0]);
            expect(GeometryUtilsService.realCoordinates(transform2, point)).toEqual([38,30]);
        });

        it('should transform the coordinates with translation and bbox', function() {
            expect(GeometryUtilsService.realCoordinates(transform1, point, bbox)).toEqual([-310,-60]);
            expect(GeometryUtilsService.realCoordinates(transform2, point, bbox)).toEqual([-22,-30]);
            expect(GeometryUtilsService.realCoordinates(transform1, point, bbox1)).toEqual([-351,-290]);
            expect(GeometryUtilsService.realCoordinates(transform2, point, bbox1)).toEqual([-63,-260]);
            expect(GeometryUtilsService.realCoordinates(transform1, point, bbox2)).toEqual([-342,-40]);
            expect(GeometryUtilsService.realCoordinates(transform2, point, bbox2)).toEqual([-54,-10]);
        });

    });

    describe('the angle function', function() {

        it('should return the angle between two points', function() {
            expect(GeometryUtilsService.angle(100, 200, 100, 100)).toEqual(-90);
            expect(GeometryUtilsService.angle(100, 100, 100, 100)).toEqual(0);
            expect(GeometryUtilsService.angle(200, 100, 100, 100)).toEqual(180);
        });

        it('should return an error if no points are in parameter', function() {
            expect(GeometryUtilsService.angle()).toEqual(Number.NaN);
        });

    });

    describe('the getPathDirection function', function() {

        it('should return the right direction between two points', function() {
            expect(GeometryUtilsService.getPathDirection([10,0], [0,10])).toEqual(1);
            expect(GeometryUtilsService.getPathDirection([10,10], [0,0])).toEqual(2);
            expect(GeometryUtilsService.getPathDirection([0,10], [10,0])).toEqual(3);
            expect(GeometryUtilsService.getPathDirection([0,0], [10,10])).toEqual(4);
        });

    });

    describe('the extendPath function', function() {

        it('should return a correct extended for a "top right to bottom left" path', function() {
            var extendedPath = GeometryUtilsService.extendPath([10,10], [0,0], 2);

            expect(extendedPath[0][0]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[0][1]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[1][0]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[1][1]).toBeCloseTo(0 - Math.sqrt(2));
        });

        it('should return a correct extended for a "bottom right to top left" path', function() {
            var extendedPath = GeometryUtilsService.extendPath([10,0], [0,10], 2);

            expect(extendedPath[0][0]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[0][1]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[1][0]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[1][1]).toBeCloseTo(10 + Math.sqrt(2));
        });

        it('should return a correct extended for a "bottom left to top right" path', function() {
            var extendedPath = GeometryUtilsService.extendPath([0,0], [10,10], 2);

            expect(extendedPath[0][0]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[0][1]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[1][0]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[1][1]).toBeCloseTo(10 + Math.sqrt(2));
        });

        it('should return a correct extended for a "top left to bottom right" path', function() {
            var extendedPath = GeometryUtilsService.extendPath([0,10], [10,0], 2);

            expect(extendedPath[0][0]).toBeCloseTo(0 - Math.sqrt(2));
            expect(extendedPath[0][1]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[1][0]).toBeCloseTo(10 + Math.sqrt(2));
            expect(extendedPath[1][1]).toBeCloseTo(0 - Math.sqrt(2));
        });

    });
});
