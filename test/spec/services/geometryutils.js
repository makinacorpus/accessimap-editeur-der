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

});
