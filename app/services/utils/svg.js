/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SVGService
 * @description
 * Service exposing utils functions
 */
(function() {
    'use strict';

    function SVGService() {

        this.parseSVGPath             = parseSVGPath;
        this.serializeSVGPath         = serializeSVGPath;
        this.translateSVGPath         = translateSVGPath;
        
        this.circlePath               = circlePath;
        this.circleCrossPath          = circleCrossPath;
        this.ovalPath                 = ovalPath;
        this.trianglePath             = trianglePath;
        this.squarePath               = squarePath;
        this.northOrientation         = northOrientation;
        this.squareDiagPath           = squareDiagPath;
        this.squareCrossPath          = squareCrossPath;
        this.crossPath                = crossPath;
        this.horizontalRectPath       = horizontalRectPath;
        this.horizontalArrowPath      = horizontalArrowPath;
        this.horizontalSmallArrowPath = horizontalSmallArrowPath;


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

            var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},

            /**
             * segment pattern
             * @type {RegExp}
             */

            segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig ,

            /**
             * parse an svg path data string. Generates an Array
             * of commands where each command is an Array of the
             * form `[command, arg1, arg2, ...]`
             *
             * @param {String} path
             * @return {Array}
             */

            data = []

            path.replace(segment, function(_, command, args) {
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

            function parseValues(args) {
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

        function circlePath(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r + ', 0';
            d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
            d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';

            return d;
        };

        function circleCrossPath(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r + ', 0';
            d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
            d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';
            d += ' Z';
            r = r / Math.cos(45 * Math.PI / 180);
            d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' Z';
            d += ' M ' + (cx - r / 2) + ' ' + (cy + r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy - r / 2);
            d += ' Z';

            return d;
        };

        function ovalPath(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r / 2 + ', 0';
            d += ' a ' + r / 2 + ',' + r + ' 0 1,0 ' + r + ',0';
            d += ' a ' + r / 2 + ',' + r + ' 0 1,0 -' + r + ',0';

            return d;
        };

        function trianglePath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + cy;
            d += ' L' + cx + ' ' + (cy - Math.sqrt(3 * r * r / 4));
            d += ' L' + (cx + r / 2) + ' ' + cy;
            d += ' Z';

            return d;
        };

        function squarePath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' v' + r;
            d += ' h' + r;
            d += ' v' + (-r);
            d += ' Z';

            return d;
        };

        function northOrientation(cx, cy, r) {
            var d = 'M ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' h' + (-r);
            d += ' Z';
            d += 'M ' + cx + ' ' + (cy + r / 2);
            d += ' v' + (-r);
            d += ' Z';

            return d;
        };

        function squareDiagPath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' v' + r;
            d += ' h' + r;
            d += ' v' + (-r);
            d += ' Z';
            d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' Z';

            return d;
        };

        function squareCrossPath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' v' + r;
            d += ' h' + r;
            d += ' v' + (-r);
            d += ' Z';
            d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' Z';
            d += ' M ' + (cx - r / 2) + ' ' + (cy + r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy - r / 2);
            d += ' Z';

            return d;
        };

        function crossPath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + cy;
            d += ' h' + r;
            d += ' Z';
            d += 'M ' + cx + ' ' + (cy - r / 2);
            d += ' v' + r;
            d += ' Z';

            return d;
        };

        function horizontalRectPath(cx, cy, r) {
            var d = 'M ' + (cx - r / 2) + ' ' + cy;
            d += ' h' + r;
            d += ' Z';

            return d;
        };

        function horizontalArrowPath(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy - 3 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy + 3 * r / 10);
            d += ' Z';

            return d;
        };

        function horizontalSmallArrowPath(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy - 4 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy + 4 * r / 10);
            d += ' Z';

            return d;
        };
    }
    
    angular.module(moduleApp).service('SVGService', SVGService);

    SVGService.$inject= [];

})();