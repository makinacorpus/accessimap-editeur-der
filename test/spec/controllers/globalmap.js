'use strict';

describe('Controller: GlobalmapCtrl', function () {

  // load the controller's module
  beforeEach(module('accessimapEditeurDerApp'));

  var GlobalmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GlobalmapCtrl = $controller('GlobalmapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
