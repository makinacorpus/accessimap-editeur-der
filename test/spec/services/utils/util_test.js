'use strict';

describe('Service: UtilService', function () {

    beforeEach(module('accessimapEditeurDerApp'));

    var UtilService,
        $rootScope;

    beforeEach(inject(function (_UtilService_, _$rootScope_) {
        UtilService = _UtilService_;
        $rootScope = _$rootScope_;
    }));

    it('should create the UtilService service', function () {
        expect(UtilService).toBeDefined();
        expect(UtilService.convertImgToBase64).toBeDefined();
        expect(UtilService.getiid).toBeDefined();
    });

    it('should increase iid each time getiid is called', function() {
        expect(UtilService.getiid()).toBe(1);
        expect(UtilService.getiid()).toBe(2);
        expect(UtilService.getiid()).toBe(3);
    });

    it('should convert a png image into a base64', function() {
        //TODO: test convertImgToBase64 by mocking image loading ?...
        UtilService.convertImgToBase64(null)
        
    });
});
