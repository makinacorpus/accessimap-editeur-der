'use strict';

describe('Controller: HomeController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var HomeController,
        $scope,
        $location,
        settings,
        $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_, _settings_) {

        $location = _$location_;
        settings = _settings_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        

        HomeController = _$controller_('HomeController', {
            $scope: $scope,
            $location: $location,
            settings: settings
        });
    }));

    it('should create the main controller', function() {
        expect(HomeController).toBeDefined();
        
        expect(HomeController.goToEdit).toBeDefined();
        expect($rootScope.displayFooter).toBeDefined();
        expect($rootScope.displayFooter).toBe(true);

        expect(HomeController.mapFormat).toBe('landscapeA4');
        expect(HomeController.legendFormat).toBe('landscapeA4');
        expect(HomeController.formats).toBeDefined();
    });

    it('should go to /edit when we call goToEdit', function() {
        
        HomeController.goToEdit();
        expect($rootScope.displayFooter).toBe(false);
        $scope.$apply();
        expect($location.url()).toBe('/edit');

    });

});
