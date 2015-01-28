'use strict';

describe('Service: editSvg', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var editSvg;
  beforeEach(inject(function (_editSvg_) {
    editSvg = _editSvg_;
  }));

  it('should do something', function () {
    expect(!!editSvg).toBe(true);
  });

});
