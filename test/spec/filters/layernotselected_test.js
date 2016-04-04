'use strict';

describe('Filter: layerNotSelected', function () {

    // load the filter's module
    beforeEach(module('accessimapEditeurDerApp'));

    // initialize a new instance of the filter before each test
    var layerNotSelected;
    beforeEach(inject(function ($filter) {
        layerNotSelected = $filter('layerNotSelected');
    }));

    it('should return layers not selected', function () {

        var layers = [
                {id: 1, v: 'pouic1'},
                {id: 2, v: 'pouic2'},
                {id: 3, v: 'pouic3'},
            ], 
            selectedLayers1 = [
                {id: 1, v: 'pouic1'},
                {id: 3, v: 'pouic3'},
            ], 
            selectedLayers2 = [
                {id: 2, v: 'pouic2'},
                {id: 3, v: 'pouic3'},
            ], 
            selectedLayers3 = null, 
            result;

        expect(layerNotSelected(layers, selectedLayers1)).toEqual([{id:2, v: 'pouic2'}]);
        expect(layerNotSelected(layers, selectedLayers2)).toEqual([{id:1, v: 'pouic1'}]);
        expect(layerNotSelected(layers, selectedLayers3)).toEqual(layers);

    });

});
