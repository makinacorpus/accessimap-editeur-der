
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.styleutils
 * @description
 * # styleutils
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function styleutils(settings) {
        this.applyStyle = function(path, style, colorChosen) {
            angular.forEach(style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

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
    
    angular.module(moduleApp)
        .service('styleutils', styleutils)
    
    styleutils.$inject = ['settings'];
    
})();