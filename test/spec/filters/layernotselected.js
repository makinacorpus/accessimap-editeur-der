'use strict';

describe('Filter: layerNotSelected', function () {

  // load the filter's module
  beforeEach(module('accessimapEditeurDerApp'));

  // initialize a new instance of the filter before each test
  var layerNotSelected;
  beforeEach(inject(function ($filter) {
    layerNotSelected = $filter('layerNotSelected');
  }));

  it('should return the input prefixed with "layerNotSelected filter:"', function () {
    var text = 'angularjs';
    expect(layerNotSelected(text)).toBe('layerNotSelected filter: ' + text);
  });

});
