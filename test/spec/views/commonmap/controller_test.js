'use strict';

describe('Controller: CommonmapController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var CommonmapController,
        CommonmapService,
        $rootScope,
        $location,
        scope,
        initSvg,
        fake = function() { return;};

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, $controller, _initSvg_, _$location_, _CommonmapService_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        initSvg = _initSvg_;
        $location = _$location_;
        CommonmapService = _CommonmapService_;

        CommonmapController = $controller('CommonmapController', {
            $scope: scope,
            CommonmapService: _CommonmapService_
        });

    }));

    it('should create the CommonmapController with default parameters', function () {
        expect(CommonmapController).toBeDefined();
        expect(CommonmapController.updateView).toBeDefined();
        expect(CommonmapController.$watch).toBeDefined();
        expect(CommonmapController.addFilter).toBeDefined();
        expect(CommonmapController.changeColor).toBeDefined();
        expect(CommonmapController.changeTextColor).toBeDefined();
        expect(CommonmapController.changeContainerStyle).toBeDefined();
        expect(CommonmapController.enableEditionMode).toBeDefined();
        expect(CommonmapController.featureIcon).toBeDefined();
        expect(CommonmapController.hideMenu).toBeDefined();
        expect(CommonmapController.mapExport).toBeDefined();
        expect(CommonmapController.removeRow).toBeDefined();
        expect(CommonmapController.resetView).toBeDefined();
        expect(CommonmapController.showMenu).toBeDefined();
        expect(CommonmapController.updateMarker).toBeDefined();
        expect(CommonmapController.updatePolygonStyle).toBeDefined();
    });

    describe('when enableEditionMode is called, it', function() {

        beforeEach(inject(function() {
            var fake = function() { return;};
            spyOn(CommonmapService, 'resetActions').and.callFake(fake);
            spyOn(CommonmapService, 'addRadialMenus').and.callFake(fake);
            spyOn(CommonmapService, 'undo').and.callFake(fake);
            spyOn(CommonmapService, 'enablePointMode').and.callFake(fake);
            spyOn(CommonmapService, 'enableCircleMode').and.callFake(fake);
            spyOn(CommonmapService, 'enableLinePolygonMode').and.callFake(fake);
            spyOn(CommonmapService, 'enableTextMode').and.callFake(fake);
            
        }))

        it('should reset actions and draw radial menus by default', function() {

            CommonmapController.enableEditionMode('default');

            expect(CommonmapController.mode).toBe('default');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call undo for undo mode', function() {

            CommonmapController.enableEditionMode('undo');

            expect(CommonmapController.mode).toBe('undo');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call enablePointMode for point mode', function() {

            CommonmapController.enableEditionMode('point');

            expect(CommonmapController.mode).toBe('point');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call enableCircleMode for circle mode', function() {

            CommonmapController.enableEditionMode('circle');

            expect(CommonmapController.mode).toBe('circle');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call enableLinePolygonMode for line mode', function() {

            CommonmapController.enableEditionMode('line');

            expect(CommonmapController.mode).toBe('line');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call enableLinePolygonMode for polygon mode', function() {

            CommonmapController.enableEditionMode('polygon');

            expect(CommonmapController.mode).toBe('polygon');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).not.toHaveBeenCalled();
            
        });

        it('should reset actions and call enableTextMode for addtext mode', function() {

            CommonmapController.enableEditionMode('addtext');

            expect(CommonmapController.mode).toBe('addtext');
            expect(CommonmapService.resetActions).toHaveBeenCalled();
            expect(CommonmapService.addRadialMenus).not.toHaveBeenCalled();
            expect(CommonmapService.undo).not.toHaveBeenCalled();
            expect(CommonmapService.enablePointMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableCircleMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableLinePolygonMode).not.toHaveBeenCalled();
            expect(CommonmapService.enableTextMode).toHaveBeenCalled();
            
        });
        
    });
    
    describe('when removeRow is called, it', function() {
        it('should call the CommonmapService.removeRow', function() {
            spyOn(CommonmapService, 'removeRow').and.callFake(fake);
            CommonmapController.removeRow();
            expect(CommonmapService.removeRow).toHaveBeenCalled();
        });
    })
    
    describe('when updateView is called, it', function() {
        it('should call the scope.$apply', function() {
            spyOn(scope, '$apply').and.callFake(fake);
            CommonmapController.updateView();
            expect(scope.$apply).toHaveBeenCalled();
        });
    })
    
    describe('when $watch is called, it', function() {
        it('should call the scope.$watch', function() {
            spyOn(scope, '$watch').and.callFake(fake);
            CommonmapController.$watch();
            expect(scope.$watch).toHaveBeenCalled();
        });
    })
    
    describe('when changeColor is called, it', function() {
        it('should call the CommonmapController.updatePolygonStyle', function() {
            spyOn(CommonmapController, 'updatePolygonStyle').and.callFake(fake);
            CommonmapController.changeColor();
            expect(CommonmapController.updatePolygonStyle).toHaveBeenCalled();
        });
        it('should call the CommonmapService.updatePolygonStyle', function() {
            spyOn(CommonmapService, 'updatePolygonStyle').and.callFake(fake);
            CommonmapController.changeColor();
            expect(CommonmapService.updatePolygonStyle).toHaveBeenCalled();
        });
    })
    
    describe('when updateMarker is called, it', function() {
        it('should call the CommonmapService.updateMarker', function() {
            spyOn(CommonmapService, 'updateMarker').and.callFake(fake);
            CommonmapController.updateMarker();
            expect(CommonmapService.updateMarker).toHaveBeenCalled();
        });
    })
    
    describe('when changeTextColor is called, it', function() {
        it('should call the CommonmapService.changeTextColor', function() {
            // we affect the fake function because 
            // CommonmapService.changeTextColor is a toolbox(service) function
            // with the DI, toolbox is not instanciated, so changeTextColor is null
            CommonmapService.changeTextColor = fake;
            spyOn(CommonmapService, 'changeTextColor').and.callThrough();
            CommonmapController.changeTextColor();
            expect(CommonmapService.changeTextColor).toHaveBeenCalled();
        });
    })
    
    describe('when hideMenu is called, it', function() {
        it('should set to false the rightMenuVisible property', function() {
            CommonmapController.hideMenu();
            expect(CommonmapController.rightMenuVisible).toBe(false);
        });
    })
    
    describe('when showMenu is called, it', function() {
        it('should set to true the rightMenuVisible property', function() {
            CommonmapController.showMenu();
            expect(CommonmapController.rightMenuVisible).toBe(true);
        });
    })
    
    describe('when changeContainerStyle is called, it', function() {
        it('should change the #svgContainer style according to the curret containerStyle', function() {
            
            console.log(d3.select('#svgContainer'))
            var nodes = initSvg.createBlankSvg('landscapeA4','landscapeA4');
            console.log(d3.select('#der'))
            $rootScope.$apply();
            console.log(d3.select('#svgContainer'))

            // first case, polygon style with fill pattern
            CommonmapController.changeContainerStyle();

            // second case, line style with 'normal style'
            CommonmapController.containerStyleChoices = CommonmapService.settings.STYLES.line;
            CommonmapController.containerStyle = CommonmapController.containerStyleChoices[0];
            CommonmapController.changeContainerStyle();
        
        });
    })

/*    describe('when hidden.bs.modal is triggered is called, it', function() {
        beforeEach(inject(function() {
            spyOn(CommonmapService, 'resetActions').and.callThrough();
        }))

        it('on #changePatternModal it should call CommonmapService.resetActions', function() {

            $('#changePatternModal').trigger('hidden.bs.modal');
            $rootScope.$apply();
            expect(CommonmapService.resetActions).toHaveBeenCalled();
        
        });
        it('on #changeColorModal it should call CommonmapService.resetActions', function() {
            $('#changeColorModal').trigger('hidden.bs.modal');
            $rootScope.$apply();
            expect(CommonmapService.resetActions).toHaveBeenCalled();
        
        });
    })
*/

});
