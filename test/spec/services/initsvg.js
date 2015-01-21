'use strict';

describe('Service: initSvg', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var initSvg;
  beforeEach(inject(function (_initSvg_) {
    initSvg = _initSvg_;
  }));

  it('should do something', function () {
    expect(!!initSvg).toBe(true);
  });

});
