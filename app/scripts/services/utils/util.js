'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.UtilService
 * @description
 * Service exposing utils functions
 */
angular.module('accessimapEditeurDerApp')
    .service('UtilService', function() {

        /**
         * @ngdoc method
         * @name  convertImgToBase64
         * @methodOf accessimapEditeurDerApp.UtilService
         * @description
         * Convert a png tile into a base64 image
         *
         * Useful for later edition in software like Inkscape for better display / edition
         * @param  {[type]} tile [description]
         */
        function convertImgToBase64(tile) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = d3.select(tile).attr('href');
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                var dataURL = canvas.toDataURL('image/png');
                d3.select(tile).attr('href', dataURL);
            };
        }
        
        return {
            convertImgToBase64: convertImgToBase64
        }
    });
