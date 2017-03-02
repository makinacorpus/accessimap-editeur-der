'use strict';

describe('Service: MapService', function () {

    // instantiate service
    var MapService,
        SettingsService;

    beforeEach(module('accessimapEditeurDerApp'))

    beforeEach(inject(function($injector) {
        MapService = $injector.get('MapService');
        SettingsService = $injector.get('SettingsService');

        // creation of a node for the map
        var workspace = document.createElement('div');
        workspace.setAttribute('id', 'workspace');
        document.body.appendChild(workspace);

        MapService.init('workspace', 'landscapeA4', SettingsService.ratioPixelPoint)

    }));

    afterEach(inject(function() {
        var workspace = document.getElementById('workspace');
        workspace.remove();
    }))    

    it('should be defined', function () {
        expect(MapService).toBeDefined();

        expect(MapService.getMap).toBeDefined();
        expect(MapService.getBaseLayer).toBeDefined();
        expect(MapService.getBaseLayerId).toBeDefined();
        expect(MapService.getBounds).toBeDefined();
        
        expect(MapService.init).toBeDefined();
        
        expect(MapService.addEventListener).toBeDefined();
        expect(MapService.addClickListener).toBeDefined();
        expect(MapService.addMouseMoveListener).toBeDefined();
        expect(MapService.addDoubleClickListener).toBeDefined();
        expect(MapService.addMoveHandler).toBeDefined();
        expect(MapService.addViewResetHandler).toBeDefined();
        
        expect(MapService.removeEventListeners).toBeDefined();
        expect(MapService.removeEventListener).toBeDefined();
        expect(MapService.removeMoveHandler).toBeDefined();
        expect(MapService.removeViewResetHandler).toBeDefined();
        
        expect(MapService.changeCursor).toBeDefined();
        expect(MapService.resetCursor).toBeDefined();
        
        expect(MapService.projectPoint).toBeDefined();
        
        expect(MapService.latLngToLayerPoint).toBeDefined();
        
        expect(MapService.showMapLayer).toBeDefined();
        expect(MapService.hideMapLayer).toBeDefined();
        
        expect(MapService.freezeMap).toBeDefined();
        expect(MapService.unFreezeMap).toBeDefined();
        
        expect(MapService.searchAddress).toBeDefined();
        
        expect(MapService.resetZoom).toBeDefined();
        expect(MapService.resetView).toBeDefined();
        expect(MapService.resizeFunction).toBeDefined();
        expect(MapService.setMinimumSize).toBeDefined();

    })

    it('should not display the map when service init', function() {
        expect(MapService.isMapVisible()).toBe(false);
    })

    it('should have osm in base layer when service init', function() {
        expect(MapService.getBaseLayerId()).toBe('osm')
    })

    describe('when we call showMapLayer', function() {

        it('should display the osm by default', function() {
            MapService.showMapLayer();
            expect(MapService.getBaseLayerId()).toBe('osm')
            expect(MapService.isMapVisible()).toBe(true)
        })

        it('should display the osm layer when asked for it', function() {
            MapService.showMapLayer('osm');
            expect(MapService.getBaseLayerId()).toBe('osm')
            expect(MapService.isMapVisible()).toBe(true)
        })

        it('should not change the layer when we show osm layer, then hide it, then show again', function() {
            MapService.showMapLayer('osm');
            expect(MapService.isMapVisible()).toBe(true)
            expect(MapService.getBaseLayerId()).toBe('osm')
            MapService.hideMapLayer();
            expect(MapService.isMapVisible()).toBe(false)
            expect(MapService.getBaseLayerId()).toBe('osm')
            MapService.showMapLayer();
            expect(MapService.isMapVisible()).toBe(true)
            expect(MapService.getBaseLayerId()).toBe('osm')
        })
    })


});
