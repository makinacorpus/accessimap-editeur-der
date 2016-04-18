'use strict';

describe('Controller: LocalmapController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var LocalmapController,
        LocalmapService,
        $rootScope,
        $location,
        $q,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _$q_, _$location_, _LocalmapService_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $location = _$location_;
        $q = _$q_;
        LocalmapService = _LocalmapService_;

    }));

    describe('when we specify mapFormat and legendFormat, it', function() {
        beforeEach(inject(function($controller) {
            $location.search('mapFormat','landscapeA3');
            $location.search('legendFormat','nexus9');
            spyOn(LocalmapService, 'init').and.callThrough();
            
            LocalmapController = $controller('LocalmapController', {
                $scope: scope,
                $location: $location,
                LocalmapService: LocalmapService
            });
        }))
        it('should use the right size parameters to init the map and the legend', function() {
            expect(LocalmapService.init.calls.mostRecent().object).toBe(LocalmapService)
            expect(LocalmapService.init.calls.mostRecent().args).toEqual(['landscapeA3','nexus9'])
        })
    })

    describe('when we don\'t specify any formats, it', function() {

        beforeEach(inject(function($controller) {
            LocalmapController = $controller('LocalmapController', {
                $scope: scope,
                $location: $location,
                LocalmapService: LocalmapService
            });
        }))

        it('should create the LocalmapController with default parameters', function () {
            expect(LocalmapController).toBeDefined();
            expect(LocalmapController.hideAside).toBeDefined();
            expect(LocalmapController.showAside).toBeDefined();
            expect(LocalmapController.rotateMap).toBeDefined();
            expect(LocalmapController.changeStyle).toBeDefined();
            expect(LocalmapController.downloadData).toBeDefined();
            expect(LocalmapController.downloadPoi).toBeDefined();
            expect(LocalmapController.simplifyFeatures).toBeDefined();
            expect(LocalmapController.zoomOnPlace).toBeDefined();
            expect(LocalmapController.nextStep).toBeDefined();
        });

        describe('when the hideAside function is called, it', function() {
            it('should change the isAsideVisible attribute', function() {
                LocalmapController.hideAside();
                expect(LocalmapController.isAsideVisible).toBe(false);
            });
        })

        describe('when the showAside function is called, it', function() {
            it('should change the isAsideVisible attribute', function() {
                LocalmapController.showAside();
                expect(LocalmapController.isAsideVisible).toBe(true);
            });
        })

        describe('when the rotateMap function is called, it', function() {
            it('should call the LocalmapService.rotate', function() {
                spyOn(LocalmapService, 'rotate').and.callThrough();
                LocalmapController.rotateMap();
                expect(LocalmapService.rotate).toHaveBeenCalled();
            });
        })

        describe('when the downloadData function is called, it', function() {
            it('should call the LocalmapService.rotate', function() {
                spyOn(LocalmapService, 'downloadData').and.callThrough();
                LocalmapController.downloadData();
                expect(LocalmapService.downloadData).toHaveBeenCalled();
            });
        })

        describe('when the downloadPoi function is called, it', function() {
            it('should call the LocalmapService.rotate', function() {
                spyOn(LocalmapService, 'downloadPoi').and.callThrough();
                LocalmapController.downloadPoi();
                expect(LocalmapService.downloadPoi).toHaveBeenCalled();
            });
        })

        describe('when the simplifyFeatures function is called, it', function() {
            it('should call the LocalmapService.rotate', function() {
                spyOn(LocalmapService, 'simplifyFeatures').and.callFake(function() { return; });

                LocalmapController.simplifyFeatures(null);
                expect(LocalmapService.simplifyFeatures).toHaveBeenCalled();
                expect(LocalmapService.simplifyFeatures.calls.mostRecent().args)
                .toEqual([null, 
                            LocalmapController.queryChosen,
                            LocalmapController.styleChosen,
                            LocalmapController.styleChoices,
                            LocalmapController.colorChosen,
                            LocalmapController.checkboxModel,
                            LocalmapController.rotationAngle]);

            });
        })

        describe('when the zoomOnPlace function is called, it', function() {
            it('should call the LocalmapService.rotate', function() {
                spyOn(LocalmapService, 'zoomOnPlace').and.callThrough();
                LocalmapController.zoomOnPlace();
                expect(LocalmapService.zoomOnPlace).toHaveBeenCalled();
            });
        })

        describe('when the nextStep function is called, it', function() {
            it('should call the LocalmapService.storeMapAndLegend', function() {
                spyOn(LocalmapService, 'storeMapAndLegend').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve();

                    return deferred.promise;
                });

                LocalmapController.nextStep();
                $rootScope.$apply();

                expect(LocalmapService.storeMapAndLegend).toHaveBeenCalled();
                expect($location.url()).toBe('/commonmap');
            });
        })

        describe('when the changeStyle function is called, it', function() {
            it('should update styleChoices and styleChosen according to queryChosen', function() {
                var queryChosen = JSON.parse(JSON.stringify(LocalmapController.queryChosen)),
                    styleChoices = LocalmapService.settings.STYLES[queryChosen.type],
                    styleChosen = styleChoices[0];

                LocalmapController.changeStyle();

                expect(LocalmapController.styleChoices).toEqual(styleChoices);
                expect(LocalmapController.styleChosen).toEqual(styleChosen);

                LocalmapController.queryChosen = LocalmapController.queryChoices[1];
                LocalmapController.changeStyle();

                queryChosen = JSON.parse(JSON.stringify(LocalmapController.queryChosen));
                styleChoices = LocalmapService.settings.STYLES[queryChosen.type];
                styleChosen = styleChoices[0];

                expect(LocalmapController.styleChoices).toEqual(styleChoices);
                expect(LocalmapController.styleChosen).toEqual(styleChosen);

            });
        })

    })

});
