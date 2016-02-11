'use strict';

describe('Service: editSvg', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var editSvg;
  beforeEach(inject(function (_editSvg_) {
    editSvg = _editSvg_;
  }));

  it('should exist', function () {
    expect(!!editSvg).toBe(true);
  });

  describe('the circlePath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.circlePath(100, 100, 10)).toBe('M 100 100 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0');
    });
  });

  describe('the circleCrossPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.circleCrossPath(100, 100, 10)).toBe('M 100 100 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0 Z M 92.92893218813452 92.92893218813452 L 107.07106781186548 107.07106781186548 Z M 92.92893218813452 107.07106781186548 L 107.07106781186548 92.92893218813452 Z');
    });
  });

  describe('the ovalPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.ovalPath(100, 100, 10)).toBe('M 100 100 m -5, 0 a 5,10 0 1,0 10,0 a 5,10 0 1,0 -10,0');
    });
  });

  describe('the trianglePath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.trianglePath(100, 100, 10)).toBe('M 95 100 L100 91.33974596215562 L105 100 Z');
    });
  });

  describe('the squarePath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.squarePath(100, 100, 10)).toBe('M 95 95 v10 h10 v-10 Z');
    });
  });

  describe('the squareDiagPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.squareDiagPath(100, 100, 10)).toBe('M 95 95 v10 h10 v-10 Z M 95 95 L 105 105 Z');
    });
  });

  describe('the squareCrossPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.squareCrossPath(100, 100, 10)).toBe('M 95 95 v10 h10 v-10 Z M 95 95 L 105 105 Z M 95 105 L 105 95 Z');
    });
  });

  describe('the crossPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.crossPath(100, 100, 10)).toBe('M 95 100 h10 ZM 100 95 v10 Z');
    });
  });

  describe('the horizontalRectPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.horizontalRectPath(100, 100, 10)).toBe('M 95 100 h10 Z');
    });
  });

  describe('the horizontalArrowPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.horizontalArrowPath(100, 100, 10)).toBe('M 100 100 L97 97 L97 99 L88 99 L88 101 L97 101 L97 103 Z');
    });
  });

  describe('the horizontalSmallArrowPath function', function() {
    it('should return the right symbol', function() {
      expect(editSvg.horizontalSmallArrowPath(100, 100, 10)).toBe('M 100 100 L95 96 L95 99 L88 99 L88 101 L95 101 L95 104 Z');
    });
  });

});