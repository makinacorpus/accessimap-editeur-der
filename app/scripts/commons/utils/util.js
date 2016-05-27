/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.UtilService
 * @description
 * Service exposing utils functions
 */
(function() {
    'use strict';

    function UtilService($q) {

        this.convertImgToBase64 = convertImgToBase64;
        this.getiid             = getiid;
        this.uploadFile         = uploadFile;

        /**
         * @ngdoc method
         * @name  convertImgToBase64
         * @methodOf accessimapEditeurDerApp.UtilService
         * 
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
         * 
         * @description 
         * Function returning an unique identifier
         * Useful to store svg element with a uid
         * 
         * @return {integer} Fresh id !
         */
        function getiid() {
            return iid++;
        }

        /**
         * @ngdoc method
         * @name  uploadFile
         * @methodOf accessimapEditeurDerApp.UtilService
         *
         * @description 
         * Get a file and send back the dataUrl with the file type
         * 
         * @param  {Object} element  Input file object
         * @return {Promise}         Promise containing if success an object { type, dataUrl }
         */
        function uploadFile(element) {
            var file = element.files[0],
                fileType = file.type,
                reader = new FileReader(),
                deferred = $q.defer();

            reader.readAsDataURL(file);
            reader.onload = function(e) {
                deferred.resolve({type: fileType, dataUrl: e.target.result })
            };

            reader.onerror = deferred.reject;

            return deferred.promise;
        };        
    }
    
    angular.module(moduleApp).service('UtilService', UtilService);

    UtilService.$inject= ['$q'];

})();