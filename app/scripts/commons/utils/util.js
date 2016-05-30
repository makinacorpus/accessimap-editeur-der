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
        this.parseSVGPath         = parseSVGPath;
        this.serializeSVGPath         = serializeSVGPath;
        this.translateSVGPath         = translateSVGPath;

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
        }

        /**
         * https://github.com/jkroso/parse-svg-path/
         * @param  {[type]} path [description]
         * @return {[type]}      [description]
         */
        function parseSVGPath(path) {

            /**
             * expected argument lengths
             * @type {Object}
             */

            var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}

            /**
             * segment pattern
             * @type {RegExp}
             */

            var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig

            /**
             * parse an svg path data string. Generates an Array
             * of commands where each command is an Array of the
             * form `[command, arg1, arg2, ...]`
             *
             * @param {String} path
             * @return {Array}
             */

            var data = []
            path.replace(segment, function(_, command, args){
                var type = command.toLowerCase()
                args = parseValues(args)

                // overloaded moveTo
                if (type == 'm' && args.length > 2) {
                    data.push([command].concat(args.splice(0, 2)))
                    type = 'l'
                    command = command == 'm' ? 'l' : 'L'
                }

                while (true) {
                    if (args.length == length[type]) {
                        args.unshift(command)
                        return data.push(args)
                    }

                    if (args.length < length[type]) throw new Error('malformed path data')
                    data.push([command].concat(args.splice(0, length[type])))
                }
            })
            return data

            function parseValues(args){
                args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig)
                return args ? args.map(Number) : []
            }


        }

        /**
         * git@github.com:michaelrhodes/translate-svg-path.git
         * @param  {[type]} segments [description]
         * @param  {[type]} x        [description]
         * @param  {[type]} y        [description]
         * @return {[type]}          [description]
         */
        function translateSVGPath(segments, x, y) {
            // y is optional
            y = y || 0

            return segments.map(function(segment) {
                var cmd = segment[0]

                // Shift coords only for commands with absolute values
                if ('ACHLMRQSTVZ'.indexOf(cmd) === -1) {
                    return segment
                }

                var name  = cmd.toLowerCase()

                // V is the only command, with shifted coords parity
                if (name === 'v') {
                    segment[1] += y
                    return segment
                }

                // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
                // touch x, y only
                if (name === 'a') {
                    segment[6] += x
                    segment[7] += y
                    return segment
                }

                // All other commands have [cmd, x1, y1, x2, y2, x3, y3, ...] format
                return segment.map(function(val, i) {
                    if (!i) {
                        return val
                    }
                    return i % 2 ? val + x : val + y
                })
            })

        }

        /**
         * git://github.com/jkroso/serialize-svg-path.git
         * @param  {[type]} path [description]
         * @return {[type]}      [description]
         */
        function serializeSVGPath(path) {
            return path.reduce(function(str, seg) {
                return str + seg[0] + seg.slice(1).join(',')
            }, '')
        }
    }
    
    angular.module(moduleApp).service('UtilService', UtilService);

    UtilService.$inject= ['$q'];

})();