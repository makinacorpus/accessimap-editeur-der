'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.editSvg
 * @description
 * # editSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('editSvg', function() {
    this.circlePath = function(cx, cy, r) {
      var d = 'M ' + cx + ' ' + cy;
          d += ' m -' + r + ', 0';
          d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
          d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';
      return d;
    };
    this.trianglePath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + cy;
          d += ' L' + cx + ' ' + (cy - Math.sqrt(3 * r * r / 4));
          d += ' L' + (cx + r / 2) + ' ' + cy;
          d += ' Z';
      return d;
    };
  });
