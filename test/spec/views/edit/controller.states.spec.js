'use strict';

describe('Controller: EditController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var EditController,
        EditService,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _EditService_) {
        scope = _$rootScope_.$new();
        EditService = _EditService_;

        spyOn(EditService, 'init').and.callFake(function() {
            return
        });

        EditController = $controller('EditController', {
            $scope: scope,
            EditService: EditService
        });

    }));

    it('should create the EditController with default states', function () {
        expect(EditController).toBeDefined();

        // expect(EditController.isHomeVisible).toBe(true);
        // expect(EditController.isParametersVisible).toBe(false);
        // expect(EditController.isMapParametersVisible).toBe(false);
        // expect(EditController.isDrawingParametersVisible).toBe(false);
        // expect(EditController.isInteractionParametersVisible).toBe(false);
        // expect(EditController.isBackgroundParametersVisible).toBe(false);

        // expect(EditController.isAddressVisible).toBe(false);
        // expect(EditController.isPoiCreationVisible).toBe(false);
        // expect(EditController.isFeatureCreationVisible).toBe(false);
        // expect(EditController.isFeatureManagementVisible).toBe(true);

        // expect(EditController.isDrawingFreezed).toBe(false);
        // expect(EditController.isLegendVisible).toBe(false);
        expect(EditController.isBrailleDisplayed).toBe(true);

    });

});
