'use strict';

describe('Service: svgicon', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var svgicon;
  beforeEach(inject(function (_svgicon_) {
    svgicon = _svgicon_;
  }));

  it('should do something', function () {
    expect(!!svgicon).toBe(true);
  });

});
