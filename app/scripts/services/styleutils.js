'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.styleutils
 * @description
 * # styleutils
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('styleutils', ['settings',
    function(settings) {
        this.applyStyle = function(path, style, colorChosen) {
            // console.log(path, style, colorChosen);
            angular.forEach(style, function(attribute) {
                var k = attribute.k;
                var v = attribute.v;
                // console.log(k, v);
                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    path.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    path.attr(k, v);
                }
           });
        };
    }
]);
