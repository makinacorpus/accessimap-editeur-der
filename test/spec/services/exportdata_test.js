'use strict';

describe('Service: exportData', function () {

    // load the service's module
    beforeEach(module('accessimapEditeurDerApp'));

    // instantiate service
    var exportData,
        $rootScope,
        content,
        filename;

    beforeEach(inject(function (_exportData_, _$rootScope_) {
        exportData = _exportData_;
        $rootScope = _$rootScope_;
        content    = null;
        filename   = '';

        spyOn(window, 'saveAs').and.callFake(function(_content, _filename) {
            content = _content;
            filename = _filename;
        });

    }));

    it('should create the shareSvg service', function () {
        expect(exportData).toBeDefined();
        expect(exportData.mapExport).toBeDefined();
    });

    describe('mapExport function', function() {
    
        it('should name the export file \'der\' by default ', function() {
            exportData.mapExport();
            $rootScope.$apply();
            
            expect(filename).toBe('der.zip');
        });
    
        it('should export a file test.zip', function() {
            exportData.mapExport('test');
            $rootScope.$apply();
            
            expect(filename).toBe('test.zip');            
        });
        
    })


});
