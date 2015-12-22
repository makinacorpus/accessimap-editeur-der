'use strict';

describe('Service: getType', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var getType;
  beforeEach(inject(function (_getType_) {
    getType = _getType_;
  }));

  it('should do something', function () {
    expect(!!getType).toBe(true);
  });

});
