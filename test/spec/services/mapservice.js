'use strict';

describe('Service: mapService', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var mapService;
  beforeEach(inject(function (_mapService_) {
    mapService = _mapService_;
  }));

  it('should do something', function () {
    expect(!!mapService).toBe(true);
  });

});
