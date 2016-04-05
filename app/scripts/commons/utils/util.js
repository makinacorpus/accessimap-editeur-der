/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.UtilService
 * @description
 * Service exposing utils functions
 */
(function() {
    'use strict';

    function UtilService() {

        this.convertImgToBase64 = convertImgToBase64;
        this.getiid = getiid;

        /**
         * @ngdoc method
         * @name  convertImgToBase64
         * @methodOf accessimapEditeurDerApp.UtilService
         * @description
         * Convert a png tile into a base64 image
         *
         * Useful for later edition in software like Inkscape for better display / edition
         * @param  {Object} tile [description]
         */
        function convertImgToBase64(tile) {
            if (tile) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = d3.select(tile).attr('href');
                img.onload = function() {
                    var canvas = document.createElement('CANVAS'),
                        ctx = canvas.getContext('2d');
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    var dataURL = canvas.toDataURL('image/png');
                    d3.select(tile).attr('href', dataURL);
                };
            }
        }

        var iid = 1;

        /**
         * ngdoc method
         * @name  getiid
         * @methodOf accessimapEditeurDerApp.UtilService
         * @description Function returning an unique identifier
         * Useful to store svg element with a uid
         * @return {integer} Fresh id !
         */
        function getiid() {
            return iid++;
        }
        
    }
    
    angular.module('accessimapEditeurDerApp')
        .service('UtilService', UtilService);

})();