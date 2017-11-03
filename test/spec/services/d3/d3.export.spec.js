'use strict';

describe('Service: ExportService', function () {

    module.sharedInjector();

    // instantiate service
    var ExportService,
        EditService,
        $rootScope,
        content,
        filename,
        $httpBackend,
        options = {};

    // load the service's module

    beforeAll(module('accessimapEditeurDerApp'))

    beforeAll(inject(function($q, $injector) {

        $rootScope    = $injector.get('$rootScope')
        EditService   = $injector.get('EditService')
        ExportService = $injector.get('ExportService')

        window.domtoimage = {
            toPng: function(node, options) {
                var deferred = $q.defer();
                deferred.resolve('fakeDataURL');
                return deferred.promise;
            }
        }

        $.ajax = function(_options_) {
            options = _options_;

            if (options.success) options.success('fake');
        }

        spyOn(JSZip.prototype, 'generateAsync').and.callFake(function (options) {
            var deferred = $q.defer();
            deferred.resolve('fakeBlob');
            return deferred.promise;
        })

        spyOn(jsPDF.API, 'addImage').and.callFake(function (imageData, format, x, y, w, h, alias, compression, rotation) {
            return;
        })

        spyOn(window, 'saveAs').and.callFake(function(_content, _filename) {
            content = _content;
            filename = _filename;
        })

    }));

    beforeEach(inject(function ($injector) {

        content       = null;
        filename      = '';
        $httpBackend = $injector.get('$httpBackend')

        var workspace = document.createElement('div');
        workspace.setAttribute('id', 'workspace');
        document.body.appendChild(workspace)

        EditService.init('landscapeA4', 'landscapeA4')

    }));

    afterEach(inject(function() {
        var workspace = document.getElementById('workspace');
        workspace.remove();
    }))

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

        it('should download font file', function(done) {
            ExportService.exportData({title: 'test'})
                .then(function(filename) {
                    expect(options.url).toBe(window.location.origin + '/assets/fonts/Braille_2007.ttf');
                    expect(options.dataType).toBe('binary');
                    done()
                })
            if (! $rootScope.$$phase) $rootScope.$digest()
        });

    })

});
