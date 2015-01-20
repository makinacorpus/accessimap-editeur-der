'use strict';

describe('Service: exportService', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var exportService;
  beforeEach(inject(function (_exportService_) {
    exportService = _exportService_;
  }));

  it('should do something', function () {
    expect(!!exportService).toBe(true);
  });

});
