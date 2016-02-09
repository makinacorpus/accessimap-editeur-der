'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.geometry
 * @description
 * # geometry
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('geometry', ['generators', function(generators) {

        this.lineToCardinal = function(feature, scope) {
            var arr = feature.attr('d').split('L');
            if (arr.length > 1) { // line's type is linear
                var coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');
                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }
                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                feature.attr('d', generators.cardinalLineFunction(coords));
            } else { // line's type is cardinal
                arr = feature.attr('d').split(/[CQS]+/);
                var coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');
                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }
                    if (coordsArray.length > 2) {
                        var l = coordsArray.length;
                        coordsArray = [coordsArray[l - 2], coordsArray[l - 1]];
                    }
                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                feature.attr('d', generators.lineFunction(coords));
            }
        };
    }]);
