'use strict';

describe('Controller: GlobalmapController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var GlobalmapController,
        $rootScope,
        $location,
        $q,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, $controller, _$q_, _$location_, _initSvg_, _settings_,_shareSvg_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $location = _$location_;
        $q = _$q_;

        GlobalmapController = $controller('GlobalmapController', {
            $scope: scope,
            $location: $location,
            initSvg: _initSvg_, 
            settings: _settings_, 
            shareSvg: _shareSvg_
        });

    }));

    it('should create the GlobalmapController with default parameters', function () {
        expect(GlobalmapController).toBeDefined();
        expect(GlobalmapController.appendSvg).toBeDefined();
        expect(GlobalmapController.uploadSvg).toBeDefined();
        expect(GlobalmapController.mapCategories).toBeDefined();
        expect(GlobalmapController.accordionStyle).toBeDefined();
    });


});
