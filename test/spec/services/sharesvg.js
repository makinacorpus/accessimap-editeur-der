'use strict';

describe('Service: shareSvg', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var shareSvg;
  beforeEach(inject(function (_shareSvg_) {
    shareSvg = _shareSvg_;
  }));

  it('should do something', function () {
    expect(!!shareSvg).toBe(true);
  });

});
