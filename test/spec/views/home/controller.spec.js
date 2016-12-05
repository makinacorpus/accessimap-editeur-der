'use strict';

describe('Controller: HomeController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var HomeController,
        $scope,
        $location,
        SettingsService,
        $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_, _SettingsService_) {

        $location       = _$location_;
        SettingsService = _SettingsService_;
        $rootScope      = _$rootScope_;
        $scope          = $rootScope.$new();


        HomeController = _$controller_('HomeController', {
            $scope          : $scope,
            $location       : $location,
            SettingsService : SettingsService
        });
    }));

    it('should create the main controller', function() {
        expect(HomeController).toBeDefined();

        expect(HomeController.goToEdit).toBeDefined();

    });

    it('should go to /edit when we call goToEdit', function() {

        HomeController.goToEdit();
        $scope.$apply();
        expect($location.url()).toBe('/edit');

    });

});
