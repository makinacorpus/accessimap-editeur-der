'use strict';

describe('Service: ExportService', function () {

    module.sharedInjector();
    
    // instantiate service
    var ExportService,
        $rootScope,
        content,
        MapService,
        filename,
        initDone = false;

    // load the service's module

    beforeAll(module('accessimapEditeurDerApp'))

    beforeAll(inject(function(_EditService_, $q, _$rootScope_, _ExportService_) {

        $rootScope    = _$rootScope_;
        ExportService = _ExportService_;

        if (! initDone) {
            var workspace = document.createElement('div');
            workspace.setAttribute('id', 'workspace');
            document.body.appendChild(workspace)

            _EditService_.init('landscapeA4', 'landscapeA4')
            initDone = true;            
        }

        window.domtoimage = {
            toPng: function(node, options) {
                var deferred = $q.defer();
                deferred.resolve('fakeDataURL');
                return deferred.promise;
            }
        }

        spyOn(JSZip.prototype, 'generateAsync').and.callFake(function(options) {
            var deferred = $q.defer();
            deferred.resolve('fakeBlob');
            return deferred.promise;
        })

        spyOn(window, 'saveAs').and.callFake(function(_content, _filename) {
            content = _content;
            filename = _filename;
        })

    }));

    beforeEach(inject(function (_ExportService_) {

        content       = null;
        filename      = '';

    }));

    describe('exportData function', function() {
    
        it('should be defined', function () {
            expect(ExportService).toBeDefined();
            expect(ExportService.exportData).toBeDefined();
        });
    
        it('should name the export file \'der\' by default ', function(done) {

            ExportService.exportData({})
                .then(function(filename) {
                    expect(filename).toBe('der.zip');
                    done()
                });
            if (! $rootScope.$$phase) $rootScope.$digest()
        });
    
        it('should export a file test.zip', function(done) {
            ExportService.exportData({title: 'test'})
                .then(function(filename) {
                    expect(filename).toBe('test.zip');
                    done()
                })
            if (! $rootScope.$$phase) $rootScope.$digest()
        });
        
    })

});
