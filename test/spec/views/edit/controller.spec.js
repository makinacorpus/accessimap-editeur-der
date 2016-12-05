'use strict';

describe('Controller: EditController', function () {

    // load the controller's module
    beforeEach(module('accessimapEditeurDerApp'));

    var EditController,
        EditService,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _EditService_, _ToasterService_, _$location_, _$q_) {
        scope = _$rootScope_.$new();
        EditService = _EditService_;

        spyOn(EditService, 'init').and.callFake(function() {
            return
        });

        EditController = $controller('EditController', {
            $scope: scope,
            EditService: EditService,
            ToasterService: _ToasterService_,
            $location:_$location_,
            $q: _$q_
        });

        EditController.init();

    }));

    it('should create the EditController with default parameters', function () {
        expect(EditController).toBeDefined();

        expect(EditController.queryChoices).toBeDefined();
        expect(EditController.queryChosen).toBeDefined();
        expect(EditController.styleChoices).toBeDefined();
        expect(EditController.styleChosen).toBeDefined();
        expect(EditController.model).toBeDefined();
        expect(EditController.fonts).toBeDefined();
        expect(EditController.fontChosen).toBeDefined();
        expect(EditController.fontColors).toBeDefined();
        expect(EditController.fontColorChosen).toBeDefined();
        expect(EditController.colors).toBeDefined();
        expect(EditController.featureIcon).toBeDefined();
        expect(EditController.formats).toBeDefined();
        expect(EditController.backgroundStyleChoices).toBeDefined();
        expect(EditController.mapFormat).toBeDefined();
        expect(EditController.legendFormat).toBeDefined();
        expect(EditController.checkboxModel).toBeDefined();
        expect(EditController.getFeatures).toBeDefined();
    });


    it('should create the EditController with default methods', function () {
        expect(EditController).toBeDefined();

        expect(EditController.exportData).toBeDefined();
        expect(EditController.rotateMap).toBeDefined();
        expect(EditController.changeDrawingFormat).toBeDefined();
        expect(EditController.changeLegendFormat).toBeDefined();
        expect(EditController.importBackground).toBeDefined();
        expect(EditController.importImage).toBeDefined();
        expect(EditController.appendSvg).toBeDefined();
        expect(EditController.importDER).toBeDefined();
        expect(EditController.showMap).toBeDefined();
        expect(EditController.hideMap).toBeDefined();
        expect(EditController.showFontBraille).toBeDefined();
        expect(EditController.hideFontBraille).toBeDefined();
        expect(EditController.displayAddPOIForm).toBeDefined();
        expect(EditController.displaySearchAddressForm).toBeDefined();
        expect(EditController.displayGetDataFromOSMForm).toBeDefined();
        expect(EditController.insertOSMData).toBeDefined();
        expect(EditController.displayFeatureManagement).toBeDefined();
        expect(EditController.displayParameters).toBeDefined();
        expect(EditController.displayMapParameters).toBeDefined();
        expect(EditController.displayDrawingParameters).toBeDefined();
        expect(EditController.displayLegendParameters).toBeDefined();
        expect(EditController.displayInteractionParameters).toBeDefined();
        expect(EditController.displayBackgroundParameters).toBeDefined();
        expect(EditController.removeFeature).toBeDefined();
        expect(EditController.updateFeature).toBeDefined();
        expect(EditController.rotateFeature).toBeDefined();
        expect(EditController.updateMarker).toBeDefined();
        expect(EditController.updateColor).toBeDefined();
        expect(EditController.updateStyle).toBeDefined();
        expect(EditController.updateBackgroundColor).toBeDefined();
        expect(EditController.updateBackgroundStyle).toBeDefined();
        expect(EditController.enableDrawingMode).toBeDefined();
        expect(EditController.resetView).toBeDefined();
        expect(EditController.searchAddress).toBeDefined();
    });


});
