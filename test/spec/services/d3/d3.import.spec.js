'use strict';

describe('Service: ImportService', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var ImportService,
        InteractionService,
        filtersData = '<?xml version="1.0" encoding="UTF-8"?><config><filters><filter id="f1" name="Défaut" gesture="tap" protocol="tts" expandable="false"/><filter id="f2" name="un autre filtre" gesture="tap" protocol="mp3" expandable="false"/><filter id="f3" name="un troisième filtre" gesture="tap" protocol="mp3" expandable="false"/></filters><pois/></config>';

    beforeEach(inject(function ($injector) {
        ImportService = $injector.get('ImportService')
        InteractionService = $injector.get('InteractionService')
    }));

    it('should be defined', function () {
        expect(ImportService).toBeDefined();
        expect(ImportService.importDrawing).toBeDefined();
        expect(ImportService.importInteraction).toBeDefined();
        expect(ImportService.getModelFromSVG).toBeDefined();
    });

    describe('importInteraction function', function() {

        it('should add filters in the InteractionService', function () {
            var parser = new DOMParser();

            ImportService.importInteraction(parser.parseFromString(filtersData, "text/xml"));

            var filters = InteractionService.getFilters();
            expect(filters.length).toBe(3);

            expect(filters[0].id).toBe('f1');
            expect(filters[0].name).toBe('Défaut');
            expect(filters[0].gesture).toBe('tap');
            expect(filters[0].protocol).toBe('tts');

            expect(filters[1].id).toBe('f2');
            expect(filters[1].name).toBe('un autre filtre');
            expect(filters[1].gesture).toBe('tap');
            expect(filters[1].protocol).toBe('mp3');

            expect(filters[2].id).toBe('f3');
            expect(filters[2].name).toBe('un troisième filtre');
            expect(filters[2].gesture).toBe('tap');
            expect(filters[2].protocol).toBe('mp3');

        });

    })

});
