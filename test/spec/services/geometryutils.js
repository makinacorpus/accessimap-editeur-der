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
    var point1 = [0, 0];
    var point2 = [10, 10];

    it('should return the right distance', function() {
      expect(geometryutils.distance(point1, point2)).toBeCloseTo(14.14);
    });

  });

  describe('the nearest function', function() {
    var targetPoint = [5, 5];
    var points = [[0, 0], [10, 10], [4, 4]];

    it('should return the nearest point', function() {
      var nearest = geometryutils.nearest(targetPoint, points)
      expect(nearest[0]).toBe(4);
      expect(nearest[1]).toBe(4);
      expect(nearest[2]).toBeCloseTo(1.414);
    });

  });

  describe('the isClockwise function', function() {
    var clockwisePolygon = [[5, 10], [10, 5], [5, 0], [0, 5]];
    var antiClockwisePolygon = [[5, 10], [0, 5], [5, 0], [10, 5]];

    it('should return the true if the polygon is clockwise', function() {
      expect(geometryutils.isClockwise(clockwisePolygon)).toBe(true);
    });

    it('should return the false if the polygon is anti-clockwise', function() {
      expect(geometryutils.isClockwise(antiClockwisePolygon)).toBe(false);
    });

  });
});
