'use strict';

describe('Controller: EditService', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var EditService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_EditService_) {
        EditService = _EditService_;
    }));

    it('should create the EditService', function () {
        expect(EditService).toBeDefined();
    });


});
