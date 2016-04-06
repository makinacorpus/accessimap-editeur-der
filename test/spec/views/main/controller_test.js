'use strict';

describe('Controller: MainController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var MainController,
        MainService,
        $scope,
        $location;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, $rootScope, _$location_, $q, _MainService_) {

        MainService = _MainService_;
        $location = _$location_;
        $scope = $rootScope.$new();
        
        spyOn(MainService, 'createBlankSvg').and.callThrough();

        MainController = _$controller_('MainController', {
            $scope: $scope,
            $location: $location,
            MainService: MainService
        });
    }));

    it('should create the main controller', function() {
        expect(MainController).toBeDefined();
        
        expect(MainController.goToBlankPage).toBeDefined();
        expect(MainController.goToLocalMap).toBeDefined();
        expect(MainController.goToExistingFile).toBeDefined();

        expect(MainController.mapFormat).toBe('landscapeA4');
        expect(MainController.legendFormat).toBe('landscapeA4');
        expect(MainController.formats).toBeDefined();
    });

    it('should create a blank SVG and go to /commonmap when we call goToBlankPage', function() {
        
        MainController.goToBlankPage();
        $scope.$apply();
        expect(MainService.createBlankSvg).toHaveBeenCalled();
        expect($location.url()).toBe('/commonmap?mapFormat=landscapeA4&legendFormat=landscapeA4');

    });

    it('should change the URL to /localmap when we call goToLocalMap', function() {

        MainController.goToLocalMap();
        $scope.$apply();
        expect($location.url()).toBe('/localmap?mapFormat=landscapeA4&legendFormat=landscapeA4');

    });

    it('should change the URL to /globalmap when we call goToExistingFile', function() {

        MainController.goToExistingFile();
        $scope.$apply();
        expect($location.url()).toBe('/globalmap?mapFormat=landscapeA4&legendFormat=landscapeA4');

    });

});
