'use strict';

describe('Controller: AboutController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var AboutController,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller) {
        AboutController = $controller('AboutController');
    }));

    it('should attach a list of 3 awesomeThings to the controller', function () {
        expect(AboutController.awesomeThings).toBeDefined();
        expect(AboutController.awesomeThings.length).toBe(3);
    });

    it('should attach a list of awesomeThings to the controller', function () {
        expect(AboutController.awesomeThings.length).toBe(3);
    });
});
