'use strict';

describe('Service: ImportService', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var ImportService,
        InteractionService,
        filtersData = '<?xml version="1.0" encoding="UTF-8"?><config xmlns="http://www.w3.org/1999/xhtml"><filters><filter id="f1" name="Nom" expandable="false"></filter><filter id="f2c1a0dce-7eee-416d-8aa8-81570da91d51" name="Description" expandable="false"></filter></filters><pois><poi id="poi-2" x="270" y="180" width="94" height="73"><actions><action gesture="tap" filter="f1" value="Triangle" protocol="tts"></action><action gesture="tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Ce triangle est bleu" protocol="tts"></action><action gesture="double_tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Il est situé en haut à gauche de l\'écran" protocol="tts"></action></actions></poi><poi id="poi-1"><actions><action gesture="tap" filter="f1" value="Cercle" protocol="tts"></action><action gesture="tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Ce cercle est rouge" protocol="tts"></action><action gesture="double_tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Il est situé au milieu de l\'écran" protocol="tts"></action></actions></poi><poi id="poi-3"><actions><action gesture="tap" filter="f1" value="Carré" protocol="tts"></action><action gesture="tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Ce carré est jaune" protocol="tts"></action><action gesture="double_tap" filter="f2c1a0dce-7eee-416d-8aa8-81570da91d51" value="Il est situé en bas à droite de l\'écran" protocol="tts"></action></actions></poi></pois></config>';

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
            var interactions = InteractionService.getInteractions();

            expect(filters.length).toBe(2);
            
            expect(filters[0].id).toBe('f1');
            expect(filters[0].name).toBe('Nom');
            
            expect(filters[1].id).toBe('f2c1a0dce-7eee-416d-8aa8-81570da91d51');
            expect(filters[1].name).toBe('Description');
        });
        
        it('should add interactions in the InteractionService', function () {
            var parser = new DOMParser();
            
            ImportService.importInteraction(parser.parseFromString(filtersData, "text/xml"));
            
            var interactions = InteractionService.getInteractions();
            
            expect(Object.keys(interactions).length).toBe(3);

            expect(interactions['poi-1'].interactions[0].gesture).toBe('tap');
            expect(interactions['poi-1'].interactions[1].gesture).toBe('tap');
            expect(interactions['poi-1'].interactions[2].gesture).toBe('double_tap');
            
            expect(interactions['poi-1'].interactions[0].value).toBe('Cercle');
            expect(interactions['poi-1'].interactions[1].value).toBe('Ce cercle est rouge');
            expect(interactions['poi-1'].interactions[1].protocol).toBe('tts');

            // expect(interactions['poi-2'].interactions[0].gesture).toBe('tap');
            // expect(interactions['poi-2'].interactions[1].gesture).toBe('tap');
            // expect(interactions['poi-2'].interactions[2].gesture).toBe('double_tap');

            // expect(interactions['poi-1'].interactions[0].value).toBe('Triangle');
            // expect(interactions['poi-1'].interactions[1].value).toBe('Ce triangle est bleu');

            // expect(interactions['poi-3'].interactions[0].gesture).toBe('tap');
            // expect(interactions['poi-3'].interactions[1].gesture).toBe('tap');
            // expect(interactions['poi-3'].interactions[2].gesture).toBe('double_tap');
        });

    })

});
