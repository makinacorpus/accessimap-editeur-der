'use strict';

describe('Filter: layerNotSelected', function () {

  // load the filter's module
  beforeEach(module('accessimapEditeurDerApp'));

  // initialize a new instance of the filter before each test
  var layerNotSelected;
  beforeEach(inject(function ($filter) {
    layerNotSelected = $filter('layerNotSelected');
  }));

});
