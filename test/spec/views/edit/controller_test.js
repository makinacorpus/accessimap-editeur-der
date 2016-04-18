'use strict';

describe('Controller: EditController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var EditController,
        EditService,
        $rootScope,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _EditService_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        EditService = _EditService_;

        EditController = $controller('EditController', {
            $scope: scope,
            EditService: EditService
        });

    }));

    it('should create the EditController with default parameters', function () {
        expect(EditController).toBeDefined();
        expect(EditController.hideAside).toBeDefined();
        expect(EditController.showAside).toBeDefined();
    });

    describe('when the hideAside function is called, it', function() {
        it('should change the isAsideVisible attribute', function() {
            EditController.hideAside();
            expect(EditController.isAsideVisible).toBe(false);
        });
    })

    describe('when the showAside function is called, it', function() {
        it('should change the isAsideVisible attribute', function() {
            EditController.showAside();
            expect(EditController.isAsideVisible).toBe(true);
        });
    })

    describe('when the showMap function is called, it', function() {
        it('should change the isMapVisible & isLegendVisible attribute', function() {
            EditController.showMap();
            expect(EditController.isMapVisible).toBe(true);
            expect(EditController.isLegendVisible).toBe(false);
        });
    })

    describe('when the showLegend function is called, it', function() {
        it('should change the isAsideVisible attribute', function() {
            EditController.showLegend();
            expect(EditController.isMapVisible).toBe(false);
            expect(EditController.isLegendVisible).toBe(true);
        });
    })

    

});
