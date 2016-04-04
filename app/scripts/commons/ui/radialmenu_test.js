'use strict';

describe('Service: radialMenu', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var radialMenu;
  beforeEach(inject(function (_radialMenu_) {
    radialMenu = _radialMenu_;
  }));

  it('should do something', function () {
    expect(!!radialMenu).toBe(true);
  });

});
